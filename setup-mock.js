import { fetchMock } from "fetch-mock";

import mocks from './load-all-mocks';

for (let route in mocks) {
  const mockData = mocks[route];
  const options = { method: "get" };
  const rMathes = /^(GET|PUT|POST|DELETE) /.exec(route);
  let matcher = route;
  if (rMathes) {
    const method = rMathes[0].toLowerCase()
    options.method = method;
    route = route.slice(method.length + 1);
    matcher = route;
  }
  if (/^\//.test(route)) {
    matcher = `express:${route}`;
  }
  if (typeof mockData === "function") {
    fetchMock.mock(matcher, (url, opts) => {
      return new Promise((resolve, reject) => {

      });
    });
  } else {
    options.status = 200;
    options.body = mockData;
    fetchMock.mock(matcher, options);
  }
}
