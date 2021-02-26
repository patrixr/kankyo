import it         from 'ava'
import { parse }  from '../lib/kankyo'

it.afterEach(() => { delete process.env.MY_ENV });

it('uppercases keys by default', (t) => {
  const env = parse(`
    [defaults]
    some_key="VALUE"
  `)

  t.is(env['SOME_KEY'], 'VALUE');
});

it('disables uppercasing with uppercase:false', (t) => {
  const env = parse(`
    [options]
    uppercase=false

    [defaults]
    some_key="VALUE"
  `)

  t.is(env['some_key'], 'VALUE');
  t.is(env['SOME_KEY'], undefined);
});

it('uses NODE_ENV as the environment specifier by default', (t) => {
  t.is(process.env.NODE_ENV, 'test');

  const env = parse(`
    [defaults]

    SOME_KEY="VALUE"

    [env.test]

    SOME_KEY="OTHER"
  `)

  t.is(env['SOME_KEY'], 'OTHER');
})

it('can specify the environment variable using env_var=<string>', (t) => {
  process.env.MY_ENV = "SPECIAL"

  t.is(process.env.NODE_ENV, 'test');

  const env = parse(`
    [options]
    env_key="MY_ENV"

    [defaults]

    SOME_KEY="VALUE"

    [env.special]

    SOME_KEY="OTHER"
  `)

  t.is(env['SOME_KEY'], 'OTHER');
})
