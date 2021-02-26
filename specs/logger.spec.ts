import it       from 'ava'
import logger   from "../lib/logger"

it.afterEach(() => logger.disable());

it('does not remove user-set debuggers from the environment', (t) => {
  process.env.DEBUG = "some:app";

  logger.enable();

  t.is(process.env.DEBUG, 'some:app,kankyo:*');
});

it('disables itself without modifying user-set debuggers', (t) => {
  process.env.DEBUG = "some:app,kankyo:*";

  logger.disable();

  t.is(process.env.DEBUG, 'some:app');
});
