import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const baseUrl = process.env.EXPORT_BASE_URL ?? "http://127.0.0.1:5181/";
const outputRoot = path.resolve(process.env.EXPORT_DIR ?? "exports/02-经营主题/经营洞察");
const browserPath = process.env.PUPPETEER_EXECUTABLE_PATH
  ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const views = [
  { name: "经营洞察-海工", tab: "海工" },
  { name: "经营洞察-配套", tab: "配套" },
  { name: "经营洞察-修船-市场区域", tab: "修船", secondary: "市场区域" },
];

async function waitForAssets(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready;
    await Promise.all([...document.images].map((image) => image.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        })));
  });
  await new Promise((resolve) => setTimeout(resolve, 400));
}

async function clickButtonByText(page, text) {
  const clicked = await page.evaluate((label) => {
    const button = [...document.querySelectorAll("button")]
      .find((item) => item.textContent?.trim() === label);
    if (!(button instanceof HTMLButtonElement)) return false;
    button.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`未找到切换按钮：${text}`);
  await new Promise((resolve) => setTimeout(resolve, 350));
}

async function expandFullPage(page) {
  return page.evaluate(async () => {
    const screen = document.querySelector(".app-phone-screen");
    const scroller = screen?.firstElementChild;
    if (!(screen instanceof HTMLElement) || !(scroller instanceof HTMLElement)) {
      throw new Error("未找到手机页面滚动容器");
    }

    scroller.scrollTop = 0;
    for (let y = 0; y < scroller.scrollHeight; y += 420) {
      scroller.scrollTop = y;
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    scroller.scrollTop = 0;

    document.documentElement.classList.add("exporting-full-page");
    const fullHeight = Math.ceil(scroller.scrollHeight);
    screen.style.setProperty("height", `${fullHeight}px`, "important");
    screen.style.setProperty("min-height", `${fullHeight}px`, "important");
    screen.style.setProperty("overflow", "visible", "important");
    scroller.style.setProperty("height", "auto", "important");
    scroller.style.setProperty("overflow", "visible", "important");
    scroller.style.setProperty("flex", "none", "important");
    return fullHeight;
  });
}

const browser = await puppeteer.launch({
  executablePath: browserPath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000, deviceScaleFactor: 2 });
  await fs.mkdir(outputRoot, { recursive: true });
  const manifest = [];

  for (const view of views) {
    await page.goto(baseUrl, { waitUntil: "networkidle0", timeout: 60_000 });
    await page.addStyleTag({ content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      .exporting-full-page { scroll-behavior: auto !important; }
    ` });
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("navigate", { detail: "biz" }));
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await clickButtonByText(page, view.tab);
    if (view.secondary) await clickButtonByText(page, view.secondary);
    await waitForAssets(page);
    const height = await expandFullPage(page);

    const target = path.join(outputRoot, `${view.name}.png`);
    const screen = await page.$(".app-phone-screen");
    if (!screen) throw new Error(`页面 ${view.name} 未找到截图区域`);
    await screen.screenshot({ path: target, type: "png" });
    manifest.push({ ...view, file: path.basename(target), width: 375, height });
    console.log(`${view.name}.png (${height}px)`);
  }

  await fs.writeFile(
    path.join(outputRoot, "manifest.json"),
    `${JSON.stringify({ baseUrl, exportedAt: new Date().toISOString(), views: manifest }, null, 2)}\n`,
    "utf8",
  );
  console.log(`导出完成：${outputRoot}`);
} finally {
  await browser.close();
}
