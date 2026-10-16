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

  /**
   * Types a term in the search box and presses Enter, like a player.
   * We first wait for the product grid, as a sign the page is ready: if Enter is pressed
   * before the page's scripts have loaded, the store ignores the search.
   */
  async search(term: string) {
    await expect(this.page.getByText(/Showing \d+ of \d+/)).toBeVisible();
    const searchBox = this.page.getByRole('searchbox', { name: 'Search' });
    await searchBox.fill(term);
    await searchBox.press('Enter');
    await expect(this.page).toHaveURL(new RegExp(`Search=${encodeURIComponent(term)}`));
  }

  /**
   * Opens the search results directly by URL, without typing in the search box.
   * Used to set up tests that are about the cart, not about search,
   * so that a search problem cannot make a cart test fail.
   */
  async openSearchResults(term: string) {
    await this.page.goto(`/our-games/all-games?Search=${encodeURIComponent(term)}`);
    await this.dismissCookieBanner();
    await expect(this.page.getByText(/Showing \d+ of \d+/)).toBeVisible();
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
