import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🔧 E2E Global Setup - Checking backend...');
  
  const backendUrl = 'http://localhost:3000';
  const maxRetries = 30;
  
  // Wait for backend to be ready
  for (let i = 0; i < maxRetries; i++) {
    try {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      
      // Try to reach backend API
      const response = await page.goto(`${backendUrl}/api`, {
        timeout: 2000,
        waitUntil: 'domcontentloaded'
      }).catch(() => null);
      
      await browser.close();
      
      if (response && (response.status() < 500 || response.status() === 404)) {
        console.log('✅ Backend is ready!');
        return;
      }
    } catch (error) {
      // Ignore errors, will retry
    }
    
    if (i === 0) {
      console.log('⏳ Waiting for backend to be ready...');
    }
    
    if (i === maxRetries - 1) {
      console.error('');
      console.error('❌ Backend is not running!');
      console.error('');
      console.error('Please start the backend first:');
      console.error('  cd apps/backend');
      console.error('  npm run start:dev');
      console.error('');
      throw new Error('Backend not available at http://localhost:3000');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export default globalSetup;
