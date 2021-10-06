'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const fs = require(`fs`).promises;
const HttpCode = require(`../../httpCode`);
const {getLogger} = require(`../lib/logger`);
const routes = require(`../api`);
const {API_PREFIX} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const logger = getLogger({name: `api`});

const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    app.listen(port, (err) => {
      if (err) {
        return logger.error(`Ошибка при создании сервера`, err);
      }

      return logger.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  }
};
