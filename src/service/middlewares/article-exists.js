'use strict';

const HttpCode = require(`../../httpCode`);

module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const article = service.findOne(articleId);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${articleId} not found`);
  }

  res.locals.offer = article;
  return next();
};
