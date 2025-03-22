import { describe, it, expect } from 'vitest';
import { parseCustomBlock, transformCode } from '@/tool';
import { ProjectOptions } from '@/types';

const dataOneJson5 = `
  {
    name: '我的', // Home首页
    query: 'age=24&name=asins'
  }
`;
const dataMoreJson5 = `[
  {
    name: '我的', // Home首页
    query: 'age=24&name=asins'
  },
  {
    name: '帮助',
    query: 'id=24'
  },
]`;
const dataOneYaml = `name: '我的'\nquery: 'age=24&name=asins'`;
const dataMoreYaml = `- name: 我的\n  query: 'age=24&name=asins'\n- name: 帮助\n  query: 'id=24'`;
const dataOneJson = JSON.stringify({
  name: '我的',
  query: 'age=24&name=asins',
});
const dataMoreJson = JSON.stringify([
  { name: '我的', query: 'age=24&name=asins' },
  { name: '帮助', query: 'id=24' },
]);
const templateStr = `<template>\n  Home\n</template>`;
const pathName = 'pages/home/index';
const resultOneData = [
  {
    query: 'age=24&name=asins',
    launchMode: 'default',
    scene: null,
    name: '我的',
    pathName,
  },
];
const resultMoreData = [
  {
    query: 'age=24&name=asins',
    launchMode: 'default',
    scene: null,
    name: '我的',
    pathName,
  },
  {
    query: 'id=24',
    launchMode: 'default',
    scene: null,
    name: '帮助',
    pathName,
  },
];

describe('tool.ts 测试', () => {
  it('parseCustomBlock json5', () => {
    const str = `{
      style: {
        name: 'Asins',
        age: 'auto', // ages
        // navigationStyle: 'custom'
        bool: false,
      },
    }`;
    const parseData = parseCustomBlock('json5', str);

    expect(parseData).toEqual({
      style: {
        name: 'Asins',
        age: 'auto',
        bool: false,
      },
    });
  });

  it('parseCustomBlock json', () => {
    const str = `{
      "style": {
        "name": "Asins",
        "bool": false
      }
    }`;
    const parseData = parseCustomBlock('json', str);

    expect(parseData).toEqual({
      style: {
        name: 'Asins',
        bool: false,
      },
    });
  });

  it('parseCustomBlock yml', () => {
    const str = `
    style:
      name: Asins
      bool: false
    `;
    const parseData = parseCustomBlock('yml', str);

    expect(parseData).toEqual({
      style: {
        name: 'Asins',
        bool: false,
      },
    });
  });

  it('parseCustomBlock yaml', () => {
    const str = `
    style:
      name: Asins
      bool: false
    `;
    const parseData = parseCustomBlock('yaml', str);

    expect(parseData).toEqual({
      style: {
        name: 'Asins',
        bool: false,
      },
    });
  });
});

describe('.vue format json5格式的配置', () => {
  it('transformCode, 未指定 lang（采用默认的json5格式解析）', () => {
    const vueFileStr = `<project-private>\n${dataOneJson5}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {} as ProjectOptions);

    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultOneData,
    };

    expect(data).toEqual(result);
  });

  it('transformCode, 在<project-private>标签中指定 lang=json5', () => {
    const vueFileStr = `<project-private lang="json5">\n${dataOneJson5}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {} as ProjectOptions);
    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultOneData,
    };
    expect(data).toEqual(result);
  });

  it('transformCode, 使用插件时指定 lang=json5', () => {
    const vueFileStr = `<project-private>\n${dataOneJson5}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {
      lang: 'json5',
    } as ProjectOptions);

    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultOneData,
    };

    expect(data).toEqual(result);
  });

  it('transformCode, json5格式生成多个配置', () => {
    const vueFileStr = `<project-private lang="json5">\n${dataMoreJson5}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {} as ProjectOptions);
    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultMoreData,
    };
    expect(data).toEqual(result);
  });

  it('transformCode, json5解析出错', () => {
    const vueFileStr = `<project-private>\n${dataOneJson5}_error\n</project-private>\n\n${templateStr}`;
    expect(() =>
      transformCode(vueFileStr, pathName, {
        lang: 'json5',
      } as ProjectOptions)
    ).toThrowError(/^Invalid JSON5 parse/);
  });
});

describe('.vue format yaml格式的配置', () => {
  it('transformCode, 在<project-private>标签中指定 lang=yaml', () => {
    const vueFileStr = `<project-private lang="yaml">\n${dataOneYaml}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {} as ProjectOptions);
    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultOneData,
    };
    expect(data).toEqual(result);
  });

  it('transformCode, 在<project-private>标签中指定 lang=yml', () => {
    const vueFileStr = `<project-private lang="yml">\n${dataOneYaml}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {} as ProjectOptions);
    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultOneData,
    };
    expect(data).toEqual(result);
  });

  it('transformCode, 使用插件时指定 lang=yaml', () => {
    const vueFileStr = `<project-private>\n${dataOneYaml}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {
      lang: 'yaml',
    } as ProjectOptions);

    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultOneData,
    };

    expect(data).toEqual(result);
  });

  it('transformCode, yaml格式生成多个配置', () => {
    const vueFileStr = `<project-private lang="yaml">\n${dataMoreYaml}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {} as ProjectOptions);
    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultMoreData,
    };
    expect(data).toEqual(result);
  });

  it('transformCode, yaml解析出错', () => {
    const vueFileStr = `<project-private>\n${dataOneYaml}_error\n</project-private>\n\n${templateStr}`;
    expect(() =>
      transformCode(vueFileStr, pathName, {
        lang: 'yaml',
      } as ProjectOptions)
    ).toThrowError(/^Invalid YAML parse/);
  });
});

describe('.vue format json格式的配置', () => {
  it('transformCode, 在<project-private>标签中指定 lang=json', () => {
    const vueFileStr = `<project-private lang="json">\n${dataOneJson}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {} as ProjectOptions);
    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultOneData,
    };
    expect(data).toEqual(result);
  });

  it('transformCode, 使用插件时指定 lang=json', () => {
    const vueFileStr = `<project-private>\n${dataOneJson}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {
      lang: 'json',
    } as ProjectOptions);

    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultOneData,
    };

    expect(data).toEqual(result);
  });

  it('transformCode, json格式生成多个配置', () => {
    const vueFileStr = `<project-private lang="json">\n${dataMoreJson}\n</project-private>\n\n${templateStr}`;
    const data = transformCode(vueFileStr, pathName, {} as ProjectOptions);
    const result = {
      content: `\n\n${templateStr}`,
      hasChanged: true,
      list: resultMoreData,
    };
    expect(data).toEqual(result);
  });

  it('transformCode, json解析出错', () => {
    const vueFileStr = `<project-private>\n${dataOneJson}_error\n</project-private>\n\n${templateStr}`;
    expect(() =>
      transformCode(vueFileStr, pathName, {
        lang: 'json',
      } as ProjectOptions)
    ).toThrowError(/^Invalid JSON parse/);
  });
});
