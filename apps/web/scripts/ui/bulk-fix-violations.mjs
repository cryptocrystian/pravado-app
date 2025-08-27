#!/usr/bin/env node

/**
 * V4 UI Bulk Fixer - Mechanical Replacements
 * 
 * This script performs systematic replacements to fix V4 audit violations:
 * - Removes gradients and replaces with solid tokens
 * - Updates color references to use V4 spec tokens
 * - Handles common patterns mechanically
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replacement patterns - ordered by specificity
const REPLACEMENTS = [
  // Gradient removals - specific patterns first
  { from: /bg-gradient-to-r from-ai-teal-\d+\/?\d* to-ai-gold-\d+\/?\d*/g, to: 'bg-ai' },
  { from: /bg-gradient-to-br from-ai-teal-\d+\/?\d* to-ai-gold-\d+\/?\d*/g, to: 'bg-ai' },
  { from: /bg-gradient-to-b from-ai-teal-\d+\/?\d* to-ai-gold-\d+\/?\d*/g, to: 'bg-ai' },
  { from: /bg-gradient-to-l from-ai-teal-\d+\/?\d* to-ai-gold-\d+\/?\d*/g, to: 'bg-ai' },
  
  // Generic gradient removals
  { from: /bg-gradient-to-r from-[^\s]+ to-[^\s]+/g, to: 'bg-ai' },
  { from: /bg-gradient-to-br from-[^\s]+ to-[^\s]+/g, to: 'bg-ai' },
  { from: /bg-gradient-to-b from-[^\s]+ to-[^\s]+/g, to: 'bg-ai' },
  { from: /bg-gradient-to-l from-[^\s]+ to-[^\s]+/g, to: 'bg-ai' },
  
  // Brand gradient classes
  { from: /brand-grad/g, to: 'bg-ai' },
  
  // Isolated gradient words (in strings, comments, etc.)
  { from: /\bto-\w+/g, to: '' },
  { from: /\bfrom-\w+/g, to: '' },
  
  // Text color replacements
  { from: /text-ai-teal-\d+/g, to: 'text-ai' },
  { from: /text-ai-gold-\d+/g, to: 'text-premium' },
  { from: /text-blue-\d+/g, to: 'text-ai' },
  
  // Background color replacements
  { from: /bg-ai-teal-\d+\/?\d*/g, to: 'bg-ai' },
  { from: /bg-ai-gold-\d+\/?\d*/g, to: 'bg-premium' },
  { from: /bg-white/g, to: 'bg-surface' },
  
  // Border color replacements  
  { from: /border-ai-teal-\d+\/?\d*/g, to: 'border-ai' },
  { from: /border-ai-gold-\d+\/?\d*/g, to: 'border-premium' },
  
  // Ring color replacements
  { from: /ring-ai-teal-\d+/g, to: 'ring-ai' },
  { from: /ring-ai-gold-\d+/g, to: 'ring-premium' },
  
  // Focus ring replacements
  { from: /focus-visible:ring-ai-teal-\d+/g, to: 'focus-visible:ring-ai' },
  { from: /focus-visible:ring-ai-gold-\d+/g, to: 'focus-visible:ring-premium' },
  
  // Fill replacements
  { from: /fill-ai-teal-\d+\/?\d*/g, to: 'fill-ai' },
  { from: /fill-ai-gold-\d+\/?\d*/g, to: 'fill-premium' }
];

// CSS-specific replacements for linear gradients
const CSS_REPLACEMENTS = [
  { from: /linear-gradient\([^)]+\)/g, to: 'var(--ai)' },
  { from: /hsl\(var\(--ai-teal-\d+\)\)/g, to: 'var(--ai)' },
  { from: /hsl\(var\(--ai-gold-\d+\)\)/g, to: 'var(--premium)' }
];

// File extensions to process
const VALID_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'];

async function walkDirectory(dir, callback) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and similar
      if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        await walkDirectory(fullPath, callback);
      }
    } else if (VALID_EXTENSIONS.includes(path.extname(entry.name))) {
      await callback(fullPath);
    }
  }
}

async function processFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;
    
    // Choose replacement set based on file type
    const isCss = filePath.endsWith('.css') || filePath.endsWith('.scss');
    const replacements = isCss ? [...REPLACEMENTS, ...CSS_REPLACEMENTS] : REPLACEMENTS;
    
    // Apply all replacements
    for (const { from, to } of replacements) {
      const originalContent = content;
      content = content.replace(from, to);
      if (content !== originalContent) {
        modified = true;
      }
    }
    
    // Write back if modified
    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`✅ Fixed: ${filePath}`);
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

async function main() {
  const targetDir = process.argv[2] || 'src';
  
  console.log('🔧 V4 UI Bulk Fixer - Starting mechanical replacements...');
  console.log(`📁 Processing: ${targetDir}`);
  
  let totalFixed = 0;
  
  await walkDirectory(targetDir, async (filePath) => {
    const fixed = await processFile(filePath);
    totalFixed += fixed;
  });
  
  console.log('');
  console.log(`🎉 Bulk fix complete!`);
  console.log(`📊 Files modified: ${totalFixed}`);
  console.log('');
  console.log('Next: Run audit to check remaining violations:');
  console.log('node scripts/ui/audit-colors.mjs src/');
}

main().catch(console.error);