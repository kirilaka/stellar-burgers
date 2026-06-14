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
    const ingredientCard = page.getByTestId('Краторная булка N-200i');
    await ingredientCard.getByText('Добавить').click();

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
  });

  test.describe('Модальное окно', () => {
    test('открывается модалка с деталями ингредиента', async ({ page }) => {
        await page.getByText('Краторная булка N-200i').click();

        await expect(page.getByTestId('modal')).toBeVisible();
        await expect(page.getByText('Калории, ккал')).toBeVisible();
    });

    test('закрывается модалка при клике на кнопку', async ({ page }) => {
        await page.getByText('Краторная булка N-200i').click();
        await expect(page.getByTestId('modal')).toBeVisible();

        await page.getByTestId('modalButton').click()

        await expect(page.getByTestId('modal')).toBeHidden();
    });

    test('закрывается модалка при клике на оверлей', async ({ page }) => {
        await page.getByText('Краторная булка N-200i').click();
        await expect(page.getByTestId('modal')).toBeVisible();

        await page.getByTestId('modalOverlay').click({ position: { x: 10, y: 10 } });

        await expect(page.getByTestId('modal')).toBeHidden();
    });
  });

  test.describe('Создание заказа', () => {
    test('создание заказа', async ({ page }) => {
        const bun = page.getByTestId('Краторная булка N-200i');
        await bun.getByText('Добавить').click();

        const filling = page.getByTestId('Краторная булка N-200i');
        await filling.getByText('Добавить').click();

        await page.getByTestId('submitButton').click();

        await expect(page.getByTestId('modal')).toBeVisible();
        await expect(page.getByText('12345')).toBeVisible();

        await page.getByTestId('modalButton').click();
        await expect(page.getByTestId('modal')).toBeHidden();

        await expect(page.getByText('Выберите начинку')).toBeVisible();
        await expect(page.getByText('Выберите булки')).toHaveCount(2);
    });
  })
});