import * as fs              from 'fs'
import * as path            from 'path'
import { info }             from './logger'

interface Dict<T> {
  [key: string]: T
}

export function panic(err : string) : never {
  throw new Error(err);
}

export function mapValues<T, R>(dict: Dict<T>, converter: (val: T, key: string) => R) : Dict<R> {
  return Object.keys(dict).reduce((final, key) => {
    final[key] = converter(dict[key], key);
    return final;
  }, {} as Dict<R>)
}


/**
 * Transforms all the keys to uppercase keys
 *
 * @param {KankyoEnvironment} env
 * @returns {KankyoEnvironment}
 */
export function uppercase(env: Dict<string>) : Dict<string> {
  return Object.keys(env).reduce((final, key) => {
    final[key.toUpperCase()] = env[key];
    return final;
  }, {} as Dict<string>)
}

/**
 * Case insensitive object get
 *
 * @template T
 * @param {Dict<T>} object
 * @param {string} almostKey
 * @returns {(T|undefined)}
 */
function getValue<T>(object : Dict<T>, almostKey : string) : T|undefined {
  const key = Object.keys(object).find(k => k.toLowerCase() === almostKey.toLowerCase())
  return key ? object[key] : undefined
}

/**
 * Given a string and dictionnary, replaces all ${tokens} in the string with their values
 *
 * @param {string} str
 * @param {KankyoEnvironment} env
 * @returns {string}
 */
export function interpolate(str: string, env: Dict<string>, stack : string[] = []) : string {
  const rexp = /(?:\${)(.+?)}/g
  const keys = (str.match(rexp) || []).map(match => match.replace(/[\${}]/g, ''));

  return keys.reduce((s, k) => {
    if (stack.indexOf(k) >= 0) {
      panic(`Circular interpolation detected ${stack.join(' -> ')} -> ${k}`)
    }

    return s.replace('${' + k + '}', interpolate(getValue(env, k) || '', env, [...stack, k]));
  }, str);
}

export function lookupKankyoFile() : string|null {
  const possibilities = [
    '.kankyo.toml',
    '.environment.toml',
    '.env.toml',
    'kankyo.toml',
    'environment.toml',
    'env.toml',
  ];

  for (let file of possibilities) {
    const uri = path.join(process.cwd(), file);

    if (fs.existsSync(uri)) {
      info(`Kankyo environment file detected: ${file}`)
      return uri;
    }
  }

  return null;
}

export function detectFile() : string {
  const uri = lookupKankyoFile();

  if (!uri) {
    panic("Kankyo environment file not found.\nRun `npx kankyo init` to generate an env file");
  }

  return uri;
}
