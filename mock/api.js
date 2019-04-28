import mockjs from 'mockjs';

export default {
  'GET /api/message': { message: "hello" },
  'PUT /api/name': mockjs.mock({ name: '@name' }),
  'POST /api/model/:id': (req, res) => {
    res.send({ id: req.params.id })
  }
};
