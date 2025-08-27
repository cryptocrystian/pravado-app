#!/usr/bin/env node
/**
 * Brand Compliance Validator - Comprehensive Design System Check
 * 
 * Validates:
 * - Teal/Gold HSL token usage consistency
 * - Brand gradient implementations
 * - Content island data-surface attributes
 * - Glass card component compliance
 * - Typography scale adherence
 * 
 * Usage: npm run validate:brand
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BrandValidation {
  category: string;
  status: 'pass' | 'warning' | 'error';
  message: string;
  details?: string[];
  fix?: string;
}

class BrandValidator {
  private validations: BrandValidation[] = [];

  async validateBrandSystem(): Promise<BrandValidation[]> {
    console.log('🎨 Pravado Brand System Validation\n');
    
    await this.validateTokenDefinitions();
    await this.validateComponentUsage();
    await this.validateContentIslands();
    await this.validateGradientImplementation();
    await this.validateTypographyScale();
    
    this.reportResults();
    return this.validations;
  }

  private async validateTokenDefinitions(): Promise<void> {
    const globalsCss = this.readFile('src/styles/globals.css');
    const tailwindConfig = this.readFile('tailwind.config.js');
    
    // Check HSL token definitions
    const requiredTokens = [
      '--ai-teal-300: 170 70% 58%',
      '--ai-teal-500: 170 72% 45%',
      '--ai-teal-700: 170 78% 34%',
      '--ai-gold-300: 40 92% 66%',
      '--ai-gold-500: 40 92% 52%',
      '--ai-gold-700: 40 94% 40%'
    ];

    const missingTokens = requiredTokens.filter(token => 
      !globalsCss?.includes(token)
    );

    if (missingTokens.length === 0) {
      this.validations.push({
        category: 'Brand Tokens',
        status: 'pass',
        message: 'All required HSL brand tokens defined correctly'
      });
    } else {
      this.validations.push({
        category: 'Brand Tokens',
        status: 'error',
        message: `Missing or incorrect brand token definitions`,
        details: missingTokens,
        fix: 'Ensure exact HSL values in globals.css match Pravado brand specification'
      });
    }

    // Validate gradient definition
    const gradientToken = '--brand-grad: linear-gradient(90deg, hsl(var(--ai-teal-500)), hsl(var(--ai-gold-500)))';
    if (globalsCss?.includes(gradientToken)) {
      this.validations.push({
        category: 'Brand Gradient',
        status: 'pass',
        message: 'Brand gradient correctly defined'
      });
    } else {
      this.validations.push({
        category: 'Brand Gradient',
        status: 'error',
        message: 'Brand gradient missing or incorrect',
        fix: `Add to globals.css: ${gradientToken}`
      });
    }

    // Validate Tailwind config integration
    if (tailwindConfig?.includes('ai-teal') && tailwindConfig?.includes('ai-gold')) {
      this.validations.push({
        category: 'Tailwind Integration',
        status: 'pass',
        message: 'Brand tokens properly integrated with Tailwind'
      });
    } else {
      this.validations.push({
        category: 'Tailwind Integration',
        status: 'warning',
        message: 'Brand tokens may not be properly integrated with Tailwind classes'
      });
    }
  }

  private async validateComponentUsage(): Promise<void> {
    const srcFiles = this.getAllSourceFiles('src');
    let glasscardUsage = 0;
    let properBrandUsage = 0;
    let offBrandUsage = 0;

    for (const file of srcFiles) {
      const content = this.readFile(file);
      if (!content) continue;

      // Count glass card usage
      if (content.includes('glass-card')) {
        glasscardUsage++;
      }

      // Count brand token usage
      const brandMatches = content.match(/(?:ai-teal|ai-gold)-[357]00/g);
      if (brandMatches) {
        properBrandUsage += brandMatches.length;
      }

      // Count off-brand color usage
      const offBrandMatches = content.match(/(?:text-|bg-|border-)(?:blue|red|green|yellow|purple|pink|indigo|cyan|orange)-\d+/g);
      if (offBrandMatches) {
        offBrandUsage += offBrandMatches.length;
      }
    }

    if (glasscardUsage > 0) {
      this.validations.push({
        category: 'Glass Components',
        status: 'pass',
        message: `Glass card components used in ${glasscardUsage} locations`
      });
    } else {
      this.validations.push({
        category: 'Glass Components',
        status: 'warning',
        message: 'No glass card components found - consider using for elevated content'
      });
    }

    if (properBrandUsage > offBrandUsage * 3) {
      this.validations.push({
        category: 'Color Usage',
        status: 'pass',
        message: `Strong brand token usage: ${properBrandUsage} brand vs ${offBrandUsage} off-brand`
      });
    } else {
      this.validations.push({
        category: 'Color Usage',
        status: 'warning',
        message: `Mixed color usage: ${properBrandUsage} brand vs ${offBrandUsage} off-brand`,
        fix: 'Replace generic colors with brand tokens (ai-teal, ai-gold) or semantic tokens'
      });
    }
  }

  private async validateContentIslands(): Promise<void> {
    const contentPages = [
      'src/pages/Dashboard.tsx',
      'src/pages/Analytics.tsx',
      'src/pages/ContentStudio.tsx'
    ];

    let validIslands = 0;
    let totalPages = 0;

    for (const page of contentPages) {
      const content = this.readFile(page);
      if (!content) continue;
      
      totalPages++;
      
      if (content.includes('data-surface="content"')) {
        validIslands++;
      }
    }

    if (validIslands === totalPages && totalPages > 0) {
      this.validations.push({
        category: 'Content Islands',
        status: 'pass',
        message: `All ${totalPages} content pages implement light content islands`
      });
    } else {
      this.validations.push({
        category: 'Content Islands',
        status: 'error',
        message: `${totalPages - validIslands}/${totalPages} content pages missing data-surface="content"`,
        fix: 'Add data-surface="content" to main content containers in dashboard/analytics pages'
      });
    }
  }

  private async validateGradientImplementation(): Promise<void> {
    const srcFiles = this.getAllSourceFiles('src');
    const gradientPatterns = [
      'var(--brand-grad)',
      'linear-gradient(90deg, hsl(var(--ai-teal-500)), hsl(var(--ai-gold-500)))',
      'from-ai-teal-500 to-ai-gold-500'
    ];

    let gradientUsage = 0;
    let incorrectGradients = 0;

    for (const file of srcFiles) {
      const content = this.readFile(file);
      if (!content) continue;

      // Count proper gradient usage
      gradientPatterns.forEach(pattern => {
        if (content.includes(pattern)) {
          gradientUsage++;
        }
      });

      // Count improper gradient usage (non-brand gradients)
      const improperGradients = content.match(/linear-gradient\([^)]*(?!ai-teal|ai-gold)[a-z-]+\d+/g);
      if (improperGradients) {
        incorrectGradients += improperGradients.length;
      }
    }

    if (gradientUsage > 0 && incorrectGradients === 0) {
      this.validations.push({
        category: 'Brand Gradients',
        status: 'pass',
        message: `${gradientUsage} brand-compliant gradients implemented`
      });
    } else if (incorrectGradients > 0) {
      this.validations.push({
        category: 'Brand Gradients',
        status: 'warning',
        message: `Found ${incorrectGradients} non-brand gradients`,
        fix: 'Replace with var(--brand-grad) or ai-teal to ai-gold gradients'
      });
    } else {
      this.validations.push({
        category: 'Brand Gradients',
        status: 'warning',
        message: 'No brand gradients found - consider adding for visual hierarchy'
      });
    }
  }

  private async validateTypographyScale(): Promise<void> {
    const globalsCss = this.readFile('src/styles/globals.css');
    const tailwindConfig = this.readFile('tailwind.config.js');
    
    const requiredSizes = [
      'display',
      'h1',
      'h2',
      'body',
      'meta'
    ];

    let definedSizes = 0;
    
    requiredSizes.forEach(size => {
      if (globalsCss?.includes(`${size}:`)) {
        definedSizes++;
      }
    });

    if (definedSizes === requiredSizes.length) {
      this.validations.push({
        category: 'Typography Scale',
        status: 'pass',
        message: 'Complete typography scale defined'
      });
    } else {
      this.validations.push({
        category: 'Typography Scale',
        status: 'warning',
        message: `${definedSizes}/${requiredSizes.length} typography sizes defined`,
        fix: 'Complete typography scale in globals.css or Tailwind config'
      });
    }
  }

  private readFile(filePath: string): string | null {
    try {
      const fullPath = path.resolve(filePath);
      return fs.readFileSync(fullPath, 'utf-8');
    } catch {
      return null;
    }
  }

  private getAllSourceFiles(dir: string): string[] {
    const files: string[] = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          files.push(...this.getAllSourceFiles(fullPath));
        } else if (entry.name.match(/\.(tsx?|jsx?|css|scss|sass)$/)) {
          files.push(fullPath);
        }
      }
    } catch {
      // Directory doesn't exist, ignore
    }
    
    return files;
  }

  private reportResults(): void {
    const passed = this.validations.filter(v => v.status === 'pass').length;
    const warnings = this.validations.filter(v => v.status === 'warning').length;
    const errors = this.validations.filter(v => v.status === 'error').length;

    console.log(`📊 Brand System Validation Results:`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ⚠️  Warnings: ${warnings}`);
    console.log(`   ❌ Errors: ${errors}\n`);

    // Group by category
    const categories = [...new Set(this.validations.map(v => v.category))];
    
    categories.forEach(category => {
      const categoryValidations = this.validations.filter(v => v.category === category);
      const status = categoryValidations.some(v => v.status === 'error') ? '❌' : 
                    categoryValidations.some(v => v.status === 'warning') ? '⚠️' : '✅';
      
      console.log(`${status} ${category}`);
      categoryValidations.forEach(validation => {
        const icon = validation.status === 'pass' ? '  ✓' : 
                    validation.status === 'warning' ? '  ⚠' : '  ✗';
        console.log(`${icon} ${validation.message}`);
        
        if (validation.details) {
          validation.details.forEach(detail => {
            console.log(`    → ${detail}`);
          });
        }
        
        if (validation.fix) {
          console.log(`    💡 ${validation.fix}`);
        }
      });
      console.log();
    });

    if (errors === 0 && warnings === 0) {
      console.log('🎉 Perfect brand compliance! Pravado design system fully implemented.');
    } else if (errors === 0) {
      console.log('✅ Brand compliance acceptable with minor improvements suggested.');
    } else {
      console.log('❌ Brand violations found - immediate attention required.');
    }
  }
}

// CLI execution
async function main() {
  const validator = new BrandValidator();
  const results = await validator.validateBrandSystem();
  
  const errors = results.filter(r => r.status === 'error').length;
  process.exit(errors > 0 ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { BrandValidator };