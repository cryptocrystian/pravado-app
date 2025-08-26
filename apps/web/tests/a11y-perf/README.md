# Pravado A11y/Performance Test Suite

Comprehensive accessibility and performance testing framework for the Pravado UI overhaul, focusing on enterprise-grade glassmorphism effects and WCAG 2.1 AA compliance.

## Overview

This test suite validates that the UI Polish P3 implementation maintains high accessibility standards while delivering optimal performance with the new glassmorphism design system.

## Test Categories

### 🔍 Accessibility Tests (`accessibility.spec.ts`)
- **WCAG 2.1 AA Compliance**: Comprehensive audits using @axe-core/playwright
- **Focus Ring Validation**: ai-teal-500 brand compliance with 2px outlines
- **Contrast Ratio Testing**: 4.5:1 minimum on dark shell, 7:1 on light content
- **Keyboard Navigation**: Tab order, focus visibility, screen reader compatibility
- **Semantic HTML Structure**: Proper headings, landmarks, ARIA labels

### ⚡ Performance Tests (`performance.spec.ts`)
- **Bundle Size Analysis**: JavaScript/CSS budget monitoring
- **Core Web Vitals**: LCP, CLS, FID measurement
- **Glass Effect Impact**: Backdrop-filter performance assessment
- **Memory Usage Tracking**: Component lifecycle optimization
- **Network Performance**: Resource loading efficiency

### 📌 Click Path Tests (`click-paths.spec.ts`)
- **Dashboard → Submit PR**: ≤3 action efficiency test
- **Dashboard → Publish Content**: ≤3 action workflow validation
- **Dashboard → Export Analytics**: ≤2 action direct access
- **QuickActionsRow**: All actions accessible and properly labeled
- **Navigation Performance**: Sidebar and command palette efficiency

### 🎯 Focus Management Tests (`focus-management.spec.ts`)
- **AppSidebar Tab Order**: Logical keyboard navigation flow
- **Glass Card Focus**: Visibility on backdrop-blur elements
- **Command Palette Trapping**: Modal focus containment
- **Button Keyboard Activation**: Space/Enter key handling
- **Skip Links**: Bypass navigation mechanisms

## Brand Integration Requirements

### Focus Rings
- **Color**: ai-teal-500 (hsl(172, 72%, 45%))
- **Style**: 2px solid outline with offset
- **Visibility**: Clear against all background types including glass effects

### Contrast Standards
- **Dark Shell**: Minimum 4.5:1 contrast ratio
- **Light Content Islands**: Minimum 7:1 contrast ratio
- **Glass Overlays**: Maintain readability with backdrop-blur

### Performance Budgets
- **JavaScript Bundle**: <500KB total
- **CSS Bundle**: Monitor growth from glassmorphism utilities
- **LCP**: <2.5s for good Core Web Vitals
- **Glass Effect Overhead**: <20ms render time increase

## Running Tests

### Individual Test Suites
```bash
# Accessibility tests
npm test tests/a11y-perf/accessibility.spec.ts

# Performance analysis
npm test tests/a11y-perf/performance.spec.ts

# Click path validation
npm test tests/a11y-perf/click-paths.spec.ts

# Focus management
npm test tests/a11y-perf/focus-management.spec.ts
```

### Full Test Suite with Reporting
```bash
# Run all tests and generate reports
npx tsx tests/a11y-perf/test-runner.ts

# View HTML report
open tests/a11y-perf/reports/comprehensive-report.html
```

### Visual Tests
```bash
# Run visual regression tests
npm run test:visual

# Update visual baselines
npm run test:update-snapshots
```

## Test Configuration

### Browser Matrix
- **Desktop Chrome**: 1200x800 viewport
- **Desktop Firefox**: 1200x800 viewport  
- **Desktop Safari**: 1200x800 viewport
- **Tablet**: iPad Pro (768x1024)
- **Mobile**: iPhone 12 (375x667)

### Accessibility Standards
- **WCAG Version**: 2.1 Level AA
- **Testing Tool**: @axe-core/playwright v4.10.2
- **Screen Reader**: Simulated via ARIA validation
- **Keyboard Testing**: Full tab navigation coverage

### Performance Thresholds
- **LCP Good**: <1.2s, Needs Improvement: 1.2-2.5s, Poor: >2.5s
- **CLS Good**: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25
- **FID Good**: <100ms, Needs Improvement: 100-300ms, Poor: >300ms

## Report Generation

The test suite generates multiple report formats:

### HTML Report (`comprehensive-report.html`)
- Interactive dashboard with quality scores
- Visual representation of test results
- Detailed findings with recommendations
- Brand compliance assessment

### JSON Report (`comprehensive-report.json`)
- Machine-readable test results
- Detailed metrics and performance data
- Integration-ready format for CI/CD
- Historical comparison data

### Markdown Summary (`test-summary.md`)
- Executive summary for stakeholders
- Key findings and recommendations
- Quality gate assessment
- Next steps and action items

## Quality Gates

### Accessibility Gates
- ✅ **WCAG 2.1 AA Compliance**: >95% pass rate
- ✅ **Focus Ring Implementation**: ai-teal-500 brand consistency
- ✅ **Keyboard Navigation**: 100% interactive element coverage
- ✅ **Screen Reader**: Proper semantic structure

### Performance Gates
- ✅ **Core Web Vitals**: All metrics in "Good" range
- ✅ **Bundle Size**: <500KB JavaScript budget
- ⚠ **Glass Effect Impact**: <20ms render overhead
- ✅ **Memory Usage**: <5MB growth during navigation

### Usability Gates
- ✅ **Submit PR Workflow**: ≤3 actions from dashboard
- ✅ **Publish Content**: ≤3 actions from dashboard
- ✅ **Export Analytics**: ≤2 actions from dashboard
- ✅ **Navigation Speed**: <2s average page transitions

### Brand Compliance Gates
- ✅ **Dark Shell Contrast**: >4.5:1 minimum ratio
- ✅ **Light Content Contrast**: >7:1 minimum ratio
- ✅ **Glass Readability**: Maintained with backdrop effects
- ✅ **Focus Visibility**: Clear on all component types

## Integration with CI/CD

### GitHub Actions Integration
```yaml
- name: Run A11y/Performance Tests
  run: npx tsx tests/a11y-perf/test-runner.ts
  
- name: Upload Test Reports
  uses: actions/upload-artifact@v3
  with:
    name: a11y-perf-reports
    path: tests/a11y-perf/reports/
```

### Quality Checks
- **Pre-commit**: Focus ring validation
- **PR Validation**: Accessibility regression tests
- **Pre-deployment**: Full performance audit
- **Post-deployment**: Real user monitoring

## Troubleshooting

### Common Issues

**Glass Effects Not Rendering**
- Check browser support for backdrop-filter
- Verify GPU acceleration is enabled
- Test fallback styles for older browsers

**Focus Rings Not Visible**
- Confirm ai-teal-500 color implementation
- Check z-index stacking contexts
- Validate outline-offset values

**Performance Degradation**
- Profile glass effect count per page
- Implement CSS containment strategies
- Consider will-change optimizations

### Debug Commands
```bash
# Run tests with debug output
npm test -- --debug

# Generate detailed performance profiles
npm test tests/a11y-perf/performance.spec.ts -- --trace=on

# Test specific accessibility rules
npm test tests/a11y-perf/accessibility.spec.ts -- --grep="focus"
```

## Contributing

When adding new tests:

1. **Follow Naming Convention**: `category-feature.spec.ts`
2. **Add Data Test IDs**: Use `data-testid` for reliable selection
3. **Document Brand Requirements**: Include specific design system validation
4. **Update Quality Gates**: Adjust thresholds as needed
5. **Generate Reports**: Run full suite and update baselines

### Test Development Guidelines
- Use semantic selectors over CSS classes
- Test real user workflows, not implementation details
- Include both positive and negative test cases
- Validate across multiple viewport sizes
- Document expected behavior clearly

## Version History

- **v1.0.0** - Initial comprehensive test suite
- **v1.1.0** - Added glass effect performance monitoring
- **v1.2.0** - Enhanced brand compliance validation
- **v1.3.0** - Cross-browser compatibility matrix

---

**Maintained by**: Pravado QA Engineering Team  
**Last Updated**: 2025-08-25  
**Next Review**: 2025-09-15
