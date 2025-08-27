#!/usr/bin/env node
/**
 * Global Link Color Enforcement - Pravado Brand Codemod
 * 
 * Automatically replaces all default blue links with brand teal
 * Ensures consistent brand application across the entire codebase
 * 
 * Usage: npm run fix:links
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LinkFix {
  file: string;
  changes: number;
  patterns: string[];
}

class LinkColorFixer {
  private fixes: LinkFix[] = [];
  private totalChanges = 0;

  private readonly LINK_REPLACEMENTS = [
    // CSS color properties
    { 
      find: /color:\s*#646cff/g, 
      replace: 'color: hsl(var(--ai-teal-300))',
      description: 'Vite default blue → Brand teal'
    },
    { 
      find: /color:\s*#535bf2/g, 
      replace: 'color: hsl(var(--ai-teal-500))',
      description: 'Vite hover blue → Brand teal hover'
    },
    { 
      find: /color:\s*blue/g, 
      replace: 'color: hsl(var(--ai-teal-300))',
      description: 'Generic blue → Brand teal'
    },
    { 
      find: /color:\s*#747bff/g, 
      replace: 'color: hsl(var(--ai-teal-500))',
      description: 'Light theme blue → Brand teal'
    },

    // Tailwind classes
    { 
      find: /text-blue-300/g, 
      replace: 'text-ai-teal-300',
      description: 'Tailwind blue-300 → Brand teal-300'
    },
    { 
      find: /text-blue-400/g, 
      replace: 'text-ai-teal-300',
      description: 'Tailwind blue-400 → Brand teal-300'
    },
    { 
      find: /text-blue-500/g, 
      replace: 'text-ai-teal-500',
      description: 'Tailwind blue-500 → Brand teal-500'
    },
    { 
      find: /text-blue-600/g, 
      replace: 'text-ai-teal-500',
      description: 'Tailwind blue-600 → Brand teal-500'
    },
    { 
      find: /text-blue-700/g, 
      replace: 'text-ai-teal-700',
      description: 'Tailwind blue-700 → Brand teal-700'
    },

    // Border colors
    { 
      find: /border-blue-300/g, 
      replace: 'border-ai-teal-300',
      description: 'Border blue-300 → Brand teal-300'
    },
    { 
      find: /border-blue-500/g, 
      replace: 'border-ai-teal-500',
      description: 'Border blue-500 → Brand teal-500'
    },

    // Background colors for buttons/accents
    { 
      find: /bg-blue-500/g, 
      replace: 'bg-ai-teal-500',
      description: 'Background blue-500 → Brand teal-500'
    },
    { 
      find: /bg-blue-600/g, 
      replace: 'bg-ai-teal-600',
      description: 'Background blue-600 → Brand teal-600'
    },

    // Focus ring colors
    { 
      find: /focus:ring-blue-500/g, 
      replace: 'focus:ring-ai-teal-500',
      description: 'Focus ring blue → Brand teal'
    },
    { 
      find: /outline-blue-500/g, 
      replace: 'outline-ai-teal-500',
      description: 'Outline blue → Brand teal'
    },

    // Hover states
    { 
      find: /hover:text-blue-600/g, 
      replace: 'hover:text-ai-teal-600',
      description: 'Hover blue → Brand teal hover'
    },
    { 
      find: /hover:bg-blue-600/g, 
      replace: 'hover:bg-ai-teal-600',
      description: 'Hover background blue → Brand teal'
    }
  ];

  async fixProject(srcDir: string): Promise<LinkFix[]> {
    console.log('🔗 Starting Global Link Color Enforcement...\n');
    console.log('Replacing all default blue links with Pravado brand teal\n');
    
    await this.processDirectory(srcDir);
    
    this.reportResults();
    return this.fixes;
  }

  private async processDirectory(dir: string): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        await this.processDirectory(fullPath);
      } else if (this.isRelevantFile(entry.name)) {
        await this.fixFile(fullPath);
      }
    }
  }

  private isRelevantFile(filename: string): boolean {
    const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.sass'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  private async fixFile(filePath: string): Promise<void> {
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    let modifiedContent = originalContent;
    let fileChanges = 0;
    const appliedPatterns: string[] = [];

    // Apply each replacement pattern
    for (const replacement of this.LINK_REPLACEMENTS) {
      const beforeReplace = modifiedContent;
      modifiedContent = modifiedContent.replace(replacement.find, replacement.replace);
      
      if (beforeReplace !== modifiedContent) {
        fileChanges++;
        appliedPatterns.push(replacement.description);
      }
    }

    // Write file if changes were made
    if (fileChanges > 0) {
      fs.writeFileSync(filePath, modifiedContent);
      
      const relativePath = path.relative(process.cwd(), filePath);
      this.fixes.push({
        file: relativePath,
        changes: fileChanges,
        patterns: appliedPatterns
      });
      
      this.totalChanges += fileChanges;
    }
  }

  private reportResults(): void {
    if (this.fixes.length === 0) {
      console.log('✅ No blue links found - brand consistency maintained!');
      return;
    }

    console.log(`🎨 Brand Color Enforcement Complete!`);
    console.log(`Fixed ${this.totalChanges} violations across ${this.fixes.length} files\n`);

    this.fixes.forEach(fix => {
      console.log(`📁 ${fix.file} (${fix.changes} changes)`);
      fix.patterns.forEach(pattern => {
        console.log(`   ✓ ${pattern}`);
      });
      console.log();
    });

    console.log('🔗 All links now use Pravado brand teal colors');
    console.log('   • Default links: hsl(var(--ai-teal-300))');
    console.log('   • Hover states: hsl(var(--ai-teal-500))');
    console.log('   • Interactive elements: ai-teal-500 variants\n');
  }
}

// Update CSS to override browser defaults
function updateGlobalStyles(): void {
  const globalStylesPath = path.join(process.cwd(), 'src/styles/globals.css');
  
  if (!fs.existsSync(globalStylesPath)) {
    console.log('⚠️ globals.css not found - global link styles not updated');
    return;
  }

  const globalStyles = fs.readFileSync(globalStylesPath, 'utf-8');
  
  // Check if brand link styles already exist
  if (globalStyles.includes('/* P5 Global Link Colors')) {
    console.log('✅ Global link styles already enforced in globals.css');
    return;
  }

  // Add global link enforcement styles
  const linkEnforcement = `
/* P5 Global Link Colors - Brand Enforcement */
a {
  color: hsl(var(--ai-teal-300)) !important;
  transition: color 0.2s ease;
}

a:hover {
  color: hsl(var(--ai-teal-500)) !important;
}

/* Override browser defaults completely */
a:visited {
  color: hsl(var(--ai-teal-300)) !important;
}

a:active {
  color: hsl(var(--ai-teal-700)) !important;
}

/* Brand focus rings for accessibility */
a:focus-visible {
  outline: 2px solid hsl(var(--ai-teal-500));
  outline-offset: 2px;
}

/* Button links should maintain their styling */
a.btn-primary,
a.btn-secondary,
a.btn-ghost {
  color: inherit !important;
}`;

  const updatedStyles = globalStyles + linkEnforcement;
  fs.writeFileSync(globalStylesPath, updatedStyles);
  
  console.log('✅ Updated globals.css with brand link enforcement');
}

// CLI execution
async function main() {
  const srcDir = process.argv[2] || 'src';
  
  if (!fs.existsSync(srcDir)) {
    console.error(`❌ Source directory "${srcDir}" not found`);
    process.exit(1);
  }

  const fixer = new LinkColorFixer();
  await fixer.fixProject(srcDir);
  
  // Update global styles to prevent future violations
  updateGlobalStyles();
  
  console.log('🎯 Brand enforcement complete!');
  console.log('Run "npm run audit:brand" to verify all violations are fixed');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { LinkColorFixer };