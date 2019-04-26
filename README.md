# vue ssr 实例项目

本项目采用`express`+`vue`+`webpack`，为前后同构应用模板项目。具体业务代码需根据实际情况修改。

### script

```
  dev 本地调试模式

  start:test 测试环境启动

  start:prod 正式环境启动

  build:test 测试服打包

  build:prod 正式服打包
```

### 环境

> VUE_ENV

- client 客户端执行环境
- server 服务端执行环境

> NODE_ENV

- development 本地调试模式
- test 测试服环境
- production 正式服环境

### config

类似于 config.js，由于 fs 读取配置无法在浏览器实现。配置方式，环境变量对应文件于 default 合并，环境变量配置优先。分类 development 开发模式、test 测试服环境、production 正式服环境

> port

启动端口

> root

dom 挂载点

> title

默认网页标题

> metas

默认网站 meta，example: `{ keywords: '这是一个网站' }`

> tempaltePath

html 模板文件路径

> server

请求服务端 host

> open

dev 模式时，是否自动启动浏览器

> host

dev 模式时，域名配置

> proxy

dev 模式时，请求代理配置

### service

异步请求需隔离，依赖使用 utils/request.js

example:

```
// 声明文件servcies/fiction.js
import request from '@/utils/request';

export const searchBookService = params =>
  request('/api/search/:keyword', { params });

export const fetchBookService = params => request('/api/open/:id', { params });

export const fetchChapterService = (query, params) =>
  request('/api/article/:index', { query, params });

```

共享复用数据尽量在 store 内完成业务逻辑

```
// 声明文件store/modules/fiction.js
import {
  searchBookService,
} from '@/services/fiction.js';

export default {
  name: 'fiction',

  namespaced: true,

  actions: {
    async loadListData({ commit }, params) {
      let data = await searchBookService(params);
      commit('SET_LIST_DATA', data);
    }
  }
  ...
}
```

### 权限

在 render 前需校验用户信息，具体可根据业务请求修改。

```
async function checkUserLogin(req, res, next) {
  const { uid, token } = req.cookies;

  // if request do not have uid and token as cookie
  if (!uid || !token) {
    next();
    return;
  }
  // 校验用户信息
  const checkUserApi = `${config.server}/api/user/checktoken`;
  const response = await request(checkUserApi);

  if (response.code === 200 && response.msg.checked === 1) {
    req.user = { userInfo: response.msg.userInfo, token };
  } else {
    res.clearCookie('uid');
    res.clearCookie('token');
  }
  next();
}

module.exports = checkUserLogin;
```

### 重定向

在 asyncData 通过`ctx.redirect(path)`实现重定向。

```
export default {
  asyncData({store, ctx}) {
    if (!store.state.user.login) {
      ctx.redirect('/')
    }
  }
}
```

### 数据 module

异步和初始化注入模块，state 必须采用函数式形势。

```
// 声明
export default {
  state() {
    return {}
  }
}
```

异步模块的注册调用，无需手动注册/删除，将在created之前注入，在destoryed销毁

```
export default {
  storeModule: require('@/store/modules/ficiton')
}

// 若需不移除module，则声明destory，如下示例
export default {
  storeModule: { module: require('@/store/modules/ficiton'), destory: false}
}
```

state/getters 读取，若挂载异步 module，`this.state`则对应异步模块中`state`，否则`this.state`指向`this.$store.state`。getter 同理

模板示例
```
<template>
  <div>{{ state.userInfo }}</div>
</template>
```

### title
组件内声明`title：string | function`
```
export default {
  title: '主页',
  // or
  title: () => {
    return this.$store.state.title
  }
}
```

### meta
组件内声明`meta: object | function`

```
export default {
  meta: {
    keywords: '我的'
  }
  // or
  meta: () => {
    return this.$store.state.meta
  }
}
```

