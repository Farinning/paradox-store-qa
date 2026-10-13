import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/catalog-page';
import { Header } from '../pages/header';
import { CartPage } from '../pages/cart-page';

test('search for a product and add it to the cart', async ({ page }) => {
  const catalog = new CatalogPage(page);
  const header = new Header(page);
  const cart = new CartPage(page);

  await catalog.open();
  await header.expectItemCount(0);

  await catalog.search('stellaris');
  await catalog.addBuyableProduct(0);
  await header.expectItemCount(1);

  await header.openCart();
  await cart.expectLineItemCount(1);
});

test('cart contents persist after a page reload', async ({ page }) => {
  const catalog = new CatalogPage(page);
  const header = new Header(page);
  const cart = new CartPage(page);

  // Arrange: one product in the cart
  await catalog.open();
  await catalog.search('stellaris');
  await catalog.addBuyableProduct(0);
  await header.expectItemCount(1);
  await header.openCart();
  await cart.expectLineItemCount(1);

  // Remember what the cart looks like before the reload
  const namesBefore = await cart.lineItemNames();
  const totalBefore = await cart.summaryAmount('Total').innerText();

  // Act
  await page.reload();

  // Assert: same product, same total, same counter
  await cart.expectLineItemCount(1);
  expect(await cart.lineItemNames()).toEqual(namesBefore);
  await expect(cart.summaryAmount('Total')).toHaveText(totalBefore);
  await header.expectItemCount(1);
});
