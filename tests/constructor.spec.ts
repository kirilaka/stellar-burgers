import { test, expect } from '@playwright/test'
import userResponse from './fixtures/user.json';
import orderResponse from './fixtures/order.json';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('refreshToken', 'mock-refresh-token');
        document.cookie = 'accessToken=mock-access-token; path=/';
    });

    await page.route('**/api/auth/token', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                accessToken: 'Bearer mock-access-token',
                refreshToken: 'mock-refresh-token'
            })
        })
    );

    await page.routeFromHAR('./tests/fixtures/ingredients.har', {
        url: '**/api/ingredients',
        update: false,
        notFound: 'abort'
    });

    await page.route('**/api/auth/user', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(userResponse)
        })
    );

    await page.route('**/api/orders', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(orderResponse)
        })
    );
    await page.goto('/');
  });

  test('отображаются ингредиенты из мока', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(page.getByText('Биокотлета из марсианской Магнолии')).toBeVisible();
  });

  test('можно добавить ингредиент в конструктор', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeHidden();

    const ingredientCard = page.getByTestId('Краторная булка N-200i');
    await ingredientCard.getByText('Добавить').click();

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
  });

  test.describe('Модальное окно', () => {
    test('открывается модалка с деталями ингредиента', async ({ page }) => {
        await expect(page.getByTestId('modal')).toBeHidden();

        await page.getByText('Краторная булка N-200i').click();

        const modal = page.getByTestId('modal');
        await expect(modal).toBeVisible();
        await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
        await expect(modal.getByText('420')).toBeVisible();
    });

    test('закрывается модалка при клике на кнопку', async ({ page }) => {
        await expect(page.getByTestId('modal')).toBeHidden();

        await page.getByText('Краторная булка N-200i').click();
        const modal = page.getByTestId('modal');
        await expect(modal).toBeVisible();
        await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();

        await page.getByTestId('modalButton').click()

        await expect(page.getByTestId('modal')).toBeHidden();
    });

    test('закрывается модалка при клике на оверлей', async ({ page }) => {
        await expect(page.getByTestId('modal')).toBeHidden();

        await page.getByText('Краторная булка N-200i').click();
        const modal = page.getByTestId('modal');
        await expect(modal).toBeVisible();
        await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();

        await page.getByTestId('modalOverlay').click({ position: { x: 10, y: 10 } });

        await expect(page.getByTestId('modal')).toBeHidden();
    });
  });

  test.describe('Создание заказа', () => {
    test('создание заказа', async ({ page }) => {
        await expect(page.getByTestId('modal')).toBeHidden();

        const bun = page.getByTestId('Краторная булка N-200i');
        await bun.getByText('Добавить').click();
        await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();

        const filling = page.getByTestId('Биокотлета из марсианской Магнолии');
        await filling.getByText('Добавить').click();
        await expect(page.getByText('Биокотлета из марсианской Магнолии')).toBeVisible();

        await page.getByTestId('submitButton').click();

        await expect(page.getByTestId('modal')).toBeVisible();
        await expect(page.getByTestId('modal').getByText('12345')).toBeVisible()

        await page.getByTestId('modalButton').click();
        await expect(page.getByTestId('modal')).toBeHidden();

        await expect(page.getByText('Краторная булка N-200i (верх)')).toBeHidden();
        await expect(page.getByText('Биокотлета из марсианской Магнолии')).toBeHidden();
        await expect(page.getByText('Выберите начинку')).toBeVisible();
        await expect(page.getByText('Выберите булки')).toHaveCount(2);
    });
  })
});