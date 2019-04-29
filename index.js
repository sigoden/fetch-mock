const pathToRegexp = require("path-to-regexp");
const urlParse = require("url-parse");
const routeParse = require("path-match")({
  sensitive: false,
  strict: false,
  end: false
});

const store = [];
global._fetch = global.fetch;

function setupMock(mocks) {
  for (let route in mocks) {
    const mockData = mocks[route];
    const rMathes = /^(GET|PUT|POST|DELETE) /i.exec(route);
    let method = "get";
    if (rMathes) {
      method = rMathes[0].toLowerCase().trim();
      route = route.slice(method.length).trim();
    }
    if (typeof mockData === "function") {
      addMock(method, route, async fetchOpts => {
        const res = createRes();
        await mockData(createReq(fetchOpts, route), res);
        return retriveRes(res);
      });
    } else {
      addMock(method, route, async () => ({ body: mockData }));
    }
  }
}

function createReq(fetchOpts, pattern) {
  const { params, query } = parseUrl(fetchOpts.url, pattern);
  return Object.assign({}, fetchOpts, {
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

function addMock(method, route, createRes) {
  store.push([createMatcher(method, route), createRes]);
}

function polyfill(f = global.fetch) {
  global._fetch = f;
  global.fetch = fetch;
}

async function fetch(url, opts = {}) {
  if (typeof url === "string") {
    opts.url = url;
  }
  const [isMock, mockData] = await lookupMock(opts);
  if (isMock) {
    const { status, body, headers } = mockData;
    return {
      status,
      body,
      headers,
      json: async () => {
        return body;
      },
      text: async () => {
        return JSON.stringify(body);
      }
    };
  }
  return global._fetch(opts);
}

async function lookupMock(fetchOpts) {
  for (let item of store) {
    const [match, createRes] = item;
    if (match(fetchOpts)) {
      return [true, await createRes(fetchOpts)];
    }
  }
  return [false, null];
}

function createMatcher(method, route) {
  let matchRoute = target => route === target;
  if (/\/:/.test(route)) {
    matchRoute = target => pathToRegexp(route).test(target);
  }
  return fetchOpts => {
    const fetchMethod = fetchOpts.method || "get";
    if (fetchMethod !== method) {
      return false;
    }
    if (!matchRoute(fetchOpts.url)) {
      return false;
    }
    return true;
  };
}

function parseUrl(url, pattern) {
  const urlObj = urlParse(url, true);
  const { pathname, query } = urlObj;
  const params = routeParse(pattern)(pathname);
  return { params, query };
}

exports.polyfill = polyfill;
exports.setupMock = exports.default = setupMock;
