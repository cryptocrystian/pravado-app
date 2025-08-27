#!/usr/bin/env node

/**
 * V4 UI Audit - Hard Fail on Off-Brand Styles
 * 
 * This script enforces the V4 Master Spec tokens and bans:
 * - Gradients (bg-gradient-, from-, to-, brand-grad)
 * - Default blues (text-blue-*, bg-white) 
 * - Raw hex/rgb colors in /src/**
 * 
 * Usage: node scripts/ui/audit-colors.mjs src/
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Forbidden patterns with explanations
const FORBIDDEN_PATTERNS = [
  {
    pattern: /bg-gradient-/g,
    message: 'Gradients forbidden - use solid V4 spec tokens only',
    fix: 'Use bg-primary, bg-ai, bg-premium instead'
  },
  {
    pattern: /from-/g,  
    message: 'Gradient from- classes forbidden',
    fix: 'Use solid V4 spec tokens instead'
  },
  {
    pattern: /to-/g,
    message: 'Gradient to- classes forbidden', 
    fix: 'Use solid V4 spec tokens instead'
  },
  {
    pattern: /brand-grad/g,
    message: 'brand-grad forbidden - use solid tokens only',
    fix: 'Use bg-primary or bg-ai instead'
  },
  {
    pattern: /text-blue-/g,
    message: 'Default blue text forbidden - use V4 spec tokens',
    fix: 'Use text-primary, text-ai, or text-premium'
  },
  {
    pattern: /bg-white/g,
    message: 'bg-white forbidden - use V4 spec tokens',
    fix: 'Use bg-surface or light mode variant'
  },
  {
    pattern: /#[0-9a-fA-F]{3,6}/g,
    message: 'Raw hex colors forbidden - use CSS variables only',
    fix: 'Use var(--primary), var(--ai), var(--premium) etc'
  },
  {
    pattern: /rgb\s*\(/g,
    message: 'Raw rgb() colors forbidden - use CSS variables only', 
    fix: 'Use var(--primary), var(--ai), var(--premium) etc'
  }
];

// File extensions to check
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

async function auditFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const violations = [];
  
  for (const { pattern, message, fix } of FORBIDDEN_PATTERNS) {
    let match;
    pattern.lastIndex = 0; // Reset regex state
    
    while ((match = pattern.exec(content)) !== null) {
      const lines = content.substring(0, match.index).split('\\n');
      const lineNumber = lines.length;
      const columnNumber = match.index - (lines[lines.length - 1]?.length ?? 0);
      
      violations.push({
        file: filePath,
        line: lineNumber,
        column: columnNumber, 
        match: match[0],
        message,
        fix
      });
    }
  }
  
  return violations;
}

async function main() {
  const targetDir = process.argv[2] || 'src';
  
  if (!targetDir) {
    console.error('❌ Usage: node audit-colors.mjs <directory>');
    process.exit(1);
  }
  
  console.log('🎨 V4 UI Audit - Checking for off-brand styles...');
  console.log(`📁 Scanning: ${targetDir}`);
  
  const allViolations = [];
  
  await walkDirectory(targetDir, async (filePath) => {
    const violations = await auditFile(filePath);
    allViolations.push(...violations);
  });
  
  if (allViolations.length === 0) {
    console.log('✅ V4 UI Audit: PASSED');
    console.log('All files comply with V4 Master Spec tokens');
    process.exit(0);
  }
  
  console.log(`❌ V4 UI Audit: FAILED`);
  console.log(`Found ${allViolations.length} violations:`);
  console.log('');
  
  // Group by file
  const violationsByFile = {};
  for (const violation of allViolations) {
    if (!violationsByFile[violation.file]) {
      violationsByFile[violation.file] = [];
    }
    violationsByFile[violation.file].push(violation);
  }
  
  // Print violations
  for (const [file, violations] of Object.entries(violationsByFile)) {
    console.log(`📁 ${file}`);
    for (const { line, column, match, message, fix } of violations) {
      console.log(`  ❌ Line ${line}:${column}`);
      console.log(`     Found: ${match}`);
      console.log(`     Issue: ${message}`);
      console.log(`     Fix:   ${fix}`);
      console.log('');
    }
  }
  
  console.log('🚫 Build blocked: Fix all violations to maintain V4 spec compliance');
  process.exit(1);
}

main().catch(console.error);