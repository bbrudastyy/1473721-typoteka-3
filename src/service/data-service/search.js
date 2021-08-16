'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  async findAll(searchText) {
    return this._articles.map((article) => article.title.includes(searchText));
  }
}

module.exports = SearchService;
