# Vite-plugin-uni-wx-project

基于 uni-app 项目文件系统的微信小程序`project.private.config.json`文件生成插件。

## 安装

```bash
pnpm install -D vite-plugin-uni-wx-project
```


## 使用

> 注意：此插件只在 vite 启动时执行一次，所以如果有更新需重启vite。

```ts
import { defineConfig } from 'vite'
import UniWxProject from 'vite-plugin-uni-wx-project'

export default defineConfig(() => {
  return {
    plugins: [
      UniWxProject({ dir: './src' })
    ]
  }
})
```

```vue
// src/pages/login/index.vue
<project-private>
{
  name: '登录',
}
</project-private>

<template>
<view class="login_wx">
  微信登录
</view>
</template>
```

插件会分析项目中所有`.vue`文件中的`<project-private></project-private>`标签数据，然后更新微信小程序开发工具需要的`./src/project.private.config.json`文件。

```json
{
  "condition": {
    "miniprogram": {
      "list": [
        { "name": "登录",
          "pathName": "pages/login/index",
          "query": "",
          "launchMode": "default",
          "scene": null
        }
      ]
    }
  }
}

```

UniWxProject 方法的入参

- `dir`: `project.private.config.json`文件所在目录。构建后只更新文件中`condition.miniprogram.list`的内容。
- `lang`: project-private 中数据类型，'json5' | 'json' | 'yaml' | 'yml'


## project-private 格式

`project-private`标签内字段：

```ts
interface ProjectMini {
  name?: string
  /** 页面路径 */
  pathName: string
  /** 页面启动时的参数 示例：id=123 */
  query?: string,
  /** 页面启动模式 */
  launchMode?: 'default',
  /** 场景值，用于指定小程序的启动场景。 示例：1001 表示通过小程序列表进入 */
  scene?: null
}
```


支持单数据 `ProjectMini`
```vue
<project-private lang="json5">
{
  name: '登录-微信登录',
}
</project-private>
```

也支持同时设置多个 `ProjectMini[]` 数据
```vue
<project-private>
[
  {
    name: '登录后回跳首页',
    query: 'form_url=/pages/index',
  },
  {
    name: '登录后回跳设置页',
    query: 'form_url=/pages/settingkkk',
  }
]
</project-private>
```
