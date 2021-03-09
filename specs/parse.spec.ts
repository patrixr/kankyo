import it         from 'ava'
import { parse }  from '../lib/kankyo'

it.afterEach(() => { delete process.env.MY_ENV });

it('returns an object', (t) => {
  t.is(typeof parse(``), 'object');
});

it('ignores keys at the root', (t) => {
  const env = parse(`ROOT_KEY="VALUE"`);

  t.is(env['ROOT_KEY'], undefined);
})

it('uses defaults when unspecified by the environment', (t) => {
  const env = parse(`
    [defaults]

    SOME_KEY="VALUE"
  `)

  t.is(env['SOME_KEY'], 'VALUE');
});

it('uses env.<env> if it matches the specified environment', (t) => {
  t.is(process.env.NODE_ENV, 'test')

  const env = parse(`
    [defaults]

    SOME_KEY="VALUE"

    [env.test]

    SOME_KEY="OTHER"
  `)

  t.is(env['SOME_KEY'], 'OTHER');
});

it('supports string interpolation', (t) => {
  process.env.MY_ENV = "staging"

  const env = parse(`
    [options]
    env_key="MY_ENV"

    [defaults]

    DATABASE_URL="postgres://\${USERNAME}:\${PASSWORD}@endpoint"
    SOME_VAR="\${MY_ENV}"

    [env.staging]

    USERNAME="foo"
    PASSWORD="bar"
  `)

  t.is(env['DATABASE_URL'], "postgres://foo:bar@endpoint");
  t.is(env['SOME_VAR'], "staging");
})

it('detects circular interpolations', (t) => {
  const error = t.throws(() => {
    parse(`
      [defaults]
      KEY_A="\${KEY_B}"
      KEY_B="\${KEY_A}"
    `)
  }, { instanceOf: Error })

  t.is(error.message, 'Circular interpolation detected KEY_B -> KEY_A -> KEY_B')
})


