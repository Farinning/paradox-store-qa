import { test, expect } from '@playwright/test';

test('search for a product and add it to the cart', async ({ page }) => {
  test.setTimeout(60_000);

  // 1. Open the catalogue
  await page.goto('https://www.paradoxinteractive.com/our-games/all-games');

  // 2. Close the cookie banner if it appears (if not, carry on)
  await page.getByRole('button', { name: 'Decline' })
    .click({ timeout: 10_000 })
    .catch(() => {});

  // 3. Search for a keyword
  const search = page.getByRole('searchbox', { name: 'Search' });
  await search.fill('stellaris');
  await search.press('Enter');
  await expect(page).toHaveURL(/Search=stellaris/);

  // 4. Add the first product that has an "Add to cart" button.
  //    The button is hidden until the mouse is over the product card,
  //    so we hover the card first, like a real player would.
  const firstBuyableCard = page.getByRole('listitem')
    .filter({ has: page.getByRole('button', { name: 'Add to cart', includeHidden: true }) })
    .first();
  await firstBuyableCard.hover();
  await firstBuyableCard.getByRole('button', { name: 'Add to cart' }).click();

  // 5. Expected: the header cart shows 1 item
  const cartLink = page.getByRole('link', { name: 'View cart, 1 item' });
  await expect(cartLink).toBeVisible({ timeout: 15_000 });

  // 6. Open the cart. Expected: exactly one line item
  await cartLink.click();
  await expect(page).toHaveURL(/\/our-games\/cart/);
  await expect(page.getByRole('button', { name: /Remove .* from cart/ }))
    .toHaveCount(1, { timeout: 15_000 });
});