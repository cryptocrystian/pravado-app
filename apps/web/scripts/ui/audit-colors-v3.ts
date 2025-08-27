#!/usr/bin/env node
/**
 * V3 Brand Compliance Audit - Zero Tolerance Policy
 * 
 * Enforces:
 * - HSL-only color usage (no hex/rgb) 
 * - Brand token compliance (teal/gold only)
 * - Content island validation (data-surface="content")
 * - No bg-white, text-blue-*, or default pills
 * - Dashboard/Analytics/Content require islands
 * 
 * Usage: npm run audit:brand:v3
 * CI: Fails build on any violation
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

class BrandAuditorV3 {
  private violations: BrandViolation[] = [];
  private readonly BRAND_COLORS = {
    teal: ['ai-teal-300', 'ai-teal-500', 'ai-teal-700'],
    gold: ['ai-gold-300', 'ai-gold-500', 'ai-gold-700'],
    system: ['background', 'foreground', 'panel', 'island', 'border', 'brand']
  };

  private readonly VIOLATION_PATTERNS = [
    // Hex colors (strict enforcement)
    {
      pattern: /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g,
      violation: 'Hex colors forbidden - use HSL variables only',
      severity: 'error' as const,
      getFix: (match: string) => this.suggestHSLReplacement(match),
      exclude: ['#fff'] // Allow #fff in color: #fff for buttons
    },
    
    // RGB colors (strict enforcement)
    {
      pattern: /rgb\([^)]+\)/g,
      violation: 'RGB colors forbidden - use HSL variables only',
      severity: 'error' as const,
      getFix: (match: string) => 'Use appropriate HSL brand token'
    },
    
    // Generic white backgrounds (V3 strict)
    {
      pattern: /\bbg-white\b/g,
      violation: 'bg-white forbidden - use bg-island with data-surface="content"',
      severity: 'error' as const,
      getFix: () => 'bg-island with data-surface="content" attribute'
    },
    
    // Blue color classes (V3 forbidden)
    {
      pattern: /\b(text|bg|border)-blue-[0-9]+\b/g,
      violation: 'Default blue colors forbidden - use AI brand tokens',
      severity: 'error' as const,
      getFix: (match: string) => match.includes('text') ? 'text-ai-teal-300' : 'Use ai-teal-* or ai-gold-*'
    },
    
    // White pills in sidebar
    {
      pattern: /sidebar.*pill.*white|white.*pill.*sidebar/gi,
      violation: 'White pills in sidebar forbidden - use compact glass list',
      severity: 'error' as const,
      getFix: () => 'Use compact glass list with teal active indicator'
    }
  ];

  private readonly REQUIRED_ISLANDS = [
    {
      pages: ['/dashboard', 'Dashboard.tsx', 'DashboardV3.tsx'],
      pattern: /data-surface="content"/,
      violation: 'Dashboard main content must have data-surface="content"',
      severity: 'error' as const
    },
    {
      pages: ['/analytics', 'Analytics.tsx'],
      pattern: /data-surface="content"/,
      violation: 'Analytics main content must have data-surface="content"',
      severity: 'error' as const  
    },
    {
      pages: ['/content', 'ContentStudio.tsx'],
      pattern: /data-surface="content"/,
      violation: 'Content Studio main content must have data-surface="content"',
      severity: 'error' as const
    }
  ];

  async auditProject(srcDir: string): Promise<BrandViolation[]> {
    console.log('🎨 Starting V3 Brand Compliance Audit...\n');
    
    await this.scanDirectory(srcDir);
    
    if (this.violations.length === 0) {
      console.log('✅ Brand compliance V3: PASSED');
      console.log('All files follow V3 design system guidelines\n');
    } else {
      this.reportViolations();
    }
    
    return this.violations;
  }

  private async scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', '.git'].includes(entry.name)) {
          await this.scanDirectory(fullPath);
        }
      } else if (this.isTargetFile(entry.name)) {
        await this.auditFile(fullPath);
      }
    }
  }

  private isTargetFile(filename: string): boolean {
    const extensions = ['.tsx', '.jsx', '.ts', '.js', '.css'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  private async auditFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileName = path.basename(filePath);
    
    // Check violation patterns
    lines.forEach((line, index) => {
      this.VIOLATION_PATTERNS.forEach(({ pattern, violation, severity, getFix, exclude }) => {
        const matches = line.matchAll(pattern);
        
        for (const match of matches) {
          if (exclude && exclude.includes(match[0])) continue;
          if (match.index !== undefined) {
            this.violations.push({
              file: path.relative(process.cwd(), filePath),
              line: index + 1,
              column: match.index + 1,
              violation,
              current: match[0],
              fix: getFix(match[0]),
              severity
            });
          }
        }
      });
    });
    
    // Check required islands for specific pages
    this.REQUIRED_ISLANDS.forEach(({ pages, pattern, violation, severity }) => {
      if (pages.some(page => fileName.includes(page))) {
        if (!content.match(pattern)) {
          this.violations.push({
            file: path.relative(process.cwd(), filePath),
            line: 1,
            column: 1,
            violation,
            current: 'Missing data-surface="content"',
            fix: 'Add data-surface="content" to main content wrapper',
            severity
          });
        }
      }
    });
  }

  private suggestHSLReplacement(hex: string): string {
    // Common replacements
    const replacements: Record<string, string> = {
      '#20c5aa': 'hsl(var(--ai-teal-500))',
      '#f5aa14': 'hsl(var(--ai-gold-500))',
      '#000': 'hsl(0 0% 0%)',
      '#fff': 'hsl(0 0% 100%)',
      '#ffffff': 'hsl(0 0% 100%)'
    };
    
    return replacements[hex.toLowerCase()] || 'Use appropriate HSL brand token';
  }

  private reportViolations() {
    const errors = this.violations.filter(v => v.severity === 'error');
    const warnings = this.violations.filter(v => v.severity === 'warning');
    
    console.log(`❌ Brand compliance V3: FAILED`);
    console.log(`Found ${errors.length} errors, ${warnings.length} warnings\n`);
    
    // Group by file
    const byFile = this.violations.reduce((acc, violation) => {
      if (!acc[violation.file]) acc[violation.file] = [];
      acc[violation.file].push(violation);
      return acc;
    }, {} as Record<string, BrandViolation[]>);
    
    Object.entries(byFile).forEach(([file, violations]) => {
      console.log(`📁 ${file}`);
      violations.forEach(v => {
        const icon = v.severity === 'error' ? '  ❌' : '  ⚠️';
        console.log(`${icon} Line ${v.line}:${v.column}`);
        console.log(`     Issue: ${v.violation}`);
        console.log(`     Found: ${v.current}`);
        console.log(`     Fix:   ${v.fix}`);
        console.log('');
      });
    });
    
    console.log('🚫 Build will fail due to brand violations');
    console.log('Fix all errors before merging to maintain V3 brand consistency');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new BrandAuditorV3();
  const srcDir = process.argv[2] || path.join(__dirname, '../../src');
  
  auditor.auditProject(srcDir).then(violations => {
    process.exit(violations.filter(v => v.severity === 'error').length > 0 ? 1 : 0);
  });
}