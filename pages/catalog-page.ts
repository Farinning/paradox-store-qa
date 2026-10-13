import { Page, expect } from '@playwright/test';

/** The "All games" catalogue: search, filters and product cards. */
export class CatalogPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/our-games/all-games');
    await this.dismissCookieBanner();
  }

  /** Declines non-essential cookies if the banner appears. If it doesn't, carry on. */
  async dismissCookieBanner() {
    await this.page
      .getByRole('button', { name: 'Decline' })
      .click({ timeout: 10_000 })
      .catch(() => {});
  }

  async search(term: string) {
    const searchBox = this.page.getByRole('searchbox', { name: 'Search' });
    await searchBox.fill(term);
    await searchBox.press('Enter');
    await expect(this.page).toHaveURL(new RegExp(`Search=${encodeURIComponent(term)}`));
  }

  /**
   * Adds a product to the cart from the results grid.
   * index 0 = the first product that can be bought, 1 = the second, and so on.
   * "Coming soon" and console-only products have no "Add to cart" button, so they are skipped.
   * The button is hidden until the mouse is over the card, so we hover first, like a player would.
   */
  async addBuyableProduct(index = 0) {
    const card = this.page
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('button', { name: 'Add to cart', includeHidden: true }) })
      .nth(index);
    await card.hover();
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }
}
