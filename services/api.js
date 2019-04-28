import request from "../request";

export async function queryMessage()  {
  request("/api/message");
}

export async function queryModels() {
  request("/api/models");
}

export async function createName()  {
  request("/api/name", {
    method: "post"
  });
}

export async function updateModel(id)  {
  request(`/api/model/${id}`, {
    put: "post"
  });
}
