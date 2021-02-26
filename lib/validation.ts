import { env } from 'process';
import { KankyoEnvironment } from './kankyo'

export function isTypedArray<T>(obj : unknown, type : string) : obj is T[] {
  return Array.isArray(obj) && obj.every(it => typeof it === type);
}

export function variableExistsIn(name: string, ...envs: KankyoEnvironment[]) : boolean {
  return envs.findIndex(env => {
    return typeof env[name] === "string" && env[name].length > 0;
  }) >= 0;
}
