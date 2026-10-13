import { test, expect, Page } from '@playwright/test';
import { CatalogPage } from '../pages/catalog-page';
import { Header } from '../pages/header';
import { CartPage } from '../pages/cart-page';

/**
 * Arrange step shared by the tests below:
 * puts the first `count` buyable products from a search into the cart, then opens the cart.
 */
async function openCartWithProducts(page: Page, count: number) {
  const catalog = new CatalogPage(page);
  const header = new Header(page);
  const cart = new CartPage(page);

  await catalog.openSearchResults('stellaris');
  for (let i = 0; i < count; i++) {
    await catalog.addBuyableProduct(i);
    await header.expectItemCount(i + 1);
  }
  await header.openCart();
  await cart.expectLineItemCount(count);
  return { header, cart };
}

test('cart summary adds up: subtotal minus discount equals total', async ({ page }) => {
  const { cart } = await openCartWithProducts(page, 2);

  // The summary can finish loading a moment after the line items (see BUG-07),
  // so expect.poll re-reads the three amounts until they are consistent, or times out.
  await expect
    .poll(async () => {
      const subtotal = await cart.summaryValue('Subtotal');
      const discount = await cart.summaryValue('Discount'); // 0 when there is no Discount row
      const total = await cart.summaryValue('Total');
      // Compare in cents, to avoid rounding noise with decimals
      return Math.round((subtotal - discount - total) * 100);
    })
    .toBe(0);

  expect(await cart.summaryValue('Subtotal')).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'Proceed to checkout' })).toBeEnabled();
});

test('removing items updates the cart, then shows the empty state', async ({ page }) => {
  const { header, cart } = await openCartWithProducts(page, 2);
  const namesBefore = await cart.lineItemNames();
  const subtotalBefore = await cart.summaryValue('Subtotal');

  // Remove one of two items
  await cart.removeLineItem(0);
  await cart.expectLineItemCount(1);
  await header.expectItemCount(1);
  expect(await cart.lineItemNames()).not.toContain(namesBefore[0]);
  await expect.poll(() => cart.summaryValue('Subtotal')).toBeLessThan(subtotalBefore);

  // Remove the last item
  await cart.removeLineItem(0);
  await expect(cart.emptyCartMessage()).toBeVisible();
  await cart.expectLineItemCount(0);
  await header.expectItemCount(0);
  await expect(page.getByRole('button', { name: 'Proceed to checkout' })).toHaveCount(0);
});
