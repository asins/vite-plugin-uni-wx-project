export interface ProjectMini {
  name?: string;
  /** 页面路径 */
  pathName: string;
  /** 页面启动时的参数 示例：id=123 */
  query?: string;
  /** 页面启动模式 */
  launchMode?: 'default';
  /** 场景值，用于指定小程序的启动场景。 示例：1001 表示通过小程序列表进入 */
  scene?: null;
}

export interface ProjectPrivateConfig {
  projectname: string;
  description: string;
  /** 项目设置 */
  setting?: {
    compileHotReLoad: boolean;
  };
  /** 配置调试条件 */
  condition: {
    /** 普通小程序项目 */
    miniprogram: {
      list: ProjectMini[];
    };
  };
}

export type BlockLang = 'json5' | 'json' | 'yaml' | 'yml';
export interface ProjectOptions {
  /** `project.private.config.json` 文件所在目录 */
  dir: string;
  /** `project-private` 标签中数据类型 */
  lang?: BlockLang;
}

export interface TransformCodeResult {
  hasChanged: boolean;
  content: string;
  list: ProjectMini[];
}
