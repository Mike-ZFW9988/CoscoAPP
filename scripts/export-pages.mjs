import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const baseUrl = process.env.EXPORT_BASE_URL ?? "http://127.0.0.1:5181/";
const outputRoot = path.resolve(process.env.EXPORT_DIR ?? "exports/pages-full");
const browserPath = process.env.PUPPETEER_EXECUTABLE_PATH
  ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const pages = [
  { group: "01-首页", id: "home", name: "首页" },
  { group: "02-经营", id: "biz", name: "经营主题" },
  { group: "02-经营", id: "biz-progress", name: "本周重点项目进展" },
  { group: "02-经营", id: "biz-overdue", name: "逾期应收" },
  { group: "02-经营", id: "biz-kpi-progress", name: "指标进度" },
  { group: "03-生产", id: "prod-repair", name: "修船主题" },
  { group: "03-生产", id: "prod-repair-ships", name: "修船-在厂艘数" },
  { group: "03-生产", id: "prod-repair-completion", name: "修船-完工明细" },
  { group: "03-生产", id: "prod-repair-daily", name: "修船-今日动态" },
  { group: "03-生产", id: "prod-ship", name: "造船主题" },
  { group: "03-生产", id: "prod-ship-delivery", name: "造船-交付进度" },
  { group: "03-生产", id: "prod-ship-delivery-detail", name: "造船-交付进度明细" },
  { group: "03-生产", id: "prod-ship-track", name: "造船-生产跟踪" },
  { group: "04-财务", id: "finance", name: "财务主题" },
  { group: "04-财务", id: "finance-fund", name: "可用资金" },
  { group: "04-财务", id: "finance-rate", name: "汇率" },
  { group: "04-财务", id: "finance-revenue", name: "营业收入" },
  { group: "05-采购", id: "purchase-group", name: "采购管理" },
  { group: "05-采购", id: "purchase-group-steel", name: "钢材采购" },
  { group: "05-采购", id: "purchase-group-rate", name: "集采率对标" },
  { group: "05-采购", id: "purchase-steel-dist", name: "钢材-企业分布" },
  { group: "05-采购", id: "purchase-steel-delivery", name: "钢材-锁价交付" },
  { group: "05-采购", id: "purchase-steel-cost", name: "钢材-成本预算" },
  { group: "06-质量", id: "quality", name: "质量主题" },
  { group: "06-质量", id: "quality-rt", name: "质量-RT合格率" },
  { group: "07-能源", id: "energy", name: "能源主题" },
  { group: "08-设计系统", id: "design-tokens", name: "Design-Token-System" },
  { group: "08-设计系统", id: "atomic-components", name: "Atomic-Components" },
  { group: "08-设计系统", id: "dashboard-components", name: "Dashboard-Components" },
  { group: "08-设计系统", id: "state-coverage", name: "State-Coverage" },
];

async function waitForAssets(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready;
    const images = [...document.images];
    await Promise.all(images.map((image) => image.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        })));
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function expandFullPage(page) {
  return page.evaluate(async () => {
    const screen = document.querySelector(".app-phone-screen");
    const scroller = screen?.firstElementChild;
    if (!(screen instanceof HTMLElement) || !(scroller instanceof HTMLElement)) {
      throw new Error("未找到手机页面滚动容器");
    }

    scroller.scrollTop = 0;
    for (let y = 0; y < scroller.scrollHeight; y += 500) {
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
  await page.goto(baseUrl, { waitUntil: "networkidle0", timeout: 60_000 });
  await page.addStyleTag({ content: `
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }
    .exporting-full-page { scroll-behavior: auto !important; }
  ` });

  await fs.mkdir(outputRoot, { recursive: true });
  const manifest = [];

  for (const [index, item] of pages.entries()) {
    await page.evaluate((id) => {
      window.dispatchEvent(new CustomEvent("navigate", { detail: id }));
    }, item.id);
    await page.waitForFunction(
      (id) => document.body.innerText.length > 0 && window.__lastExportPage !== id,
      { timeout: 10_000 },
      item.id,
    ).catch(() => {});
    await page.evaluate((id) => { window.__lastExportPage = id; }, item.id);
    await waitForAssets(page);
    const height = await expandFullPage(page);

    const directory = path.join(outputRoot, item.group);
    const filename = `${String(index + 1).padStart(2, "0")}-${item.name}.png`;
    const target = path.join(directory, filename);
    await fs.mkdir(directory, { recursive: true });

    const screen = await page.$(".app-phone-screen");
    if (!screen) throw new Error(`页面 ${item.id} 未找到截图区域`);
    await screen.screenshot({ path: target, type: "png" });
    manifest.push({ ...item, filename: path.relative(outputRoot, target), width: 375, height });
    console.log(`[${index + 1}/${pages.length}] ${item.group}/${filename} (${height}px)`);

    await page.reload({ waitUntil: "networkidle0", timeout: 60_000 });
    await page.addStyleTag({ content: `
      *, *::before, *::after { animation: none !important; transition: none !important; }
    ` });
  }

  await fs.writeFile(
    path.join(outputRoot, "manifest.json"),
    `${JSON.stringify({ baseUrl, exportedAt: new Date().toISOString(), pages: manifest }, null, 2)}\n`,
    "utf8",
  );
  console.log(`\n完成：${pages.length} 个完整页面已导出到 ${outputRoot}`);
} finally {
  await browser.close();
}
