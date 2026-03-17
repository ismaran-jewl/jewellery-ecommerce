import { chromium, devices } from 'playwright';
import fs from 'fs';

const pagesToTest = [
    { name: 'Home', url: 'http://localhost:3000/' },
    { name: 'Shop', url: 'http://localhost:3000/shop' },
    { name: 'Login', url: 'http://localhost:3000/login' }
];

const viewports = [
    { name: 'Mobile (iPhone 12)', config: devices['iPhone 12'] },
    { name: 'Tablet (iPad Mini)', config: devices['iPad Mini'] },
    { name: 'Desktop (1920x1080)', config: { viewport: { width: 1920, height: 1080 } } }
];

async function runDiagnosis() {
    let report = '# Device Compatibility Diagnosis Report\n\n';
    
    // We launch a single browser.
    const browser = await chromium.launch({ headless: true });
    
    for (const vp of viewports) {
        report += `## Viewport: ${vp.name}\n\n`;
        const context = await browser.newContext(vp.config);
        const page = await context.newPage();
        
        for (const p of pagesToTest) {
            console.log(`Testing ${p.name} on ${vp.name}...`);
            try {
                await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
                // Check for horizontal scrolling
                const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
                const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
                
                const hasHorizontalScroll = scrollWidth > clientWidth;
                
                report += `### Page: ${p.name}\n`;
                if (hasHorizontalScroll) {
                    report += `- ❌ **Issue:** Horizontal scrolling detected. Document width (${scrollWidth}px) exceeds Viewport width (${clientWidth}px).\n`;
                } else {
                    report += `- ✅ **Responsive:** No horizontal scrolling.\n`;
                }
                
                // Screenshot
                const filename = `test-results/${p.name.toLowerCase()}-${vp.name.replace(/\W+/g, '-').toLowerCase()}.png`;
                await page.screenshot({ path: filename, fullPage: true });
                report += `- Screenshot saved: ${filename}\n\n`;
                
            } catch (err) {
                report += `### Page: ${p.name}\n`;
                report += `- ⚠️ Error loading page: ${err.message}\n\n`;
            }
        }
        await context.close();
    }
    
    await browser.close();
    fs.writeFileSync('device_compatibility_report.md', report);
    console.log('Diagnosis complete. Report saved to device_compatibility_report.md');
}

runDiagnosis().catch(console.error);
