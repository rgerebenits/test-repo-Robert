describe("Initial dry run test", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("tests if login is ok", () => {
    cy.get(".login_logo");
    cy.get('[data-test="username"]').type(Cypress.env("username"));
    cy.get('[data-test="password"]').type(Cypress.env("password"));
    cy.get('[data-test="login-button"]').click();
  });
});
