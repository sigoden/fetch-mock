const mock = require("../index");
const fetch = require("node-fetch");
const mocks = require("./fixtures/mock");
const api = require("./fixtures/api");

beforeAll(() => {
  mock(mocks, fetch);
});

test("mock plain object", async () => {
  const data = await api.queryMessage();
  expect(data).toEqual({ message: "hello" });
});

test("mock mockjs object", async () => {
  const data = await api.createName();
  expect(data.name).toBeDefined();
});

test("mock handler", async () => {
  const data = await api.updateModel(1);
  expect(data).toEqual({ id: "1" });
});
