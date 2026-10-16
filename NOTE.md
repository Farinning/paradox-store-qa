# Note – Paradox store QA task

Marta Farina

## Testing environment and tools

- Windows 11, Chrome (incognito and normal window), and the Paradox live website (12–15 Oct 2026)
- Screen recordings with Xbox Game Bar and Snipping Tool
- Automation with Playwright (TypeScript)

Areas covered:

1. Catalog
2. Product page
3. Adding to cart
4. Cart

## Method

I screen-recorded all my sessions, in order to have evidence of anything that might happen while testing and messing around the website.

First, I explored the website and its pages looking for inconsistencies, price issues and problems when switching language. I take notes while testing, which helps me with bug reports and feedback. Then I started writing test scenarios, and found more bugs while testing them. After I was done checking prices and games, I reviewed the recordings and logged bugs and feedback. Finally, I wrote test scenarios for the bugs I had found at the beginning.

Also, this was my first time writing formal test cases, so some of them are kept deliberately simple. It was challenging, and I learned a lot, especially about writing checkable expected results. To write the test cases, I looked at some examples online to get the gist of it and then tried my own.

Test automation was the newest part of this task for me, but I hope my work shows my investigation and bug reporting skills! I tried my best!

## Rating scales

- Test cases: Priority, High – Low
- Bug reports: Severity and Priority, Critical – Low

| Level | Meaning |
|---|---|
| Critical | The website doesn't work |
| High | The website works, but with serious issues |
| Medium | There are some issues, but the player can work around them |
| Low | Minor issues that don't affect user experience |

Priority follows Severity unless noted.

## Use of AI

As agreed in the interview, I used AI for this QA task. I have no hands-on experience with automation testing, so the Playwright code was written by Claude. My part was deciding what to automate and why, running the tests on my laptop, checking the results, and making sure I understand what each test does and how to make them work on a live website. The test cases and all the bug findings are my own work. The AI model also helped with a first pass of site exploration and reviewed my test cases, but every bug was reproduced and confirmed by me, with supporting screen recordings. A few of them (BUG-06, BUG-07, BUG-08 and BUG-11) were first spotted during the AI exploration.

## Assumptions

Since test scenarios should still pass next month and prices and catalog content change often, I used some generic "rules" for my exploration. For instance, instead of referring to specific titles (e.g. BATTLETECH - Heavy Metal), I used formulas like "the first item with an Add to cart button on the On Sale page". This way, tests should still be valid next month.

Also, where the PDF didn't specify the expected behavior of some pages (e.g. where items without a price should appear when sorting), I based my tests on common store conventions. For example, on Steam, sorting by lowest price shows free games first, but not unreleased games without a price. On the All Games page, instead, "Coming soon" products appear first when sorting from low to high. That's why I decided to report this behavior as a bug.

## Bugs found

Full reports, with steps, severity, priority and evidence, are in `Farina - PARADOX QA Task.xlsx`.

| ID | Bug | Severity |
|---|---|---|
| BUG-01 | Items show "undefined USD" instead of the price (intermittent) | High |
| BUG-02 | Product page and cart prices don't match | High |
| BUG-03 | Rapid succession of clicks fails to add items to the cart | Medium |
| BUG-04 | Items lose PEGI badge in Chinese | Medium |
| BUG-05 | Item image is replaced by a generic logo in Chinese | Low |
| BUG-06 | Link points to a website that can't be reached | Medium |
| BUG-07 | Item titles are not the same across pages | Low |
| BUG-08 | Item titles in the same franchise are not consistent | Low |
| BUG-09 | Item titles in the same franchise are not consistent | Low |
| BUG-10 | Placeholder text instead of description | Low |
| BUG-11 | Sorting prices by low to high puts items with no price first | Low |
| BUG-12 | Invalid promo code error shows a technical key as its title | Low |

The automated test CART-05 also confirmed BUG-01 in the cart: right after a reload, the cart line briefly showed "undefined" instead of the product name.

## Improvement suggestions

Although I'm aware the Chinese beta is a work in progress, I found some issues related to it that need to be investigated further. I'd recommend reviewing and completing the Chinese translation, including the cart page.

An improvement I'd like to suggest is to temporarily disable the other "Add to cart" buttons while an item is being added. As shown in BUG-03, a rapid succession of clicks might fail to register some items in the cart.

An especially important issue is the inconsistency between discounted prices on the product page and in the cart (BUG-02). In the bug I found, the cart price was lower, but I couldn't check every product, so the difference might also go the other way. Either way, users could end up paying a different amount than the one shown. I'd recommend calculating discounted prices the same way on both pages and investigating the problem further.

Because of my background as an LQA tester, I pay close attention to UI strings and names. Though item names should be written in the same way on every page, there are some instances where game titles are written differently, e.g. "Crusader Kings III: By God Alone" loses "III" on the Buy Now page and in the cart. An option would be to review all item names in the catalog.

## What I'd test next

With more time, I'd focus on the inconsistency in discounted prices between the product page and the cart and see whether the cart might show a higher price than expected.

Were they in scope, I would have liked to test the Chinese beta version on other pages. Because of my background as an LQA and my degree in Japanese Studies, web pages in other languages are especially interesting to me.
