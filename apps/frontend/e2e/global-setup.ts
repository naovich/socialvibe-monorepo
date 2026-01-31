import { FullConfig } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(_config: FullConfig) {
  console.log('🔧 E2E Global Setup - Checking backend...');
  
  const maxRetries = 30;
  
  // Wait for backend to be ready (using curl)
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3000/api', { timeout: 2000 });
      // Backend responds with JSON error for /api, which means it's running
      if (stdout.includes('Cannot GET') || stdout.includes('404') || stdout.includes('error')) {
        console.log('✅ Backend is ready!');
        console.log('✅ Using existing database (tests will create unique data)');
        return; // Success
      }
    } catch {
      // curl failed - backend not ready yet
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
