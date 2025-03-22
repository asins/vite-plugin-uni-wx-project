import path from 'node:path';
import fs from 'node:fs';
import { Plugin } from 'vite';
import {
  BlockLang,
  ProjectMini,
  ProjectOptions,
  ProjectPrivateConfig,
} from './types';
import {
  parseCustomBlock,
  parseJSON,
  readFileSync,
  transformCode,
  writeFileSync,
} from './tool';

const OUTPUT_NAME = 'project.private.config.json';

/**
 * 提取.vue文件中<project-private></project-private>标签内的内容，只支持JSON5格式
 * project-private内容格式：{ project: ProjectMiniprogram | ProjectMiniprogram[] }
 */
export function VitePluginUniProject(
  userOptions = {} as ProjectOptions
): Plugin {
  let isBuild: boolean = false;

  const projectPath = process.env.VITE_ROOT_DIR || process.cwd();
  const projectConfigPath = path.join(
    projectPath,
    userOptions.dir ?? 'src',
    OUTPUT_NAME
  );
  if (!fs.existsSync(projectConfigPath)) {
    const projectConfigRelativePath = path.relative(
      projectConfigPath,
      projectPath
    );
    console.error(`${projectConfigRelativePath} 文件不存在，无法更新！`);
  }
  const projectPrivateConfig = parseJSON<ProjectPrivateConfig>(
    readFileSync(projectConfigPath)
  );
  if (projectPrivateConfig) {
    projectPrivateConfig.condition.miniprogram.list = [];
  } else {
    console.error('解析 project.private.config.json 失败');
  }

  return {
    name: 'WeixinProjectPrivate',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (
        isBuild ||
        !projectPrivateConfig ||
        !/\.n?vue$/.test(id) ||
        !code.includes('</project-private>')
      )
        return null;

      const pathName = path
        .relative(path.join(projectPath, 'src'), id)
        .replace(/\.n?vue$/, '');
      // console.log('WeixinProjectPrivate transform=', pathName)

      const { content, list, hasChanged } = transformCode(
        code,
        pathName,
        userOptions
      );
      const { miniprogram } = projectPrivateConfig.condition;
      miniprogram.list = miniprogram.list
        .filter((item) => item.pathName !== pathName) // 删除此文件的旧内容
        .concat(list);

      if (hasChanged) {
        return { code: content };
      }
    },

    buildEnd() {
      if (isBuild || !projectPrivateConfig) return;

      const { miniprogram } = projectPrivateConfig.condition;
      miniprogram.list = miniprogram.list.sort((a, b) =>
        a.pathName.localeCompare(b.pathName)
      );
      writeFileSync(
        projectConfigPath,
        JSON.stringify(projectPrivateConfig, null, 2)
      );
      isBuild = true;
    },
  };
}

export default VitePluginUniProject;
