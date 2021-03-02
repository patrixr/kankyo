import debug  from 'debug'

export const info     = debug(`kankyo:info`);
export const error    = debug(`kankyo:error`);
export const verbose  = debug(`kankyo:verbose`);

export function enable() {
  info.enabled = true;
  error.enabled = true;
  verbose.enabled = true;
}

export function disable() {
  info.enabled = false;
  error.enabled = false;
  verbose.enabled = false;
}

export default { info, error, verbose, enable, disable }
