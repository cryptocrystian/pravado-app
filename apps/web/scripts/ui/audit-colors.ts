#!/usr/bin/env node

/**
 * PR2 - CI Guard: Color Audit Script
 * 
 * Enforces brand color compliance by failing on:
 * - bg-white usage
 * - text-blue-* usage  
 * - Direct hex/rgb values in src/**
 * 
 * Runs in CI on PRs to prevent off-brand colors
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ColorViolation {
  file: string;
  line: number;
  column: number;
  pattern: string;
  context: string;
  severity: 'error' | 'warning';
}

class ColorAuditor {
  private violations: ColorViolation[] = [];
  private srcDir = join(process.cwd(), 'src');

  // Patterns that violate brand guidelines
  private readonly bannedPatterns = [
    {
      pattern: /\bbg-white\b/g,
      message: 'Use hsl(var(--panel)) or hsl(var(--bg)) instead of bg-white',
      severity: 'error' as const
    },
    {
      pattern: /\btext-blue-\w+/g,
      message: 'Use ai-teal-* brand colors instead of text-blue-*',
      severity: 'error' as const
    },
    {
      pattern: /#[0-9a-fA-F]{3,8}\b/g,
      message: 'Use CSS variables instead of hex colors',
      severity: 'error' as const
    },
    {
      pattern: /\brgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,
      message: 'Use hsl(var(--token)) instead of rgb() values',
      severity: 'error' as const
    },
    {
      pattern: /\brgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g,
      message: 'Use hsl(var(--token) / alpha) instead of rgba() values',
      severity: 'error' as const
    }
  ];

  // Files to exclude from audit
  private readonly excludeFiles = [
    'chartTheme.ts', // Charts may need specific colors
    'globals.css',   // Contains legacy color definitions
    'audit-colors.ts' // This script itself
  ];

  // Extensions to audit
  private readonly includeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'];

  auditDirectory(dir: string): void {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        this.auditDirectory(filePath);
      } else if (this.shouldAuditFile(filePath)) {
        this.auditFile(filePath);
      }
    }
  }

  private shouldAuditFile(filePath: string): boolean {
    const fileName = filePath.split('/').pop() || '';
    
    // Skip excluded files
    if (this.excludeFiles.some(exclude => fileName.includes(exclude))) {
      return false;
    }
    
    // Only include specific extensions
    return this.includeExtensions.some(ext => filePath.endsWith(ext));
  }

  private auditFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, lineIndex) => {
        this.bannedPatterns.forEach(({ pattern, message, severity }) => {
          let match;
          // Reset regex to avoid issues with global flag
          pattern.lastIndex = 0;
          
          while ((match = pattern.exec(line)) !== null) {
            this.violations.push({
              file: filePath.replace(process.cwd() + '/', ''),
              line: lineIndex + 1,
              column: match.index + 1,
              pattern: match[0],
              context: line.trim(),
              severity
            });
            
            // Avoid infinite loop with global regex
            if (!pattern.global) break;
          }
        });
      });
      
    } catch (error) {
      console.warn(`Could not read file ${filePath}:`, error);
    }
  }

  reportViolations(): boolean {
    if (this.violations.length === 0) {
      console.log('✅ Color audit passed - no brand violations found');
      return true;
    }

    console.log('\n🚨 Brand Color Violations Found:\n');

    // Group by severity
    const errors = this.violations.filter(v => v.severity === 'error');
    const warnings = this.violations.filter(v => v.severity === 'warning');

    if (errors.length > 0) {
      console.log('❌ ERRORS (will fail CI):');
      errors.forEach(violation => {
        console.log(`  ${violation.file}:${violation.line}:${violation.column}`);
        console.log(`    Pattern: "${violation.pattern}"`);
        console.log(`    Context: ${violation.context}`);
        console.log(`    Fix: Use brand tokens instead of direct colors\n`);
      });
    }

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      warnings.forEach(violation => {
        console.log(`  ${violation.file}:${violation.line}:${violation.column}`);
        console.log(`    Pattern: "${violation.pattern}"`);
        console.log(`    Context: ${violation.context}\n`);
      });
    }

    console.log('\n📖 Brand Guidelines:');
    console.log('  • Use hsl(var(--ai-teal-300/500/700)) for primary accents');
    console.log('  • Use hsl(var(--ai-gold-300/500/700)) for secondary accents');
    console.log('  • Use hsl(var(--panel)) instead of bg-white');
    console.log('  • Use hsl(var(--fg)) instead of text-black');
    console.log('  • Use CSS variables instead of hex/rgb values');
    console.log('\n  See tailwind.config.js for full color system');

    // Return true if only warnings, false if errors
    return errors.length === 0;
  }

  run(): boolean {
    console.log('🎨 Running brand color audit...\n');
    
    try {
      this.auditDirectory(this.srcDir);
      return this.reportViolations();
    } catch (error) {
      console.error('Color audit failed:', error);
      return false;
    }
  }
}

// Run audit if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new ColorAuditor();
  const passed = auditor.run();
  process.exit(passed ? 0 : 1);
}

export default ColorAuditor;