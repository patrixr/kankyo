import program                from 'commander'
import fs                     from 'fs'
import path                   from 'path'
import logger                 from '../lib/logger'
import { lookupKankyoFile }   from '../lib/utils'
import { spawnSync }          from 'child_process'
import { load }               from '../lib/kankyo'

logger.enable();

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
  .option('-f --file <file>', 'Specify the environment file')
  .version(process.version)

program
  .command('init')
  .action(() => {
    const existing = lookupKankyoFile();

    if (existing) return logger.info('No file was created');

    fs.copyFileSync(
      path.join(__dirname, '../samples', '.kankyo.toml'),
      path.join(process.cwd(), '.kankyo.toml')
    );

    logger.info('Created .kankyo.toml')
  })

program
  .command('exec')
  .action(() => {
    const { quiet, file } = program.opts();

    if (quiet) logger.disable();

    const env = file ? load(file) : load();

    const [cmd, ...args] = parseCommand(process.argv);
    
    spawnSync(cmd, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...env
      }
    })
  })

program.parse(process.argv);
