const { test, expect } = require("@playwright/test");

const BASE_URL = "http://localhost:8888";

test.describe("Cardz 基本功能测试", () => {
  test("页面加载并显示所有阶段", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // 检查标题
    await expect(page.locator(".layout1-title")).toHaveText("卡子");

    // 检查7个阶段都存在
    const expectedStages = [
      "阶段 1：调研选题",
      "阶段 2：构思 Idea",
      "阶段 3：设计方法",
      "阶段 4：执行实验",
      "阶段 5：撰写论文",
      "阶段 6：审稿修改",
      "阶段 7：准备投稿",
    ];

    for (const stageName of expectedStages) {
      const stage = page.locator("details.stage-zone summary", { hasText: stageName });
      await expect(stage).toBeVisible();
    }
  });

  test("收藏区域存在且可折叠", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const favZone = page.locator("details.favorites-zone");
    await expect(favZone).toBeVisible();

    const favSummary = favZone.locator("summary");
    await expect(favSummary).toContainText("收藏");

    // 空收藏时显示提示
    await expect(page.locator(".favorites-zone .empty-tip")).toContainText("暂无收藏卡片");
  });

  test("分割线存在", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const dividers = page.locator(".section-divider");
    await expect(dividers).toHaveCount(2);

    await expect(dividers.nth(0)).toContainText("系统自带卡片");
    await expect(dividers.nth(1)).toContainText("用户自定义卡片");
  });

  test("topbar 按钮存在", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("#exportBtn")).toBeVisible();
    await expect(page.locator("#exportBtn")).toContainText("导出");
    await expect(page.locator("#settingsBtn")).toBeVisible();
  });

  test("页脚时间戳存在", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const footer = page.locator(".page-footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("更新于");
  });

  test("折叠/展开按钮工作", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const toggleBtn = page.locator("#toggleCollapseBtn");
    await expect(toggleBtn).toBeVisible();

    // 初始状态应为"折叠"（因为所有阶段都是展开的）
    await expect(toggleBtn).toHaveText("折叠");

    // 点击折叠
    await toggleBtn.click();
    await page.waitForTimeout(300);

    // 所有 zone 应该折叠
    const zones = page.locator("details.zone");
    const count = await zones.count();
    for (let i = 0; i < count; i++) {
      await expect(zones.nth(i)).not.toHaveAttribute("open", "");
    }

    // 按钮变为"展开"
    await expect(toggleBtn).toHaveText("展开");

    // 点击展开
    await toggleBtn.click();
    await page.waitForTimeout(300);

    // 按钮变回"折叠"
    await expect(toggleBtn).toHaveText("折叠");
  });

  test("切换英文界面", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // 打开设置菜单
    await page.locator("#settingsBtn").click();
    await page.waitForTimeout(200);

    // 点击切换语言
    await page.locator("#uiLangMenuBtn").click();
    await page.waitForTimeout(500);

    // 检查英文阶段名
    await expect(page.locator("details.stage-zone summary", { hasText: "Stage 1: Research & Select Topics" })).toBeVisible();
    await expect(page.locator("details.stage-zone summary", { hasText: "Stage 5: Write Papers" })).toBeVisible();

    // 收藏区域应为英文
    await expect(page.locator("details.favorites-zone summary")).toContainText("Favorites");

    // 分割线应为英文
    await expect(page.locator(".section-divider").nth(0)).toContainText("Built-in Cards");
    await expect(page.locator(".section-divider").nth(1)).toContainText("Custom Cards");

    // 导出按钮应为英文
    await expect(page.locator("#exportBtn")).toContainText("Export");

    // 页脚应为英文
    await expect(page.locator(".page-footer")).toContainText("Updated on");
  });

  test("新增卡片面板原模板随技能语言切换", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // 点击某个阶段的 + 按钮打开新增面板
    await page.locator("details.stage-zone").first().locator(".stage-ctrl-btn").first().click();
    await page.waitForTimeout(300);

    // 检查面板是否打开
    await expect(page.locator("#addModal")).not.toHaveClass(/hidden/);

    // 检查中文模板
    const metaTemplate = await page.locator("#metaTemplateInput").inputValue();
    expect(metaTemplate).toContain("你是一位世界顶级的 AI 提示词工程师");

    // 关闭面板
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
  });
});
