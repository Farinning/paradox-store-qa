import { Page, Locator, expect } from '@playwright/test';

type SummaryLabel = 'Subtotal' | 'Discount' | 'Total';

/** The cart page: line items and the order summary. */
export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/our-games/cart');
  }

  /** Each line item has one "Remove <product name> from cart" button. */
  removeButtons(): Locator {
    return this.page.getByRole('button', { name: /^Remove .* from cart$/ });
  }

  async expectLineItemCount(count: number) {
    await expect(this.removeButtons()).toHaveCount(count);
  }

  /** Product names in the cart, read from the Remove buttons' labels. */
  async lineItemNames(): Promise<string[]> {
    const labels = await this.removeButtons().evaluateAll((buttons) =>
      buttons.map((b) => b.getAttribute('aria-label') ?? ''),
    );
    return labels.map((label) => label.replace(/^Remove /, '').replace(/ from cart$/, ''));
  }

  async removeLineItem(index = 0) {
    await this.removeButtons().nth(index).click();
  }

  emptyCartMessage(): Locator {
    return this.page.getByText('Your cart is empty');
  }

  /** The amount next to "Subtotal", "Discount" or "Total" in the summary. */
  summaryAmount(label: SummaryLabel): Locator {
    return this.page
      .getByText(label, { exact: true })
      .locator('xpath=following-sibling::span[1]');
  }

  /**
   * Reads a summary amount as a number: "39.98 EUR" -> 39.98, "-14.99 EUR" -> 14.99.
   * Returns 0 when the row is not shown (e.g. no Discount row when nothing is discounted).
   */
  async summaryValue(label: SummaryLabel): Promise<number> {
    const amount = this.summaryAmount(label);
    if ((await amount.count()) === 0) return 0;
    const text = await amount.innerText();
    return Math.abs(parseFloat(text.replace(/[^0-9.\-]/g, '')));
  }
}
