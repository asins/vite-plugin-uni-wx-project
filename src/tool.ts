import fs from 'node:fs';
import { parse as JSON5Parser } from 'json5';
import { parse as YAMLParser } from 'yaml';
import {
  BlockLang,
  ProjectMini,
  ProjectOptions,
  TransformCodeResult,
} from './types';

const routeRegex = /<project-private([^>]*)>([\s\S]*?)<\/project-private>/g;

export function writeFileSync(path: string, content: string) {
  fs.writeFileSync(path, content, { encoding: 'utf-8' });
}

export function readFileSync(path: string) {
  try {
    return fs.readFileSync(path, { encoding: 'utf-8' });
  } catch {
    return '';
  }
}

export function parseCustomBlock<T>(
  lang: BlockLang,
  content: string
): T | null {
  let data: T | null = null;
  if (lang === 'json5') {
    data = parseJSON5<T>(content);
  } else if (lang === 'json') {
    data = parseJSON<T>(content);
  } else if (lang === 'yaml' || lang === 'yml') {
    data = parseYaml<T>(content);
  }

  return data;
}

function parseJSON5<T = object>(str: string): T | null {
  try {
    return JSON5Parser(str) as T;
  } catch (err: any) {
    throw new Error(`Invalid JSON5 parse ${err.message}`);
  }
}

export function parseJSON<T = object>(str: string): T | null {
  try {
    return JSON5Parser(str) as T;
  } catch (err: any) {
    throw new Error(`Invalid JSON parse ${err.message}`);
  }
}

function parseYaml<T = object>(str: string): T | null {
  try {
    return YAMLParser(str) as T;
  } catch (err: any) {
    throw new Error(`Invalid YAML parse ${err.message}`);
  }
}

export function transformCode(
  code: string,
  pathName: string,
  option: ProjectOptions
): TransformCodeResult {
  let hasChanged = false;
  const list: ProjectMini[] = [];

  const content = code.replace(routeRegex, ($0, $1, $2) => {
    const langExec = /\slang=("|')(\w+)\1/g.exec($1);
    const lang = (
      (langExec && langExec[2]) ||
      option.lang ||
      'json5'
    ).trim() as BlockLang;
    const route = parseCustomBlock<ProjectMini[]>(lang, $2.trim());

    if (route) {
      hasChanged = true;
      const projects = Array.isArray(route) ? route : [route];
      projects.forEach((project) => {
        list.push({
          query: '',
          launchMode: 'default',
          scene: null,
          name: pathName.replace(/\//g, '_'),
          ...project,
          pathName,
        });
      });
    }

    return '';
  });

  return {
    hasChanged,
    content,
    list,
  };
}
