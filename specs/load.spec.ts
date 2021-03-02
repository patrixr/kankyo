import it       from 'ava'
import { join } from 'path'
import { load } from '../lib/kankyo';

it.afterEach(() => { delete process.env.MY_ENV });

it('loads the toml file and parses it', (t) => {
  process.env.MY_ENV = 'staging'

  const env = load(join(__dirname, 'environment.toml'))

  t.is(env['USERNAME'], "foo")
  t.is(env['PASSWORD'], "bar")
  t.is(env['DATABASE_URL'], "postgres://foo:bar@localhost")
});

it('supports an environment override param', (t) => {
  const env = load({
    file: join(__dirname, 'environment.toml'),
    env: 'production'
  })

  t.is(env['USERNAME'], "produser")
});
