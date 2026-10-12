const { test, expect } = require('@playwright/test');

const TARGET_URL = 'http://localhost:3000';

test.describe('Pocket Calculator E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(TARGET_URL);
  });

  test('[SC-01] Thực hiện phép tính cơ bản chính xác', async ({ page }) => {
    // 7 + 8 = 15
    await page.click('button:has-text("7")');
    await page.click('#key-add');
    await page.click('button:has-text("8")');
    await page.click('#key-equals');

    const result = await page.textContent('#display-result');
    expect(result).toBe('15');
  });

  test('[SC-02] Xử lý phép chia cho số 0', async ({ page }) => {
    // 9 / 0 = Error: Division by zero
    await page.click('button:has-text("9")');
    await page.click('#key-divide');
    await page.click('button:has-text("0")');
    await page.click('#key-equals');

    const result = await page.textContent('#display-result');
    expect(result).toBe('Error: Division by zero');
  });

  test('[SC-02] Ngăn chặn nhập nhiều dấu chấm thập phân', async ({ page }) => {
    // Nhập "1.2.3" -> Kết quả hiển thị "1.23"
    await page.click('button:has-text("1")');
    await page.click('#key-decimal');
    await page.click('button:has-text("2")');
    await page.click('#key-decimal');
    await page.click('button:has-text("3")');

    const result = await page.textContent('#display-result');
    expect(result).toBe('1.23');
  });

  test('[SC-03] Chức năng xóa số DEL và Xóa tất cả AC', async ({ page }) => {
    // Nhập 123 -> DEL -> 12
    await page.click('button:has-text("1")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text("3")');
    await page.click('#key-del');

    let result = await page.textContent('#display-result');
    expect(result).toBe('12');

    // Bấm AC -> Quay về 0
    await page.click('#key-ac');
    result = await page.textContent('#display-result');
    expect(result).toBe('0');
  });

  test('[SC-04] Hỗ trợ Keyboard vật lý thực hiện phép toán', async ({ page }) => {
    // Sử dụng phím ảo gõ: 5 * 6 Enter
    await page.focus('#display-result');
    await page.keyboard.press('5');
    await page.keyboard.press('*');
    await page.keyboard.press('6');
    await page.keyboard.press('Enter');

    const result = await page.textContent('#display-result');
    expect(result).toBe('30');
  });
});