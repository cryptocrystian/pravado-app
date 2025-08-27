#!/usr/bin/env node

/**
 * P5 Brand Compliance Checker
 * Validates that code follows Pravado brand guidelines:
 * - No hardcoded blue colors
 * - Proper use of brand tokens (ai-teal-*, ai-gold-*)
 * - Glass card usage for elevated surfaces
 * - Focus ring enforcement
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const COLORS_TO_AVOID = [
  // Hardcoded blues that should use brand tokens instead
  /#0000FF/gi,
  /#0066CC/gi, 
  /#1E90FF/gi,
  /#007BFF/gi,
  /blue-(\d+)/gi,
  /bg-blue/gi,
  /text-blue/gi,
  /border-blue/gi,
  /ring-blue/gi,
]

const REQUIRED_BRAND_PATTERNS = [
  /ai-teal-[0-9]+/g,
  /ai-gold-[0-9]+/g,
  /--ai-teal-[0-9]+/g,
  /--ai-gold-[0-9]+/g,
  /hsl\(var\(--ai-teal/g,
  /hsl\(var\(--ai-gold/g,
]

const GLASS_CARD_PATTERNS = [
  /class.*glass-card/g,
  /className.*glass-card/g,
]

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const errors = []
  const warnings = []

  // Check for forbidden blue colors
  COLORS_TO_AVOID.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        errors.push({
          file: filePath,
          issue: `Hardcoded blue color found: ${match}`,
          solution: 'Use ai-teal-* or ai-gold-* brand tokens instead',
          severity: 'error'
        })
      })
    }
  })

  // Check for plain card/border usage that should use glass-card
  const plainCardPattern = /(?:class|className).*(?:^|\s)(bg-white|border|rounded-lg)(?!\s*glass-card)/g
  const plainCards = content.match(plainCardPattern)
  if (plainCards && filePath.includes('/components/')) {
    plainCards.forEach(match => {
      if (!match.includes('glass-card')) {
        warnings.push({
          file: filePath,
          issue: `Plain card styling found: ${match.trim()}`,
          solution: 'Consider using glass-card utility for elevated surfaces',
          severity: 'warning'
        })
      }
    })
  }

  // Check for missing focus rings on interactive elements
  const buttonPattern = /<button(?!.*focus:outline)/g
  const missingFocus = content.match(buttonPattern)
  if (missingFocus) {
    missingFocus.forEach(() => {
      warnings.push({
        file: filePath,
        issue: 'Button without focus styling found',
        solution: 'Add focus:outline-2 focus:outline-ai-teal-500 for accessibility',
        severity: 'warning'
      })
    })
  }

  return { errors, warnings }
}

function scanDirectory(dir) {
  const files = []
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      // Skip ignored directories
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', 'build', '.next', '.git'].includes(item)) {
          walkDir(fullPath)
        }
      } else if (stat.isFile()) {
        // Check file extensions
        const ext = path.extname(item)
        if (['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'].includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  }
  
  walkDir(dir)
  return files
}

function generateReport(results) {
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0)

  console.log('\n🎨 Pravado Brand Compliance Report\n')
  console.log('=' .repeat(50))

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('✅ All files comply with brand guidelines!')
    return true
  }

  if (totalErrors > 0) {
    console.log(`\n❌ ${totalErrors} ERRORS found:\n`)
    results.forEach(result => {
      result.errors.forEach(error => {
        console.log(`📄 ${error.file}`)
        console.log(`   ❌ ${error.issue}`)
        console.log(`   💡 ${error.solution}\n`)
      })
    })
  }

  if (totalWarnings > 0) {
    console.log(`\n⚠️  ${totalWarnings} WARNINGS found:\n`)
    results.forEach(result => {
      result.warnings.forEach(warning => {
        console.log(`📄 ${warning.file}`)
        console.log(`   ⚠️  ${warning.issue}`)
        console.log(`   💡 ${warning.solution}\n`)
      })
    })
  }

  console.log('=' .repeat(50))
  console.log(`\nSummary: ${totalErrors} errors, ${totalWarnings} warnings`)

  // Fail CI if there are errors
  return totalErrors === 0
}

// Main execution
function main() {
  const srcDir = process.argv[2] || 'src'
  
  console.log(`🔍 Scanning ${srcDir} for brand compliance...`)
  
  const files = scanDirectory(srcDir)
  const results = files.map(file => ({
    file,
    ...checkFile(file)
  })).filter(r => r.errors.length > 0 || r.warnings.length > 0)

  const success = generateReport(results)
  
  if (!success) {
    console.log('\n💡 Brand Guidelines:')
    console.log('   • Use ai-teal-* colors instead of blue variants')
    console.log('   • Use glass-card utility for elevated surfaces')  
    console.log('   • Include focus rings on interactive elements')
    console.log('   • Leverage CSS variables: hsl(var(--ai-teal-500))')
    process.exit(1)
  }
}

const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {
  main()
}

export { checkFile, scanDirectory, generateReport }