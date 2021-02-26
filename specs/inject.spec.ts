import it         from 'ava'
import { join }   from 'path'
import { inject } from '../lib/kankyo';

it.afterEach(() => {
  delete process.env.MY_ENV;
  delete process.env.USERNAME;
  delete process.env.PASSWORD;
  delete process.env.DATABASE_URL;
});

it('loads the toml file and injects it into the current environment', (t) => {
  process.env.MY_ENV = 'staging'

  t.is(process.env['USERNAME'], undefined)
  t.is(process.env['PASSWORD'], undefined)
  t.is(process.env['DATABASE_URL'], undefined)

  inject(join(__dirname, 'environment.toml'))

  t.is(process.env['USERNAME'], "foo")
  t.is(process.env['PASSWORD'], "bar")
  t.is(process.env['DATABASE_URL'], "postgres://foo:bar@localhost")
});
