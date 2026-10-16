import { test } from '@playwright/test';
import { CatalogPage } from '../pages/catalog-page';
import { Header } from '../pages/header';
import { CartPage } from '../pages/cart-page';

// ADD-02: The cart icon gets updated with every item added
test('ADD-02: header cart counter goes up by one with every item added', async ({ page }) => {
  const catalog = new CatalogPage(page);
  const header = new Header(page);
  const cart = new CartPage(page);

  await catalog.openSearchResults('stellaris');
  await header.expectItemCount(0);

  // Add five different products, one at a time, checking the counter after each one.
  for (let i = 0; i < 5; i++) {
    await catalog.addBuyableProduct(i);
    await header.expectItemCount(i + 1);
  }

  // The cart agrees with the counter
  await header.openCart();
  await cart.expectLineItemCount(5);
});
