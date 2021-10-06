'use strict';

const {Router} = require(`express`);
const HttpCode = require(`../../../httpCode`);
const articleValidator = require(`../../middlewares/article-validator`);
const articleExist = require(`../../middlewares/article-exists`);
const commentValidator = require(`../../middlewares/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();


  app.use(`/articles`, route);

  // GET /api/articles — ресурс возвращает список публикаций;
  route.get(`/`, async (req, res) => {
    const result = await articleService.findAll();

    if (!result) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found offers`);
    }

    return res.status(HttpCode.OK).json(result);
  });

  // GET /api/articles/:articleId -  возвращает полную информацию о публикации;
  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  // POST /api/articles — создаёт новую публикацию;
  route.post(`/`, articleValidator, (req, res) => {
    const offer = articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  // PUT /api/articles/:articleId — редактирует определённую публикацию;
  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const update = articleService.update(articleId, req.body);

    if (!update) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }
    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  // DELETE /api/articles/:articleId — удаляет определённую публикацию;
  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;

    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .json(article);
    }

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });

  // GET /api/articles/:articleId/comments — возвращает список комментариев определённой публикации;
  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;

    const comments = await commentService.findAll(articleId);

    if (!comments) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comments not found`);
    }

    return res.status(HttpCode.OK)
      .json(comments);
  });

  // DELETE /api/articles/:articleId/comments/:commentId — удаляет из определённой публикации комментарий с идентификатором;
  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {articleId, commentId} = req.params;
    const comment = await commentService.findOne(articleId, commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comment not found`);
    }

    const deletedComment = await commentService.drop(articleId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);

  });

  // POST /api/articles/:articleId/comments — создаёт новый комментарий;
  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
