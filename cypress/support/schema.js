import createUser from '../schemas/create-user.schema.json';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = addFormats(new Ajv({ allErrors: true }));

const validators = {
  'create-user': ajv.compile(createUser),
};

export function validateSchema(body, name) {
  const validate = validators[name];
  expect(validate(body), ajv.errorsText(validate.errors)).to.be.true;
}
