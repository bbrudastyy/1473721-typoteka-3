'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentsService {
  constructor(articles) {
    this._articles = articles;
  }

  create(articleId, comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);
    this.findAll(articleId).push(newComment);
    return newComment;
  }

  drop(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return article;
  }
  findAll(articleId) {
    console.log(this._articles, articleId);
    console.log(this._articles.find((item) => item.id === articleId));
    return this._articles.find((item) => item.id === articleId).comments;
  }
}

module.exports = CommentsService;

