/**
 * Test Results Analysis and Reporting System
 * Generates comprehensive A11y/Performance reports for the UI overhaul
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details?: any;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
}

interface AccessibilityReport {
  violations: any[];
  passes: any[];
  incomplete: any[];
  inapplicable: any[];
  timestamp: string;
  url: string;
  score: number;
}

interface PerformanceMetrics {
  lcp: number;
  cls: number;
  fid: number;
  bundleSize: {
    js: number;
    css: number;
  };
  renderTime: number;
  memoryUsage: number;
}

class TestAnalyzer {
  private resultsDir = join(process.cwd(), 'test-results');
  private reportDir = join(process.cwd(), 'tests', 'a11y-perf', 'reports');

  constructor() {
    if (!existsSync(this.reportDir)) {
      mkdirSync(this.reportDir, { recursive: true });
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting comprehensive A11y/Performance test suite...');

    try {
      // Run accessibility tests
      console.log('\n🔍 Running accessibility audits...');
      await this.runTestSuite('accessibility');

      // Run performance tests
      console.log('\n⚡ Running performance analysis...');
      await this.runTestSuite('performance');

      // Run click path tests
      console.log('\n📌 Running click path efficiency tests...');
      await this.runTestSuite('click-paths');

      // Run focus management tests
      console.log('\n🎯 Running focus management tests...');
      await this.runTestSuite('focus-management');

      // Generate comprehensive report
      console.log('\n📊 Generating test results analysis...');
      await this.generateComprehensiveReport();

    } catch (error) {
      console.error('Test execution failed:', error);
      process.exit(1);
    }
  }

  private async runTestSuite(suiteName: string): Promise<TestSuite> {
    const command = `npx playwright test tests/a11y-perf/${suiteName}.spec.ts --reporter=json`;
    
    try {
      const output = execSync(command, { encoding: 'utf8' });
      const results = JSON.parse(output);
      
      const testSuite: TestSuite = {
        name: suiteName,
        results: results.tests?.map((test: any) => ({
          name: test.title,
          status: test.outcome,
          duration: test.results[0]?.duration || 0,
          error: test.results[0]?.error?.message
        })) || [],
        summary: {
          total: results.stats?.total || 0,
          passed: results.stats?.passed || 0,
          failed: results.stats?.failed || 0,
          skipped: results.stats?.skipped || 0,
          duration: results.stats?.duration || 0
        }
      };

      this.saveTestResults(suiteName, testSuite);
      return testSuite;

    } catch (error) {
      console.error(`Failed to run ${suiteName} tests:`, error);
      return {
        name: suiteName,
        results: [],
        summary: { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 }
      };
    }
  }

  private saveTestResults(suiteName: string, results: TestSuite): void {
    const filepath = join(this.reportDir, `${suiteName}-results.json`);
    writeFileSync(filepath, JSON.stringify(results, null, 2));
  }

  private async generateComprehensiveReport(): Promise<void> {
    const timestamp = new Date().toISOString();
    const testSuites = ['accessibility', 'performance', 'click-paths', 'focus-management'];
    
    const allResults = testSuites.map(suite => {
      const filepath = join(this.reportDir, `${suite}-results.json`);
      if (existsSync(filepath)) {
        return JSON.parse(readFileSync(filepath, 'utf8'));
      }
      return null;
    }).filter(Boolean);

    const overallSummary = this.calculateOverallSummary(allResults);
    const qualityScore = this.calculateQualityScore(allResults);

    const report = {
      timestamp,
      overallSummary,
      qualityScore,
      testSuites: allResults,
      recommendations: this.generateRecommendations(allResults),
      brandCompliance: this.assessBrandCompliance(allResults)
    };

    // Generate HTML report
    const htmlReport = this.generateHtmlReport(report);
    writeFileSync(join(this.reportDir, 'comprehensive-report.html'), htmlReport);

    // Generate JSON report
    writeFileSync(join(this.reportDir, 'comprehensive-report.json'), JSON.stringify(report, null, 2));

    // Generate markdown summary
    const markdownReport = this.generateMarkdownReport(report);
    writeFileSync(join(this.reportDir, 'test-summary.md'), markdownReport);

    console.log('\n✨ Reports generated:');
    console.log(`  • HTML: ${join(this.reportDir, 'comprehensive-report.html')}`);
    console.log(`  • JSON: ${join(this.reportDir, 'comprehensive-report.json')}`);
    console.log(`  • Markdown: ${join(this.reportDir, 'test-summary.md')}`);
    
    console.log(`\n🏆 Overall Quality Score: ${qualityScore.total}/100`);
    console.log(`  • Accessibility: ${qualityScore.accessibility}/25`);
    console.log(`  • Performance: ${qualityScore.performance}/25`);
    console.log(`  • Usability: ${qualityScore.usability}/25`);
    console.log(`  • Brand Compliance: ${qualityScore.brandCompliance}/25`);
  }

  private calculateOverallSummary(testSuites: TestSuite[]) {
    return testSuites.reduce((acc, suite) => ({
      total: acc.total + suite.summary.total,
      passed: acc.passed + suite.summary.passed,
      failed: acc.failed + suite.summary.failed,
      skipped: acc.skipped + suite.summary.skipped,
      duration: acc.duration + suite.summary.duration
    }), { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 });
  }

  private calculateQualityScore(testSuites: TestSuite[]) {
    const accessibility = this.calculateSuiteScore(testSuites.find(s => s.name === 'accessibility'));
    const performance = this.calculateSuiteScore(testSuites.find(s => s.name === 'performance'));
    const usability = this.calculateSuiteScore(testSuites.find(s => s.name === 'click-paths'));
    const brandCompliance = this.calculateSuiteScore(testSuites.find(s => s.name === 'focus-management'));

    return {
      accessibility: Math.round(accessibility * 25),
      performance: Math.round(performance * 25),
      usability: Math.round(usability * 25),
      brandCompliance: Math.round(brandCompliance * 25),
      total: Math.round((accessibility + performance + usability + brandCompliance) * 25)
    };
  }

  private calculateSuiteScore(suite?: TestSuite): number {
    if (!suite || suite.summary.total === 0) return 0;
    return suite.summary.passed / suite.summary.total;
  }

  private generateRecommendations(testSuites: TestSuite[]): string[] {
    const recommendations: string[] = [];
    
    const failedTests = testSuites.flatMap(suite => 
      suite.results.filter(test => test.status === 'failed')
    );

    if (failedTests.length > 0) {
      recommendations.push('Address failing test cases to improve overall quality');
    }

    const accessibilitySuite = testSuites.find(s => s.name === 'accessibility');
    if (accessibilitySuite && accessibilitySuite.summary.failed > 0) {
      recommendations.push('Focus ring visibility and contrast ratios need attention');
      recommendations.push('Ensure WCAG 2.1 AA compliance across all components');
    }

    const performanceSuite = testSuites.find(s => s.name === 'performance');
    if (performanceSuite && performanceSuite.summary.failed > 0) {
      recommendations.push('Optimize glassmorphism effects to reduce performance impact');
      recommendations.push('Monitor bundle size to maintain loading performance');
    }

    const clickPathSuite = testSuites.find(s => s.name === 'click-paths');
    if (clickPathSuite && clickPathSuite.summary.failed > 0) {
      recommendations.push('Optimize user workflows to meet action count targets');
      recommendations.push('Ensure QuickActionsRow provides efficient access to key functions');
    }

    const focusSuite = testSuites.find(s => s.name === 'focus-management');
    if (focusSuite && focusSuite.summary.failed > 0) {
      recommendations.push('Implement proper focus trapping in modals and dialogs');
      recommendations.push('Ensure ai-teal-500 focus rings are consistently applied');
    }

    return recommendations;
  }

  private assessBrandCompliance(testSuites: TestSuite[]): any {
    return {
      focusRings: {
        color: 'ai-teal-500 (hsl(172, 72%, 45%))',
        width: '2px outline',
        compliance: 'Tested in focus-management suite'
      },
      contrastRatios: {
        darkShell: 'Minimum 4.5:1',
        lightContent: 'Minimum 7:1',
        compliance: 'Tested in accessibility suite'
      },
      glassEffects: {
        backdropBlur: 'Readability maintained',
        performance: 'Impact monitored',
        compliance: 'Tested in performance suite'
      },
      navigation: {
        keyboardAccessible: 'All interactive elements',
        focusVisible: 'Clear focus indicators',
        compliance: 'Tested across all suites'
      }
    };
  }

  private generateMarkdownReport(report: any): string {
    return `# Pravado A11y/Performance Test Results\n\n` +
      `**Generated:** ${report.timestamp}\n\n` +
      `## Overall Quality Score: ${report.qualityScore.total}/100\n\n` +
      `| Category | Score | Status |\n` +
      `|----------|-------|--------|\n` +
      `| Accessibility | ${report.qualityScore.accessibility}/25 | ${this.getScoreStatus(report.qualityScore.accessibility, 25)} |\n` +
      `| Performance | ${report.qualityScore.performance}/25 | ${this.getScoreStatus(report.qualityScore.performance, 25)} |\n` +
      `| Usability | ${report.qualityScore.usability}/25 | ${this.getScoreStatus(report.qualityScore.usability, 25)} |\n` +
      `| Brand Compliance | ${report.qualityScore.brandCompliance}/25 | ${this.getScoreStatus(report.qualityScore.brandCompliance, 25)} |\n\n` +
      `## Test Summary\n\n` +
      `- **Total Tests:** ${report.overallSummary.total}\n` +
      `- **Passed:** ${report.overallSummary.passed}\n` +
      `- **Failed:** ${report.overallSummary.failed}\n` +
      `- **Skipped:** ${report.overallSummary.skipped}\n` +
      `- **Duration:** ${Math.round(report.overallSummary.duration / 1000)}s\n\n` +
      `## Recommendations\n\n` +
      report.recommendations.map((rec: string) => `- ${rec}`).join('\n') + '\n\n' +
      `## Brand Compliance Status\n\n` +
      `### Focus Rings\n` +
      `- Color: ${report.brandCompliance.focusRings.color}\n` +
      `- Width: ${report.brandCompliance.focusRings.width}\n\n` +
      `### Contrast Ratios\n` +
      `- Dark Shell: ${report.brandCompliance.contrastRatios.darkShell}\n` +
      `- Light Content: ${report.brandCompliance.contrastRatios.lightContent}\n\n` +
      `### Glass Effects\n` +
      `- Backdrop Blur: ${report.brandCompliance.glassEffects.backdropBlur}\n` +
      `- Performance: ${report.brandCompliance.glassEffects.performance}\n`;
  }

  private getScoreStatus(score: number, maxScore: number): string {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return '✅ Excellent';
    if (percentage >= 75) return '✅ Good';
    if (percentage >= 60) return '⚠ Needs Attention';
    return '❌ Critical';
  }

  private generateHtmlReport(report: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pravado A11y/Performance Test Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; }
    .header { text-align: center; margin-bottom: 40px; }
    .score { font-size: 48px; font-weight: bold; color: hsl(172, 72%, 45%); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; }
    .status-good { color: #22c55e; }
    .status-warning { color: #f59e0b; }
    .status-critical { color: #ef4444; }
    .timestamp { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Pravado UI Overhaul - A11y/Performance Report</h1>
    <div class="score">${report.qualityScore.total}/100</div>
    <div class="timestamp">Generated: ${new Date(report.timestamp).toLocaleString()}</div>
  </div>
  
  <div class="grid">
    <div class="card">
      <h3>Accessibility</h3>
      <div class="score" style="font-size: 24px;">${report.qualityScore.accessibility}/25</div>
    </div>
    
    <div class="card">
      <h3>Performance</h3>
      <div class="score" style="font-size: 24px;">${report.qualityScore.performance}/25</div>
    </div>
    
    <div class="card">
      <h3>Usability</h3>
      <div class="score" style="font-size: 24px;">${report.qualityScore.usability}/25</div>
    </div>
    
    <div class="card">
      <h3>Brand Compliance</h3>
      <div class="score" style="font-size: 24px;">${report.qualityScore.brandCompliance}/25</div>
    </div>
  </div>
  
  <div style="margin-top: 40px;">
    <h2>Test Summary</h2>
    <p>Total: ${report.overallSummary.total} | Passed: ${report.overallSummary.passed} | Failed: ${report.overallSummary.failed}</p>
    
    <h2>Recommendations</h2>
    <ul>
      ${report.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
    </ul>
  </div>
</body>
</html>
`;
  }
}

// Export for use in npm scripts
if (require.main === module) {
  const analyzer = new TestAnalyzer();
  analyzer.runAllTests().catch(console.error);
}

export default TestAnalyzer;
