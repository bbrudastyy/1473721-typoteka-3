'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../httpCode`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, route);

  // GET /api/articles/:articleId -  возвращает полную информацию о публикации;
  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  // POST /api/articles — создаёт новую публикацию;
  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });
};
