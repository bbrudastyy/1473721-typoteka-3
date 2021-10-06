'use strict';

const {Router} = require(`express`);
const categories = require(`./categories/categories`);
const search = require(`./search/search`);
const articles = require(`./articles/articles`);

const CategoriesService = require(`./categories/services/categories`);
const SearchService = require(`./search/services/search`);
const ArticleService = require(`./articles/services/article`);
const CommentService = require(`./comments/services/comments`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoriesService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new ArticleService(mockData), new CommentService(mockData));
})();

module.exports = app;
