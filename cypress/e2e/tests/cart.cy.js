// Cart test to make sure that user decisions are tracked properly,
// cart is reliable when relogged, and does show proper continuous info to the user via the badge
// This is important because the cart is the only place to proceed to checkout,
// user has to have 100% certainty that they are ordering what was intended
// The painful bug/missing requirement here is the lack of manipulation with quantity -
// user can not buy more than 1 of each item in one order - leads to lost revenue
describe('Cart', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/inventory.html', { failOnStatusCode: false });
  });
  it('shows no badge when the cart is empty', () => {
    cy.get('[data-test="shopping-cart-link"]').should('be.visible');
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('updates the badge when adding and removing from the item detail page', () => {
    cy.get('[data-test="inventory-item-name"]').first().click();
    cy.location('pathname').should('eq', '/inventory-item.html');

    cy.get('[data-test="add-to-cart"]').should('be.visible').click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');

    cy.get('[data-test="remove"]').click();
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('updates the badge when adding and removing from the items inventory list', () => {
    cy.get('[data-test^="add-to-cart"]').first().click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');

    cy.get('[data-test^="add-to-cart"]').first().click();
    cy.get('[data-test^="add-to-cart"]').first().click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '3');

    cy.get('[data-test^="remove"]').first().click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '2');
  });

  it('lists the correct items on the cart page', () => {
    const addedNames = [];

    cy.get('[data-test="inventory-item"]').each(($item, i) => {
      if (i > 1) return;
      cy.wrap($item)
        .find('[data-test="inventory-item-name"]')
        .invoke('text')
        .then((t) => addedNames.push(t.trim()));
      cy.wrap($item).find('[data-test^="add-to-cart"]').click();
    });

    cy.get('[data-test="shopping-cart-link"]').click();
    cy.location('pathname').should('eq', '/cart.html');

    cy.contains('Your Cart').should('be.visible');
    cy.contains('QTY').should('be.visible');
    cy.contains('Description').should('be.visible');

    cy.get('[data-test="inventory-item"]').should('have.length', 2);
    cy.get('[data-test="inventory-item-name"]').each(($el, i) => {
      expect($el.text().trim()).to.equal(addedNames[i]);
    });
  });
  it('persists cart content across sessions', () => {
    cy.get('[data-test^="add-to-cart"]').first().click();
    cy.get('[data-test^="add-to-cart"]').first().click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '2');

    cy.logout();
    cy.login();
    cy.visit('/inventory.html', { failOnStatusCode: false });

    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '2');
  });
});
