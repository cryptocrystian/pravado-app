#!/usr/bin/env node

/**
 * UI Color Audit Script
 * Enforces PRAVADO color system constraints
 * 
 * Forbidden patterns:
 * - Gradients in any form
 * - bg-white on dashboard routes
 * - Raw hex/rgb values in src/ files
 * - text-blue-* classes (use semantic colors)
 */

import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

const AUDIT_RESULTS = {
  passed: [],
  violations: [],
  warnings: [],
  summary: {
    filesScanned: 0,
    violationsFound: 0,
    warningsFound: 0
  }
}

const FORBIDDEN_PATTERNS = [
  // Gradient violations
  {
    pattern: /background:\s*linear-gradient|background:\s*radial-gradient|background-image:\s*gradient/gi,
    type: 'violation',
    message: 'Gradients are forbidden - use solid colors only'
  },
  {
    pattern: /bg-gradient-|from-|via-|to-/g,
    type: 'violation', 
    message: 'Tailwind gradient classes are forbidden'
  },
  
  // Raw color violations
  {
    pattern: /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g,
    type: 'violation',
    message: 'Raw hex colors forbidden - use semantic color tokens'
  },
  {
    pattern: /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/gi,
    type: 'violation', 
    message: 'Raw RGB colors forbidden - use HSL semantic tokens'
  },
  
  // Dashboard bg-white violations
  {
    pattern: /bg-white/g,
    type: 'contextual', // Will be checked based on file context
    message: 'bg-white forbidden on dashboard routes - use theme-aware backgrounds'
  },
  
  // Blue text violations
  {
    pattern: /text-blue-\d+/g,
    type: 'violation',
    message: 'text-blue-* classes forbidden - use semantic colors (text-ai-teal, etc.)'
  },
  
  // Known legacy patterns (warnings only)
  {
    pattern: /className=".*(?:text-gray-|bg-gray-)/g,
    type: 'warning',
    message: 'Consider migrating gray-* classes to semantic theme tokens'
  }
]

const ALLOWED_LEGACY_FILES = [
  'tailwind.config.ts', // Config file can have raw colors
  'globals.css', // Base styles can have raw colors
  '.eslintrc.cjs', // Config files
]

async function scanFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    const relativePath = path.relative(process.cwd(), filePath)
    const fileName = path.basename(filePath)
    
    AUDIT_RESULTS.summary.filesScanned++
    
    // Skip allowed legacy files
    if (ALLOWED_LEGACY_FILES.some(allowed => fileName.includes(allowed))) {
      return
    }
    
    const fileViolations = []
    const fileWarnings = []
    
    for (const rule of FORBIDDEN_PATTERNS) {
      const matches = [...content.matchAll(rule.pattern)]
      
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length
        const line = content.split('\n')[lineNumber - 1]?.trim() || ''
        
        const issue = {
          file: relativePath,
          line: lineNumber,
          column: match.index - content.lastIndexOf('\n', match.index - 1),
          pattern: match[0],
          message: rule.message,
          context: line
        }
        
        // Handle contextual rules (like bg-white on dashboard)
        if (rule.type === 'contextual') {
          if (rule.pattern.source.includes('bg-white')) {
            // Check if this is in a dashboard-related file
            const isDashboardFile = relativePath.includes('Dashboard') || 
                                   relativePath.includes('dashboard') ||
                                   content.includes('data-island') ||
                                   content.includes('dark')
            
            // Skip if bg-white is paired with dark: variant (theme-aware)
            const hasThemeVariant = line.includes('dark:bg-') || line.includes('dark:')
            
            if (isDashboardFile && !hasThemeVariant) {
              fileViolations.push(issue)
              AUDIT_RESULTS.summary.violationsFound++
            }
          }
        } else if (rule.type === 'violation') {
          fileViolations.push(issue)
          AUDIT_RESULTS.summary.violationsFound++
        } else if (rule.type === 'warning') {
          fileWarnings.push(issue)
          AUDIT_RESULTS.summary.warningsFound++
        }
      }
    }
    
    if (fileViolations.length > 0) {
      AUDIT_RESULTS.violations.push({
        file: relativePath,
        issues: fileViolations
      })
    }
    
    if (fileWarnings.length > 0) {
      AUDIT_RESULTS.warnings.push({
        file: relativePath,
        issues: fileWarnings
      })
    }
    
    if (fileViolations.length === 0 && fileWarnings.length === 0) {
      AUDIT_RESULTS.passed.push(relativePath)
    }
    
  } catch (error) {
    console.error(`Error scanning ${filePath}: ${error.message}`)
  }
}

async function auditColors() {
  console.log('🎨 Starting PRAVADO UI Color Audit...\n')
  
  // Scan TypeScript, JavaScript, CSS, and JSX files
  const isInAppsWeb = process.cwd().includes('apps/web')
  const patterns = isInAppsWeb ? [
    'src/**/*.{ts,tsx,js,jsx,css,scss}',
    'tailwind.config.ts',
    'src/styles/*.css'
  ] : [
    'apps/web/src/**/*.{ts,tsx,js,jsx,css,scss}',
    'apps/web/tailwind.config.ts', 
    'apps/web/src/styles/*.css'
  ]
  
  const filesToScan = []
  
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, { 
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] 
      })
      filesToScan.push(...files)
    } catch (error) {
      console.warn(`Warning: Could not scan pattern ${pattern}: ${error.message}`)
    }
  }
  
  // Remove duplicates
  const uniqueFiles = [...new Set(filesToScan)]
  
  console.log(`Scanning ${uniqueFiles.length} files...`)
  
  // Scan all files
  await Promise.all(uniqueFiles.map(scanFile))
  
  // Generate report
  await generateReport()
  
  return AUDIT_RESULTS.summary.violationsFound === 0
}

async function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: AUDIT_RESULTS.summary,
    violations: AUDIT_RESULTS.violations,
    warnings: AUDIT_RESULTS.warnings,
    passed: AUDIT_RESULTS.passed.length
  }
  
  // Save JSON report
  const outputPath = process.cwd().includes('apps/web') ? '../../scripts/ui/audit-results.json' : 'scripts/ui/audit-results.json'
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2))
  
  // Console output
  console.log('\n📊 UI Color Audit Results')
  console.log('========================')
  console.log(`Files scanned: ${report.summary.filesScanned}`)
  console.log(`Files passed: ${report.passed}`)
  console.log(`Violations: ${report.summary.violationsFound}`)
  console.log(`Warnings: ${report.summary.warningsFound}`)
  
  if (AUDIT_RESULTS.violations.length > 0) {
    console.log('\n❌ VIOLATIONS:')
    for (const violation of AUDIT_RESULTS.violations) {
      console.log(`\n  ${violation.file}:`)
      for (const issue of violation.issues) {
        console.log(`    Line ${issue.line}: ${issue.message}`)
        console.log(`    Pattern: "${issue.pattern}"`)
        console.log(`    Context: ${issue.context}`)
      }
    }
  }
  
  if (AUDIT_RESULTS.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:')
    for (const warning of AUDIT_RESULTS.warnings) {
      console.log(`\n  ${warning.file}:`)
      for (const issue of warning.issues) {
        console.log(`    Line ${issue.line}: ${issue.message}`)
      }
    }
  }
  
  if (report.summary.violationsFound === 0) {
    console.log('\n✅ All color audit checks passed!')
  } else {
    console.log(`\n❌ Found ${report.summary.violationsFound} violations that must be fixed`)
  }
}

// Run audit if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = await auditColors()
  process.exit(success ? 0 : 1)
}