# Pravado Visual Regression Tests

This directory contains comprehensive Playwright visual regression tests for Pravado's UI overhaul, focusing on:

## Test Structure

### 📸 Visual Test Suites

- **`visual/dashboard-snapshots.spec.ts`**: Full dashboard, KPI hero, and secondary tiles
- **`visual/components-gallery.spec.ts`**: All v2 components in isolation with different states
- **`visual/tables-snapshots.spec.ts`**: SEO table header, sample rows, and sorting states

### 🎯 Coverage Areas

1. **Dashboard Layout**
   - Full dashboard view across viewports
   - KPI Hero section with glassmorphism
   - Secondary metrics tiles
   - Responsive behavior testing

2. **Component Library**
   - All v2 components (GlassCard, KpiTile, etc.)
   - Interactive states (hover, focus, active)
   - Brand color variations (AI teal, AI gold)
   - Glass morphism effects consistency

3. **Data Tables**
   - Table headers with sorting indicators
   - Row samples with proper styling
   - Density variations (default, comfortable, compact)
   - Mobile responsive behavior

## 🎨 Brand Integration Testing

- **AI Teal Colors**: `170 70% 58%`, `170 72% 45%`, `170 78% 34%`
- **AI Gold Colors**: `40 92% 66%`, `40 92% 52%`, `40 94% 40%`
- **Glass Morphism**: Backdrop blur effects with proper contrast
- **Dark Shell + Light Islands**: Theme consistency

## 🚀 Running Tests

### Local Development

```bash
# Run all visual tests
npm run test:visual

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Update all visual baselines
npm run test:update-snapshots

# View test reports
npm run test:report
```

### Test-Specific Commands

```bash
# Run only dashboard tests
npx playwright test tests/visual/dashboard-snapshots.spec.ts

# Run only component gallery tests
npx playwright test tests/visual/components-gallery.spec.ts

# Run only table tests
npx playwright test tests/visual/tables-snapshots.spec.ts
```

## 📱 Multi-Viewport Testing

Tests run across multiple viewport sizes:

- **Desktop**: 1200x800px (Chrome, Firefox, Safari)
- **Tablet**: 768x1024px (iPad Pro simulation)
- **Mobile**: 375x667px (iPhone 12 simulation)

## 🔧 Configuration

### Visual Comparison Settings

- **Threshold**: 0.25 (25%) for glass effects tolerance
- **Animation Handling**: Disabled for consistent snapshots
- **Dynamic Content Masking**: Automatic for metrics, timestamps, charts

### CI/CD Integration

- Runs on all PRs targeting `main` branch
- Uploads test reports and failure screenshots
- Manual workflow for updating visual baselines

## 🎭 Dynamic Content Masking

To ensure stable snapshots, tests automatically mask:

- **Metrics & Numbers**: Opacity reduced to 30%
- **Timestamps**: Made semi-transparent
- **Status Chips**: Standardized colors for consistency
- **Charts & Sparklines**: Masked to focus on layout
- **Loading States**: Hidden completely

## 🐛 Troubleshooting

### Common Issues

1. **Flaky Screenshots**: Check for animations or dynamic content
2. **Glass Effect Variations**: Increase threshold tolerance
3. **Font Rendering**: Ensure fonts are loaded before capture
4. **Theme Inconsistencies**: Verify CSS variable loading

### Debugging Failed Tests

1. View failure screenshots in `test-results/`
2. Run tests in headed mode: `npm run test:headed`
3. Use UI mode for interactive debugging: `npm run test:ui`
4. Check console logs for theme application errors

## 📈 Chart Theming Integration

Visual tests work with the enhanced `chartTheme.ts`:

- **Brand Colors**: Teal/Gold palette for all chart types
- **Dark Shell Compatibility**: Proper contrast ratios
- **Glass Tooltips**: Matching UI theme
- **Typography**: Inter font family consistency

## 🔗 Related Files

- `playwright.config.ts`: Main test configuration
- `global-setup.ts`: Environment preparation
- `src/lib/chartTheme.ts`: Chart styling integration
- `src/pages/ComponentGallery.tsx`: Interactive component showcase

## 📝 Best Practices

1. **Stable Selectors**: Use `data-testid` attributes
2. **Consistent Masking**: Apply dynamic content masks
3. **Viewport Coverage**: Test key components across screen sizes
4. **Brand Compliance**: Verify AI teal/gold color application
5. **Glass Effects**: Use lenient thresholds for blur effects

---

For more information about Playwright visual testing, see the [official documentation](https://playwright.dev/docs/test-screenshots).