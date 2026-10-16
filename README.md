# Paradox store – QA take-home

Test scenarios, bug reports and automated tests for the Paradox Interactive online store
(catalog, product page, add to cart, cart).

- **Test scenarios and bug reports:** `test-scenarios.xlsx`
- **Method, assumptions, bugs found and what I'd test next:** `NOTE.md`
- **Automated tests:** this Playwright project (TypeScript)

## Setup

Requirements: [Node.js](https://nodejs.org/) 20 or later (LTS).

```bash
npm install
npx playwright install chromium
```

## Run the tests

```bash
npx playwright test
```

The five tests run one at a time against the live store and take about 40 seconds.

Other useful commands:

```bash
npx playwright test -g CART-06     # run one test by its test case ID
npx playwright test --headed       # watch the browser while the tests run
npx playwright show-report         # open the HTML report of the last run
```

When a test fails, a screenshot and a trace (a step-by-step replay) are saved in `test-results/`.
Open a trace with `npx playwright show-trace <path to trace.zip>`.

## What is automated

Each automated test matches a test case in `test-scenarios.xlsx`, with the same ID.

| Test case | What the test checks | Flow in the brief |
|---|---|---|
| CAT-05 | A product found with search can be added to the cart | 1 |
| ADD-02 | The header cart counter goes up by one with every item added (5 items) | 2 |
| CART-06 | Cart summary adds up: subtotal minus discount equals total | 3 |
| CART-07 | Removing items updates the cart, then shows the empty state | 4 |
| CART-05 | Cart contents persist after a page reload | 5 |

## Project structure

```
pages/                     page objects: one class per part of the store
  catalog-page.ts          All games page: open, search, add a product from the grid
  header.ts                site header: cart icon counter, open the cart
  cart-page.ts             cart: line items, remove, empty state, summary amounts
tests/
  cart.spec.ts             CAT-05, CART-05
  header-counter.spec.ts   ADD-02
  cart-summary.spec.ts     CART-06, CART-07
playwright.config.ts       settings for a live production site (see below)
```

## How the tests deal with a live, changing store

- **No fixed products or prices.** Tests search for a franchise ("stellaris") and add the first
  products that have an "Add to cart" button, so they keep working when products, prices or
  discounts change. Coming-soon and console-only products have no button and are skipped
  automatically. Prices are read from the page and compared with each other, never typed into the test.
- **Robust selectors.** Elements are found by role and accessible name (e.g. the "View cart, 2 items"
  link, the "Remove … from cart" buttons), not by generated CSS class names.
- **No fixed waits.** Every check waits for a condition. Where the store updates in two steps
  (the totals can update a moment after the item count; after a reload the item name can briefly
  show "undefined"), the test re-reads the value until it is right or a timeout is reached.
- **Clean cart for every test.** Each test runs in a new browser context, so it starts with an
  empty cart and doesn't depend on any other test.
- **Cookie banner.** Declined (non-essential cookies) if it appears; ignored if it doesn't.
- **Gentle on production.** One test at a time (`workers: 1`), no automatic retries, so a flaky
  result is visible instead of hidden. Timeouts are generous because the store can be slow.
- **Never buys anything.** Tests only check that "Proceed to checkout" is present and enabled.

## Known limitations

- The tests assume some Stellaris products can be bought in the store. If that ever changes,
  the search term in the tests needs updating.
- The store is live and sometimes slow or briefly broken (see the "undefined USD" bug in
  `test-scenarios.xlsx`). A failure can therefore be a real store problem rather than a test
  problem: the screenshot and trace show which.
