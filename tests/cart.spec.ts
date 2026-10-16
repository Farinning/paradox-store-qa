import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/catalog-page';
import { Header } from '../pages/header';
import { CartPage } from '../pages/cart-page';

test('CAT-05: a product found with search can be added to the cart', async ({ page }) => {
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

test('CART-05: cart contents persist after a page reload', async ({ page }) => {
  const catalog = new CatalogPage(page);
  const header = new Header(page);
  const cart = new CartPage(page);

  // Arrange: one product in the cart
  await catalog.openSearchResults('stellaris');
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
  // Right after a reload the line can briefly show "undefined" instead of the product name,
  // until the cart data has loaded (the same symptom as the "undefined USD" bug). So we wait for the name,
  // and the test only fails if it never comes back.
  await expect.poll(() => cart.lineItemNames()).toEqual(namesBefore);
  await expect(cart.summaryAmount('Total')).toHaveText(totalBefore);
  await header.expectItemCount(1);
});
