Cypress.Commands.add('login', () => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(Cypress.env('username'));
  cy.get('[data-test="password"]').type(Cypress.env('password'), {
    log: false,
  });
  cy.get('[data-test="login-button"]').click();
  cy.location('pathname').should('eq', '/inventory.html');
});

Cypress.Commands.add('logout', () => {
  cy.get('[id="react-burger-menu-btn"]').click();
  cy.get('[data-test="logout-sidebar-link"]').click();
  cy.url().should('eq', 'https://www.saucedemo.com/');
});

Cypress.Commands.add('prepareCart', () => {
  cy.get('[data-test^="add-to-cart"]').first().click();
  cy.get('[data-test^="add-to-cart"]').first().click();
  cy.get('[data-test="shopping-cart-link"]').click();
  cy.location('pathname').should('eq', '/cart.html');
  cy.get('[data-test="checkout"]').click();
  cy.location('pathname').should('eq', '/checkout-step-one.html');
});
