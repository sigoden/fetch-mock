async function queryMessage() {
  return request("/api/message");
}

async function createName() {
  return request("/api/name", {
    method: "post"
  });
}

async function updateModel(id) {
  return request(`/api/model/${id}`, {
    method: "post"
  });
}
async function request(url, opts = {}) {
  const res = await fetch(url, opts);
  return res.json();
}

module.exports = {
  queryMessage,
  createName,
  updateModel
};
