import debug  from 'debug'

export const info     = debug(`kankyo:info`);
export const error    = debug(`kankyo:error`);
export const verbose  = debug(`kankyo:verbose`);

function getEnabledTypes() {
  return (process.env.DEBUG || "").split(',').filter(type => !/kankyo/.test(type))
}

export function enable() {
  debug.enable([getEnabledTypes(), 'kankyo:*'].join(','));
}

export function disable() {
  debug.enable(getEnabledTypes().join(','));
}

export default { info, error, verbose, enable, disable }
