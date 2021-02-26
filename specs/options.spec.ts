import it         from 'ava'
import { parse }  from '../lib/kankyo'

it.afterEach(() => { 
  delete process.env.MY_ENV
  delete process.env.KEY_B
});

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

it('raises an error if a variable marked as required is missing', (t) => {
  t.is(process.env["KEY_B"], void 0);
  
  const error = t.throws(() => {
    parse(`
      [options]

      required = ["KEY_B"]

      [defaults]
      
      KEY_A="foo"
    `)
  }, { instanceOf: Error })

  t.is(error.message, 'Missing environment variables: KEY_B')
})

it('suceeds if required variables are added to the file', (t) => {
  t.is(process.env["KEY_B"], void 0);
  
  t.notThrows(() => {
    parse(`
      [options]

      required = ["KEY_B"]

      [defaults]
      
      KEY_A="foo"
      KEY_B="bar"
    `)
  });
})

it('suceeds if required variables are in the existing environment', (t) => {
  process.env.KEY_B = "bar"
  
  t.notThrows(() => {
    parse(`
      [options]

      required = ["KEY_B"]

      [defaults]
      
      KEY_A="foo"
    `)
  });
})
