import users from '../../fixtures/users.json';
import { validateSchema } from '../../support/schema.js';
const limit = Cypress.expose('responseTimeLimit');

describe('POST users', () => {
  users.forEach((payload) => {
    it(`create a user and validates response - ${payload.name}`, () => {
      const sentAt = Date.now();
      cy.env(['apiKey'])
        .then(({ apiKey }) => {
          cy.request({
            method: 'POST',
            url: Cypress.expose('apiUrlPost'),
            headers: { 'x-api-key': apiKey },
            body: payload,
          });
        })
        .then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body).to.include(payload);
          expect(res.body.id).to.match(/^\d+$/);
          cy.log('response ID is ' + res.body.id);

          // test response time and date
          const createdTime = Date.parse(res.body.createdAt);
          const timeFormat = new Date(res.body.createdAt);

          expect(res.duration).to.be.lessThan(limit);
          expect(createdTime).to.be.within(sentAt - 1500, Date.now() + 1500);
          expect(
            timeFormat.toISOString(),
            'createdTime must be YYYY-MM-DDTHH:mm:ss.sssZ',
          ).to.eq(res.body.createdAt);
        });
    });
    it(`bonus task - validate schema ${payload.name}`, () => {
      cy.env(['apiKey'])
        .then(({ apiKey }) => {
          cy.request({
            method: 'POST',
            url: Cypress.expose('apiUrlPost'),
            headers: { 'x-api-key': apiKey },
            body: payload,
          });
        })
        .then((res) => {
          expect(res.status).to.eq(201);
          validateSchema(res.body, 'create-user');
        });
    });
  });
});
