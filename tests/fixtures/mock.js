const mockjs = require("mockjs");

module.exports = {
  "get /api/message": { message: "hello" },
  "put /api/name": mockjs.mock({ name: "@name" }),
  "post /api/model/:id": (req, res) => {
    res.send({ id: req.params.id });
  }
};
