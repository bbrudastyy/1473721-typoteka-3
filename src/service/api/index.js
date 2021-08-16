'use strict';

const {Router} = require(`express`);
const categories = require(`./categories`);
const search = require(`./search`);
const articles = require(`./articles`);

const CategoriesService = require(`../data-service/categories`);
const SearchService = require(`../data-service/search`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comments`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoriesService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new ArticleService(mockData), new CommentService(mockData));
})();

module.exports = app;
