# 集成 mock 到 fetch 

## 开始使用

- 安装

```
npm i @sigodenjs/mock-fetch
```

- 编写 mock

新建 mock 文件 `./mocks.js`

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
import * as mock from "@sigodnejs/fetch-mock"
import mocks  from from "./mocks"

mock(mocks); // 注入 mock
```

- 结果

```js
const res = await fetch("/api/message")
console.log(await res.json()) // { message: "hello"}
```
