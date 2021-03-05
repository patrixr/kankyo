#!/usr/bin/env node

import program                from 'commander'
import fs                     from 'fs'
import path                   from 'path'
import logger                 from '../lib/logger'
import { lookupKankyoFile }   from '../lib/utils'
import { spawnSync }          from 'child_process'
import { KankyoParams, load } from '../lib/kankyo'

logger.enable();

if (process.argv.length === 2) {
  process.argv.push('--help')
}

// -------------------
// Helpers
// -------------------

function parseCommand(argv: string[]) {
  let idx = argv.indexOf('--');
  idx = idx < 0 ? argv.length : idx;
  return argv.slice(idx + 1);
}

// -------------------
// CLI
// -------------------

program
  .option('-q --quiet', 'Quiet mode')
  .option('-e, --env <env>', 'Specify the environment manually')
  .option('-f --force', 'If set, will ignore schema/required fields mismatch')
  .option('-i, --input <file>', 'Specify the environment file')
  .version(process.version)

program.command('init').action(() => {
  const existing = lookupKankyoFile();

  if (existing) return logger.info('No file was created');

  fs.copyFileSync(
    path.join(__dirname, '../samples', '.kankyo.toml'),
    path.join(process.cwd(), '.kankyo.toml')
  );

  logger.info('Created .kankyo.toml')
})

program.command('exec').action(() => {
  try {
    const { quiet, force, input, env } = program.opts();

    if (quiet) logger.disable();

    const strings = load({ file: input, force: !!force, env });

    const [cmd, ...args] = parseCommand(process.argv);
    
    const spawn = spawnSync(cmd, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...strings
      }
    })

    const status = spawn.status || 0;

    if (spawn.error) console.log(spawn.error);
    process.exit(status);

  } catch (e) {
    logger.error(e.message);
    process.exit(1);
  }
})

program.parse(process.argv);
