'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../../../constants`);

class CommentsService {
  constructor(articles) {
    this._articles = articles;
    // console.error(this._articles);
  }

  create(articleId, comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);
    this.findAll(articleId).push(newComment);
    return newComment;
  }

  drop(articleId, commentId) {
    const comment = this.findOne(articleId, commentId);

    if (!comment) {
      return null;
    }

    const article = this._articles.find((item) => item.id === articleId);
    article.comments = (article.comments || []).filter((item) => item.id !== commentId);

    return comment;
  }

  findAll(articleId) {
    const article = this._articles.find((item) => item.id === articleId);
    const comments = article.comments;

    if (comments) {
      return comments;
    }

    return null;
  }

  findOne(articleId, commentId) {
    const comment = this.findAll(articleId).find((item) => item.id === commentId);

    if (comment) {
      return comment;
    }

    return null;
  }
}

module.exports = CommentsService;

