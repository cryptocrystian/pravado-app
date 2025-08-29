import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting MCP Agentic Test Suite')
  
  // Pre-warm the browser to ensure faster test execution
  const browser = await chromium.launch()
  await browser.close()
  
  console.log('✅ MCP Test Environment Ready')
}

export default globalSetup