'use strict';

const express = require(`express`);
const request = require(`supertest`);

const articles = require(`./articles`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comments`);

const HttpCode = require(`../../httpCode`);

// const mockCategories = [
//   `Дереьвя`,
//   `Железо`,
//   `Музыка`,
//   `Кино`
// ];


const mockData = [{
  "id": `1TtuWX`,
  "title": `Учим HTML и CSS`,
  "createdDate": `2021-09-05T13:44:02.308Z`,
  "announce": `Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  "fullText": `Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  "category": `Деревья`,
  "comments": [{
    "id": `HTlMS0`,
    "text": `Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`,
  }, {"id": `vZFWPI`, "text": `Это где ж такие красоты? Хочу такую же футболку :-)`}, {
    "id": `N6eTDj`,
    "text": `Планируете записать видосик на эту тему?`,
  }, {"id": `ssI8G3`, "text": `Совсем немного... Согласен с автором!`}],
}, {
  "id": `wzhsa2`,
  "title": `Учим HTML и CSS`,
  "createdDate": `2021-08-25T22:02:51.971Z`,
  "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. `,
  "fullText": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  "category": `Железо`,
  "comments": [{"id": `qaeRhL`, "text": `Хочу такую же футболку :-)`}, {
    "id": `Cscsja`,
    "text": `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!`,
  }],
}, {
  "id": `ga7MlE`,
  "title": `Как начать программировать`,
  "createdDate": `2021-08-24T23:31:36.371Z`,
  "announce": `Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Им написано 300 композиций.`,
  "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов.`,
  "category": `Железо`,
  "comments": [{"id": `hdVWAw`, "text": `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`}],
}, {
  "id": `21ks0Y`,
  "title": `Как достигнуть успеха не вставая с кресла`,
  "createdDate": `2021-07-20T18:26:32.701Z`,
  "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Им написано 300 композиций.`,
  "category": `Музыка`,
  "comments": [{"id": `l-nc-i`, "text": `Хочу такую же футболку :-) `}],
}, {
  "id": `EIZ8hL`,
  "title": `Самый лучший музыкальный альбом этого год`,
  "createdDate": `2021-08-31T15:25:39.177Z`,
  "announce": `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
  "fullText": `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  "category": `Кино`,
  "comments": [{"id": `AFoxCA`, "text": `Это где ж такие красоты? Планируете записать видосик на эту тему?`}],
}];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new DataService(cloneData), new CommentService());
  return app;
};


describe(`API returns a list of all articles`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));

  test(`First article's title equals "Учим HTML и CSS"`, () => expect(response.body[0].title).toBe(`Учим HTML и CSS`));

});

describe(`API returns an offer with given id`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));

});

describe(`API creates an offer if data is valid`, () => {

  const newArticle = {
    categories: [1, 2],
    title: `Самый лучший музыкальный альбом этого год`,
    createdDate: `2021-08-31T15:25:39.177Z`,
    announce: `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .post(`/articles`)
    .send(newArticle);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
  .get(`/offers`)
  .expect((res) => expect(res.body.length).toBe(6))
  );

});

describe(`API refuses to create an offer if data is invalid`, () => {

  const newArticle = {
    categories: [1, 2],
    title: `Самый лучший музыкальный альбом этого год`,
    createdDate: `2021-08-31T15:25:39.177Z`,
    announce: `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badOffers = [
      {...newArticle, title: true},
      {...newArticle, createdDate: false},
      {...newArticle, categories: []}
    ];
    for (const badOffer of badOffers) {
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badOffers = [
      {...newArticle, title: true},
      {...newArticle, createdDate: false},
      {...newArticle, categories: []}
    ];
    for (const badOffer of badOffers) {
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changes existent article`, () => {

  const newArticle = {
    categories: [1, 2],
    title: `Самый лучший музыкальный альбом этого год`,
    createdDate: `2021-08-31T15:25:39.177Z`,
    announce: `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/2`)
    .expect((res) => expect(res.body.title).toBe(`Самый лучший музыкальный альбом этого год`))
  );

});

test(`API returns status code 404 when trying to change non-existent article`, async () => {

  const app = await createAPI();

  const validArticle = {
    id: `EIZ8hL`,
    title: `Самый лучший музыкальный альбом этого год`,
    createdDate: `2021-08-31T15:25:39.177Z`,
    announce: `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: `Кино`,
    comments: [{"id": `AFoxCA`, "text": `Это где ж такие красоты? Планируете записать видосик на эту тему?`}],
  };

  return request(app)
    .put(`/articles/20`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {

  const app = await createAPI();

  const invalidArticle = {
    categories: [1, 2],
    title: `Это невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`,
    userId: 1
  };

  return request(app)
    .put(`/articles/20`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(5))
  );

});

test(`API refuses to delete non-existent article`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/20`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given artticle`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));

  test(`First comment's text is "Хочу такую же футболку :-)"`,
      () => expect(response.body[0].text).toBe(`Хочу такую же футболку :-)`));

});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этих полей`,
    userId: 1
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/3/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/3/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

  const app = await createAPI();

  return request(app)
    .post(`/articles/20/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {

  const invalidComment = {
    text: `Не указан userId`
  };

  const app = await createAPI();

  return request(app)
    .post(`/articles/2/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to delete non-existent comment`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/4/comments/100`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/20/comments/1`)
    .expect(HttpCode.NOT_FOUND);

});


