#!/usr/bin/env node
/**
 * P6 AI-First Brand Compliance Audit - No Exceptions Policy
 * 
 * Automated validation for:
 * - HSL-only color usage (no hex/rgb)
 * - Brand token compliance (teal/gold only)
 * - Content island validation (data-surface)
 * - Link color enforcement (no default blue)
 * 
 * Usage: npm run audit:brand
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BrandViolation {
  file: string;
  line: number;
  column: number;
  violation: string;
  current: string;
  fix: string;
  severity: 'error' | 'warning';
}

class BrandAuditor {
  private violations: BrandViolation[] = [];
  private readonly BRAND_COLORS = {
    teal: ['ai-teal-300', 'ai-teal-500', 'ai-teal-700'],
    gold: ['ai-gold-300', 'ai-gold-500', 'ai-gold-700'],
    system: ['background', 'foreground', 'panel', 'border', 'brand']
  };

  private readonly VIOLATION_PATTERNS = [
    // Hex colors (strict enforcement)
    {
      pattern: /#[0-9a-fA-F]{3,8}/g,
      violation: 'Hex colors forbidden - use HSL variables only',
      severity: 'error' as const,
      getFix: (match: string) => this.suggestHSLReplacement(match)
    },
    
    // RGB colors (strict enforcement)
    {
      pattern: /rgb\([^)]+\)/g,
      violation: 'RGB colors forbidden - use HSL variables only',
      severity: 'error' as const,
      getFix: (match: string) => this.suggestHSLReplacement(match)
    },
    
    // Tailwind blue classes (brand violation)
    {
      pattern: /(?:text-|bg-|border-)blue-\d+/g,
      violation: 'Default blue forbidden - use brand teal',
      severity: 'error' as const,
      getFix: (match: string) => match.replace(/blue-(\d+)/, 'ai-teal-$1')
    },
    
    // Generic white backgrounds without surface attribute
    {
      pattern: /(?:bg-white|background:\s*white|background-color:\s*white)/g,
      violation: 'Generic white forbidden - use data-surface="content" for content islands',
      severity: 'error' as const,
      getFix: () => 'bg-panel with data-surface="content" attribute'
    },
    
    // Default link colors
    {
      pattern: /color:\s*#646cff|color:\s*blue/g,
      violation: 'Default link blue forbidden - use brand teal',
      severity: 'error' as const,
      getFix: () => 'color: hsl(var(--ai-teal-300))'
    },
    
    // Non-brand color classes
    {
      pattern: /(?:text-|bg-|border-)(?:red|green|yellow|purple|pink|indigo|cyan|orange)-\d+/g,
      violation: 'Non-brand colors detected - use semantic or brand tokens',
      severity: 'warning' as const,
      getFix: (match: string) => this.suggestSemanticReplacement(match)
    }
  ];

  private readonly CONTENT_PAGES = ['/dashboard', '/content', '/analytics'];

  async auditProject(srcDir: string): Promise<BrandViolation[]> {
    console.log('🎨 Starting Brand Compliance Audit...\n');
    
    await this.scanDirectory(srcDir);
    
    if (this.violations.length === 0) {
      console.log('✅ Brand compliance: PASSED');
      console.log('All files follow Pravado design system guidelines\n');
    } else {
      this.reportViolations();
    }
    
    return this.violations;
  }

  private async scanDirectory(dir: string): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        await this.scanDirectory(fullPath);
      } else if (this.isRelevantFile(entry.name)) {
        await this.auditFile(fullPath);
      }
    }
  }

  private isRelevantFile(filename: string): boolean {
    const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.sass'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  private async auditFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(process.cwd(), filePath);

    // Check for content island violations
    if (this.isContentPage(relativePath)) {
      this.checkContentIslandCompliance(lines, relativePath);
    }

    // Check color violations
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      this.checkLineViolations(line, lineIndex, relativePath);
    }
  }

  private isContentPage(filePath: string): boolean {
    return this.CONTENT_PAGES.some(page => 
      filePath.includes(`pages${page.slice(1)}`) || filePath.includes(`${page.slice(1)}.tsx`)
    );
  }

  private checkContentIslandCompliance(lines: string[], filePath: string): void {
    const hasContentSurface = lines.some(line => 
      line.includes('data-surface="content"')
    );

    if (!hasContentSurface) {
      this.violations.push({
        file: filePath,
        line: 1,
        column: 1,
        violation: 'Content page missing data-surface="content" for light content islands',
        current: 'No content surface defined',
        fix: 'Add data-surface="content" to main content containers',
        severity: 'error'
      });
    }
  }

  private checkLineViolations(line: string, lineIndex: number, filePath: string): void {
    for (const rule of this.VIOLATION_PATTERNS) {
      const matches = Array.from(line.matchAll(rule.pattern));
      
      for (const match of matches) {
        if (match.index === undefined) continue;
        
        this.violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          violation: rule.violation,
          current: match[0],
          fix: rule.getFix(match[0]),
          severity: rule.severity
        });
      }
    }
  }

  private suggestHSLReplacement(colorValue: string): string {
    // Common color mappings to brand tokens
    const colorMap: Record<string, string> = {
      '#646cff': 'hsl(var(--ai-teal-300))',
      '#535bf2': 'hsl(var(--ai-teal-500))',
      '#ffffff': 'hsl(var(--panel))',
      '#000000': 'hsl(var(--foreground))',
      'rgb(100, 108, 255)': 'hsl(var(--ai-teal-300))',
      'white': 'hsl(var(--panel))',
      'black': 'hsl(var(--foreground))'
    };

    return colorMap[colorValue.toLowerCase()] || 'Use appropriate HSL brand token';
  }

  private suggestSemanticReplacement(classValue: string): string {
    if (classValue.includes('red')) return classValue.replace(/red-\d+/, 'danger');
    if (classValue.includes('green')) return classValue.replace(/green-\d+/, 'success');
    if (classValue.includes('yellow')) return classValue.replace(/yellow-\d+/, 'warning');
    return 'Use semantic color tokens (success, warning, danger) or brand tokens';
  }

  private reportViolations(): void {
    const errors = this.violations.filter(v => v.severity === 'error');
    const warnings = this.violations.filter(v => v.severity === 'warning');
    
    console.log(`❌ Brand compliance: FAILED`);
    console.log(`Found ${errors.length} errors, ${warnings.length} warnings\n`);
    
    // Group by file for better readability
    const byFile = this.violations.reduce((acc, violation) => {
      if (!acc[violation.file]) acc[violation.file] = [];
      acc[violation.file].push(violation);
      return acc;
    }, {} as Record<string, BrandViolation[]>);
    
    Object.entries(byFile).forEach(([file, violations]) => {
      console.log(`📁 ${file}`);
      violations.forEach(v => {
        const icon = v.severity === 'error' ? '  ❌' : '  ⚠️ ';
        console.log(`${icon} Line ${v.line}:${v.column}`);
        console.log(`     Issue: ${v.violation}`);
        console.log(`     Found: ${v.current}`);
        console.log(`     Fix:   ${v.fix}`);
        console.log();
      });
    });
    
    if (errors.length > 0) {
      console.log('🚫 Build will fail due to brand violations');
      console.log('Fix all errors before merging to maintain brand consistency\n');
    }
  }
}

// CLI execution
async function main() {
  const srcDir = process.argv[2] || 'src';
  const auditor = new BrandAuditor();
  const violations = await auditor.auditProject(srcDir);
  
  const errors = violations.filter(v => v.severity === 'error');
  process.exit(errors.length > 0 ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { BrandAuditor, type BrandViolation };