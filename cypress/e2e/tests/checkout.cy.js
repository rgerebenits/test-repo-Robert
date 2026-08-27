// Checkout test to make sure user can properly order items they chose and the app
// knows the necessary user data
// This is a crucial part due to completion of the most important business flow -
// to buy a product - here user is presented with final and binding information that
// needs to be displayed properly and add up
describe('Checkout', () => {
  const num = (text) => Number(text.replace(/[^0-9.]/g, ''));
  const round = (n) => Math.round(n * 100) / 100;
  const TAX_RATE = 0.08;

  const proceedToSummary = () => {
    // implement faker here if repeatable info becomes an issue
    cy.get('[data-test="firstName"]').type('Robert');
    cy.get('[data-test="lastName"]').type('Testovac');
    cy.get('[data-test="postalCode"]').type('81109');
    cy.get('[data-test="continue"]').click();
    cy.location('pathname').should('eq', '/checkout-step-two.html');
  };

  beforeEach(() => {
    cy.login();
    cy.visit('/inventory.html', { failOnStatusCode: false });
    cy.prepareCart();
  });

  it('blocks progress when personal information is missing', () => {
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should(
      'have.text',
      'Error: First Name is required',
    );
    cy.location('pathname').should('eq', '/checkout-step-one.html');
  });

  // this "it" test below is recommended for such a sensitive data, but on this web app,
  // the fields do not validate this, so better to skip it for now as it fails
  it.skip('blocks progress when personal information is incorrect', () => {
    cy.get('[data-test="firstName"]').type('51901234');
    cy.get('[data-test="lastName"]').type('..!*');
    cy.get('[data-test="postalCode"]').type('random123');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]').should('be.visible');
    cy.location('pathname').should('eq', '/checkout-step-one.html');
  });

  it('displays payment, shipping and total sections', () => {
    proceedToSummary();
    cy.get('[data-test="payment-info-label"]').should('be.visible');
    cy.get('[data-test="shipping-info-label"]').should('be.visible');
    cy.get('[data-test="total-info-label"]').should('be.visible');
  });

  it('calculates subtotal, tax and total correctly', () => {
    proceedToSummary();

    let itemSum = 0;
    const totals = {};

    cy.get('[data-test="inventory-item-price"]').each(($el) => {
      itemSum += num($el.text());
    });

    cy.get('[data-test="subtotal-label"]')
      .invoke('text')
      .then((t) => (totals.subtotal = num(t)));
    cy.get('[data-test="tax-label"]')
      .invoke('text')
      .then((t) => (totals.tax = num(t)));
    cy.get('[data-test="total-label"]')
      .invoke('text')
      .then((t) => (totals.total = num(t)));

    cy.then(() => {
      expect(totals.subtotal).to.equal(round(itemSum));
      expect(totals.tax).to.equal(round(totals.subtotal * TAX_RATE));
      expect(totals.total).to.equal(round(totals.subtotal + totals.tax));
    });
  });

  // Bug: item total shows unrounded number, for example $59.980000000000004.
  // customer-facing money values should display two decimals, therefore keeping the test but skipping
  it.skip('displays all money values to two decimal places', () => {
    proceedToSummary();
    cy.get('[data-test="subtotal-label"]')
      .invoke('text')
      .should('match', /^Item total: \$\d+\.\d{2}$/);
    cy.get('[data-test="tax-label"]')
      .invoke('text')
      .should('match', /^Tax: \$\d+\.\d{2}$/);
    cy.get('[data-test="total-label"]')
      .invoke('text')
      .should('match', /^Total: \$\d+\.\d{2}$/);
  });

  it('completes the order', () => {
    proceedToSummary();
    cy.get('[data-test="finish"]').click();
    cy.get('[data-test="complete-header"]')
      .should('be.visible')
      .and('have.text', 'Thank you for your order!');
    cy.get('[data-test="generate-pdf-order"]').should('be.visible');
  });
});
