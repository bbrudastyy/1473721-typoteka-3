'use strict';

const {Router} = require(`express`);
const HttpCode = require(`../../httpCode`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/search`, route);

  // GET /api/search?query= — возвращает результаты поиска.
  // Поиск объявлений выполняется по наименованию. Объявление соответствует поиску в случае наличия хотя бы одного вхождения искомой фразы.
  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    const searchResults = await service.findAll(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);
  });
};
