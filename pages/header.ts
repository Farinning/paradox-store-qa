import { Page, Locator, expect } from '@playwright/test';

/** The site header, shown on every page. We only need its cart icon. */
export class Header {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** The cart icon. Its accessible name contains the item count, e.g. "View cart, 2 items". */
  cartLink(): Locator {
    return this.page.getByRole('link', { name: /^View cart/ });
  }

  /** Checks the number shown on the cart icon (0 = no number). */
  async expectItemCount(count: number) {
    const expectedName =
      count === 0 ? 'View cart' : `View cart, ${count} item${count === 1 ? '' : 's'}`;
    await expect(this.cartLink()).toHaveAccessibleName(expectedName);
  }

  async openCart() {
    await this.cartLink().click();
    await expect(this.page).toHaveURL(/\/our-games\/cart/);
  }
}
