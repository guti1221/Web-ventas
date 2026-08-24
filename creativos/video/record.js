const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = process.argv[2] || __dirname;
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb']
  });
  const ctx = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    recordVideo: { dir: outDir, size: { width: 1080, height: 1920 } }
  });
  const page = await ctx.newPage();
  await page.goto('file://' + path.resolve(__dirname, 'video.html'));
  const video = page.video();
  await page.waitForTimeout(12800);
  await ctx.close();
  await browser.close();
  const p = await video.path();
  const dst = path.join(outDir, 'anuncio-verano.webm');
  fs.renameSync(p, dst);
  console.log('video ->', dst);
})();
