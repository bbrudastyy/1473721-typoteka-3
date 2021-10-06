'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  async findAll(searchText) {
    const resultResponse = [];
    if (searchText === ``) {
      this._articles.forEach((item) => resultResponse.push(item));
      return resultResponse;
    }
    const result = this._articles.map((article) => article.title.includes(searchText));

    result.forEach((item, idx) => {
      if (item === true) {
        resultResponse.push(this._articles[idx]);
      }
    });

    return resultResponse;
  }
}

module.exports = SearchService;
