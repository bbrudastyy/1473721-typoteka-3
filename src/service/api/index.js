'use strict';

const {Router} = require(`express`);
const category = require(`./categories`);
const search = require(`./search`);
const articles = require(`./articles`);
const {CategoryService, SearchService, OfferService, CommentService} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new OfferService(mockData), new CommentService());
})();
