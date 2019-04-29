const fetchMock = require("@sigodenjs/fetch-mock-base");
const urlParse = require("url-parse");

const routeParse = require("path-match")({
  sensitive: false,
  strict: false,
  end: false
});

exports.default = exports.setupMock;

exports.setupMock = function(mocks) {
  for (let route in mocks) {
    const mockData = mocks[route];
    const options = { method: "get" };
    const rMathes = /^(GET|PUT|POST|DELETE) /i.exec(route);
    let matcher = route;
    if (rMathes) {
      const method = rMathes[0].toLowerCase().trim();
      options.method = method;
      route = route.slice(method.length).trim();
      matcher = route;
    }
    if (/^\//.test(route)) {
      matcher = `express:${route}`;
    }
    if (typeof mockData === "function") {
      fetchMock.mock(matcher, (url, opts) => {
        return async () => {
          const res = createRes();
          await mockData(createReq(url, opts, route), res);
          return retriveRes(res);
        };
      });
    } else {
      fetchMock.mock(matcher, mockData);
    }
  }
};

function createReq(url, opts, pattern) {
  const { params, query } = parseUrl(url, pattern);
  return Object.assign({}, opts, {
    url,
    params,
    query
  });
}

function createRes() {
  const res = { statusCode: 200 };
  res.status = status => {
    res.statusCode = status;
  };
  res.send = data => {
    res.body = data;
  };
  res.json = res.send;
  return res;
}

function retriveRes(res) {
  return {
    status: res.statusCode,
    body: res.body,
    headers: res.headers
  };
}

function parseUrl(url, pattern) {
  const urlObj = urlParse(url, true);
  const { pathname, query } = urlObj;
  const params = routeParse(pattern)(pathname);
  return { params, query };
}
