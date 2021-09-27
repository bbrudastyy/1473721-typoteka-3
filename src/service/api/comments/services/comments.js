'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../../../constants`);

class CommentsService {
  constructor(articles) {
    this._articles = articles;
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
    // const article = this._articles((item) => item.id === articleId);
    // const commentIdx = this.findAll(articleId).indexOf(comment);
    // this._articles.find((item) => item.id === articleId).comments.slice(commentIdx, 1);
    // const commentIdx = this._articles.find((item) => item.id === articleId).find((item) => item.id)
    this.findAll(articleId).filter((item) => item.id !== commentId);
    console.log(this._articles);

    // this._articles = this._articles.filter((item) => item.id !== commentId);

    return comment;
    // console.log()

    // return article.find((item) => item.id === commentId);
    // this._articles = this._articles.filter((item) => item.id !== commentId);
    // return article;
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

