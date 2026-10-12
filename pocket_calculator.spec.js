const { test, expect } = require('@playwright/test');

test.describe('Pocket Calculator App Test Cases', () => {

  test.beforeEach(async ({ page }) => {
    // Tải ứng dụng cục bộ từ máy chủ hiện tại
    await page.goto('http://localhost:3000');
  });

  test('[SC-01] Thực hiện phép toán cơ bản chính xác', async ({ page }) => {
    // Bấm số: 7 + 8 = 15
    await page.click('button:has-text("7")');
    await page.click('button[aria-label="Add"]');
    await page.click('button:has-text("8")');
    await page.click('#equals-btn');

    const result = await page.textContent('#result-display');
    expect(result).toBe('15');
  });

  test('[SC-02] Không cho nhập trùng dấu thập phân và giải quyết chia 0', async ({ page }) => {
    // Kiểm tra không cho nhập 1.2.3
    await page.click('button:has-text("1")');
    await page.click('button:has-text(".")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text(".")'); // Chặn nhập
    await page.click('button:has-text("3")');

    let resultValue = await page.textContent('#result-display');
    expect(resultValue).toBe('1.23');

    // Reset màn hình
    await page.click('button[aria-label="Clear All"]');

    // Thực hiện chia 0
    await page.click('button:has-text("9")');
    await page.click('button[aria-label="Divide"]');
    await page.click('button:has-text("0")');
    await page.click('#equals-btn');

    const errorResult = await page.textContent('#result-display');
    expect(errorResult).toContain('Error: Division by zero');
  });

  test('[SC-03] Chức năng Phần trăm, Đổi dấu và Lịch sử phép tính', async ({ page }) => {
    // Test chức năng phần trăm 50% = 0.5
    await page.click('button:has-text("5")');
    await page.click('button:has-text("0")');
    await page.click('button[aria-label="Percentage"]');
    expect(await page.textContent('#result-display')).toBe('0.5');

    // Chuyển dấu +/-
    await page.click('button[aria-label="Toggle plus minus"]');
    expect(await page.textContent('#result-display')).toBe('-0.5');

    // Gửi phép toán 5 + 5 = 10 để lưu lịch sử
    await page.click('button[aria-label="Clear All"]');
    await page.click('button:has-text("5")');
    await page.click('button[aria-label="Add"]');
    await page.click('button:has-text("5")');
    await page.click('#equals-btn');

    // Chờ lưu vào lịch sử hiển thị
    const historyItem = await page.locator('.history-item').first();
    const historyExpression = await historyItem.locator('.history-item-exp').textContent();
    const historyResult = await historyItem.locator('.history-item-res').textContent();

    expect(historyExpression).toBe('5 + 5 =');
    expect(historyResult).toBe('10');
  });

  test('[SC-04] Phản hồi phím tắt từ bàn phím vật lý', async ({ page }) => {
    // Nhấp bàn phím ảo để kiểm tra sự phản hồi của window listener
    await page.keyboard.press('9');
    await page.keyboard.press('*');
    await page.keyboard.press('9');
    await page.keyboard.press('Enter');

    const keyboardResult = await page.textContent('#result-display');
    expect(keyboardResult).toBe('81');
  });
});