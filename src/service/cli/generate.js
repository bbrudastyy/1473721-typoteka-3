'use strict';

const {getRandomInt, shuffle, writeFileJson, getDataFromFile} = require(`../../utils`);
const {MAX_ID_LENGTH, MAX_COMMENTS} = require(`../../constants`);
const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);

const DEFAULT_COUNT_OFFERS = 1;
const MAX_COUNT = 1000;

const FILE_NAME = `mocks.json`;
const FILE_ANNOUNCE_PATH = `./data/announce.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;


const getDate = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  return getRandomInt(endDate.getTime(), startDate.getTime());
};

const generateDate = () => new Date(getDate());
const generateDescription = (texts) => shuffle(texts).slice(1, 5).join(` `);
const generateText = (texts) => texts[getRandomInt(0, texts.length - 1)];
const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, announces, categories, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: generateText(titles),
    createdDate: generateDate(),
    announce: generateDescription(announces),
    fullText: generateDescription(announces),
    category: generateText(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT_OFFERS;
    if (countOffer < MAX_COUNT) {
      const titlesPromise = getDataFromFile(FILE_TITLES_PATH);
      const announcesPromise = getDataFromFile(FILE_ANNOUNCE_PATH);
      const categoriesPromise = getDataFromFile(FILE_CATEGORIES_PATH);
      const commentsPromise = getDataFromFile(FILE_COMMENTS_PATH);
      const [titles, announces, categories, comments] = await Promise.all([titlesPromise, announcesPromise, categoriesPromise, commentsPromise]);
      await writeFileJson(FILE_NAME, generateArticles(countOffer, titles, announces, categories, comments));
    } else {
      console.info(chalk.red(`Не больше 1000 объявлений`));
    }
  }
};
