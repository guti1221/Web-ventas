const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = process.argv[2] || '/tmp/frames';
  fs.mkdirSync(outDir, { recursive: true });
  const fps = 24, dur = 12.0;
  const N = Math.round(fps * dur);
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb']
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(__dirname, 'video.html'));
  await page.waitForTimeout(300);
  for (let i = 0; i < N; i++) {
    const t = i / fps;
    await page.evaluate((t) => window.renderFrame(t), t);
    await page.screenshot({ path: path.join(outDir, 'f' + String(i).padStart(4, '0') + '.png') });
  }
  await browser.close();
  console.log('frames:', N, '-> ok');
})();
