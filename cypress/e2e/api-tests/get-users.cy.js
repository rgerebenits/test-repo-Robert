describe('GET users', () => {
  it('returns users from page 2', () => {
    cy.request({
      method: 'GET',
      url: Cypress.expose('apiUrlGet'),
      headers: { 'x-api-key': Cypress.env('apiKey') },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);

      // assert
      expect(body.total).to.eq(12);
      expect(body.data[0].last_name).to.eq('Lawson');
      expect(body.data[1].last_name).to.eq('Ferguson');

      // count and total
      expect(body.data).to.have.length(body.per_page);
      expect(body.data.length).to.be.at.most(body.total);
    });
  });
  it('Bonus task-assert types', () => {
    cy.request({
      method: 'GET',
      url: Cypress.expose('apiUrlGet'),
      headers: { 'x-api-key': Cypress.env('apiKey') },
    }).then(({ status, body }) => {
      expect(status).to.eq(200);

      expect(body.page).to.be.a('number');
      expect(body.per_page).to.be.a('number');
      expect(body.total).to.be.a('number');
      expect(body.total_pages).to.be.a('number');
      expect(body.data).to.be.an('array');

      body.data.forEach((user) => {
        expect(user.id).to.be.a('number');
        expect(user.email).to.be.a('string').and.match(/@/);
        expect(user.first_name).to.be.a('string').and.not.be.empty;
        expect(user.last_name).to.be.a('string').and.not.be.empty;
        expect(user.avatar)
          .to.be.a('string')
          .and.to.match(/^https:\/\//);
      });
      expect(body.support).to.be.an('object');
      expect(body._meta).to.be.an('object');
    });
  });
});
