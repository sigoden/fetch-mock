# 集成 mock 到 fetch 

## 开始使用

- 安装

```
npm i @sigodenjs/fetch-embeded-mock
```

- 编写 mock

新建 mock 文件 `./mock/api.js`

```js
import mockjs from 'mockjs';

export default {
  // 直接返回数据
  'GET /api/message': { message: "hello" },
  // 使用 mockjs 生成数据
  'PUT /api/name': mockjs.mock({ name: '@name' }),
  // 使用 express handler 
  'POST /api/model/:id':  (req, res) => {
    res.send({ id: req.params.id })
  }
};
```

- 引入

```js
import setupMock, { load } from "@sigodnejs/fetch-mock"

const mocks = load("./mock"); # 从 mock 目录加载所有 mock
setupMock(mocks);
```

- 结果

```js
const res = await fetch("/api/message")
console.log(await res.json()) // { message: "hello"}
```
