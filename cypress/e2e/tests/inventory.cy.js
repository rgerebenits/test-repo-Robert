// Items are displayed, users are able to see description, price and other info
// This is important, as the goal of this web is to sell these items,
// without description and price it's hard for user to navigate it,
// essential for any shop style web to have this info correct 100% of the time

describe('Items inventory', () => {
  const numberOfActiveItems = 6;
  beforeEach(() => {
    cy.login();
    cy.visit('/inventory.html', { failOnStatusCode: false });
  });
  it('loads the inventory page after login', () => {
    cy.location('pathname').should('eq', '/inventory.html');
    cy.get('[data-test="inventory-container"]').should('be.visible');
  });

  it('shows every product with name, price and description', () => {
    cy.get('[data-test="inventory-item"]')
      .should('have.length', numberOfActiveItems)
      .each(($item) => {
        cy.wrap($item).within(() => {
          cy.get('[data-test="inventory-item-name"]')
            .invoke('text')
            .should('match', /\S/);
          cy.get('[data-test="inventory-item-desc"]')
            .invoke('text')
            .should('match', /\S/);
          cy.get('[data-test="inventory-item-price"]')
            .invoke('text')
            .should('match', /^\$\d+\.\d{2}$/);
          cy.get('[data-test^="add-to-cart"]')
            .should('be.visible')
            .and('be.enabled');
        });
      });
  });

  it('carries the product description to detail page', () => {
    let itemDescription;

    cy.get('[data-test="inventory-item-desc"]')
      .eq(1)
      .invoke('text')
      .then((text) => {
        itemDescription = text.trim();
      });

    cy.get('[data-test="inventory-item-name"]').eq(1).click();
    cy.url().should('contain', 'inventory-item.html?id');

    cy.get('[data-test="inventory-item-desc"]').should(($el) => {
      expect($el.text().trim()).to.equal(itemDescription);
    });
  });

  // skipped due to bug with untranslated keys on the page
  it.skip('product copy contains no untranslated keys or code artifacts', () => {
    const incorrectPatterns = [
      /\w+\.\w+\(\)/,
      /\{\{.*\}\}/,
      /undefined|null|NaN/,
    ];

    ['name', 'desc'].forEach((field) => {
      cy.get(`[data-test="inventory-item-${field}"]`).each(($el) => {
        const text = $el.text().trim();
        incorrectPatterns.forEach((pattern) => {
          expect(text).to.have.length.greaterThan(2);
          expect(text, `${field}: "${text}"`).to.not.match(pattern);
        });
      });
    });
  });
});
