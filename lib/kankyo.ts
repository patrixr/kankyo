import toml                                   from 'toml'
import fs                                     from 'fs'
import { info }                               from './logger'
import { isTypedArray, variableExistsIn }     from './validation'
import {
  detectFile,
  interpolate,
  mapValues,
  uppercase
} from './utils';

// -----------------------------
// Types
// -----------------------------

export interface KankyoEnvironment {
  [key: string]: any
}

interface KankyoEnvironmentDict {
  [key: string]: KankyoEnvironment
}

interface KankyoOptions {
  env_key:      string
  uppercase:    boolean
  required:     string[]
}

interface KankyoFile extends KankyoEnvironment {
  options:  KankyoOptions
  defaults: KankyoEnvironment
  env:      KankyoEnvironmentDict
}

// -----------------------------
// Defaults
// -----------------------------

const DEFAULT_OPTIONS = {
  env_key:      "NODE_ENV",
  uppercase:    true,
  required:     []
} as KankyoOptions


// -----------------------------
// Helpers
// -----------------------------

/**
 * Returns the environemnts configured in the file
 *
 * @export
 * @param {KankyoFile} config
 * @returns {KankyoEnvironment}
 */
function findEnvironment(config: KankyoFile) : KankyoEnvironment {
  const env = process.env[config.options.env_key]

  if (!env) {
    return {};
  }

  const rex = new RegExp(`^${env}$`, 'i')
  const key = Object.keys(config.env).find(k => rex.test(k));

  if (!key || typeof config.env[key] !== 'object') {
    return {};
  }

  info(`Loading env.${key.toLowerCase()}`)

  return config.env[key]
}

/**
 *
 *
 * @export
 * @param {KankyoFile} config
 * @returns {KankyoFile}
 */
function normalizeFile(config: KankyoFile) : KankyoFile {
  const options = { ...DEFAULT_OPTIONS, ...(config.options || {}) } as KankyoOptions

  if (!isTypedArray(options.required, "string")) {
    throw new Error(`options.required expects an array of strings`)
  }

  if (options.uppercase) {
    options.required = options.required.map(s => s.toUpperCase())
  }

  config.options  = options;
  config.defaults = config.defaults || {};
  config.env      = config.env || {};

  if (options.uppercase) {
    config.defaults = uppercase(config.defaults);
    config.env = mapValues(config.env, uppercase);
  }

  return config;
}

/**
 * If any key exists in process.env, use that as priority
 *
 * @export
 * @param {KankyoEnvironment} env
 * @returns {KankyoEnvironment}
 */
function applyOverrides(env: KankyoEnvironment) : KankyoEnvironment {
  return mapValues(env, (v, k) => process.env[k] ? process.env[k] : v);
}

/**
 * Transforms every value into a string
 *
 * @export
 * @param {KankyoEnvironment} env
 * @returns {KankyoEnvironment}
 */
function serialize(env: KankyoEnvironment) : KankyoEnvironment {
  const strings = mapValues(env, (v) => {
    return (typeof v === 'string') ? v : JSON.stringify(v);
  })

  return mapValues(strings, (s) => interpolate(s, strings));
}

// -----------------------------
// API
// -----------------------------

export function parse(text : string) : KankyoEnvironment {
  const config    = normalizeFile(toml.parse(text));
  const defaults  = config.defaults || {}
  const selected  = findEnvironment(config);

  let env = applyOverrides(serialize({ ...defaults, ...selected }));

  // --- Verify required fields

  const missing = config.options.required.filter(field => {
    return !variableExistsIn(field, env, process.env);
  });

  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  }

  return env;
}

export function load(file : string = detectFile()) {
  info('Loading environment');
  const text = fs.readFileSync(file).toString();
  return parse(text);
}

export function inject(file : string = detectFile()) {
  const env = load(file);

  Object.keys(env).forEach(key => {
    process.env[key] = env[key]
  });
}
