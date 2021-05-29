'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const path = require(`path`);
const articlesRouter = require(`./routes/articles-routes`);
const mainRouter = require(`./routes/main-routes`);
const myRouter = require(`./routes/my-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, mainRouter);
app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT, (err) => {
  if (err) {
    return console.error(`Произошла ошибка, ${err}`);
  }
  return console.info(chalk.green(`Ошидаю соединений на ${DEFAULT_PORT}`));
});
