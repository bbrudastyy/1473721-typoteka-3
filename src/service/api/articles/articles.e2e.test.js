'use strict';

const express = require(`express`);
const request = require(`supertest`);

const articles = require(`./articles`);
const DataService = require(`./services/article`);
const CommentService = require(`../comments/services/comments`);

const HttpCode = require(`../../../httpCode`);

const mockData = [
  {
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
  },
  {
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
  },
  {
    "id": `ga7MlE`,
    "title": `Как начать программировать`,
    "createdDate": `2021-08-24T23:31:36.371Z`,
    "announce": `Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Им написано 300 композиций.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов.`,
    "category": `Железо`,
    "comments": [{"id": `hdVWAw`, "text": `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`}],
  },
  {
    "id": `21ks0Y`,
    "title": `Как достигнуть успеха не вставая с кресла`,
    "createdDate": `2021-07-20T18:26:32.701Z`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Им написано 300 композиций.`,
    "category": `Музыка`,
    "comments": [{"id": `l-nc-i`, "text": `Хочу такую же футболку :-) `}],
  },
  {
    "id": `EIZ8hL`,
    "title": `Самый лучший музыкальный альбом этого год`,
    "createdDate": `2021-08-31T15:25:39.177Z`,
    "announce": `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "category": `Кино`,
    "comments": [{"id": `AFoxCA`, "text": `Это где ж такие красоты? Планируете записать видосик на эту тему?`}],
  },
];

const cloneData = JSON.parse(JSON.stringify(mockData));
const createAPI = (services = [new DataService(cloneData), new CommentService(cloneData)]) => {
  const app = express();
  app.use(express.json());
  articles(app, ...services);
  return app;
};

/* eslint-disable max-nested-callbacks */
describe(`Testing API article`, () => {

  describe(`API returns article`, () => {
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
          .get(`/articles/1TtuWX`);
      });

      test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

      test(`Offer's title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));

    });
  });

  describe(`API for testing article creation`, () => {
    describe(`API creates an offer if data is valid`, () => {

      const newArticle = {
        title: `Музыкальный альбом этого год`,
        createdDate: `2021-08-31T15:25:39.177Z`,
        announce: `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
        category: `Кино`,
        comments: [],
      };

      let app;
      let response;
      let articleServices = new DataService(cloneData);

      beforeAll(async () => {
        app = await createAPI([articleServices]);
        response = await request(app)
          .post(`/articles`)
          .send(newArticle);
      });


      test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

      test(`Articles count is changed`, () => expect(articleServices.findAll()).toHaveLength(6));
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
          {...newArticle, categories: []},
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
          {...newArticle, categories: []},
        ];
        for (const badOffer of badOffers) {
          await request(app)
            .post(`/articles`)
            .send(badOffer)
            .expect(HttpCode.BAD_REQUEST);
        }
      });

    });
  });

  describe(`API changes article`, () => {
    describe(`API deletes article`, () => {
      describe(`API correctly deletes an article`, () => {

        let app;
        let response;
        let articleServices;
        let commentService;
        articleServices = new DataService(cloneData);
        commentService = new CommentService(cloneData);

        // test(`Articles count is changed`, () => expect(articleServices.findAll()).toHaveLength(4));

        beforeAll(async () => {
          app = await createAPI([articleServices, commentService]);
          response = await request(app)
            .delete(`/articles/1TtuWX`);
        });

        test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

        test(`Articles count is changed`, () => expect(articleServices.findAll()).toHaveLength(4));
      });

      describe(`API refuses to delete non-existent article`, () => {
        let app;
        let response;

        beforeAll(async () => {
          app = await createAPI();
          response = await request(app)
            .delete(`/articles/20`);
        });

        test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
      });
    });

    describe(`API changes existent article`, () => {

      const newArticle = {
        title: `Музыкальный альбом этого года`,
        createdDate: `2021-08-31T15:25:39.177Z`,
        announce: `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
        category: `Кино`,
        comments: [],
      };

      let app;
      let response;

      beforeAll(async () => {
        app = await createAPI();
        response = await request(app)
          .put(`/articles/1TtuWX`)
          .send(newArticle);
      });

      test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

      test(`Article is really changed`, () => request(app)
        .get(`/articles/1TtuWX`)
        .expect((res) => expect(res.body.title).toBe(`Музыкальный альбом этого года`)),
      );

    });

    describe(`API returns status code 404 when trying to change non-existent article`, () => {
      let app;
      let response;

      const validArticle = {
        title: `Самый лучший музыкальный альбом этого год`,
        createdDate: `2021-08-31T15:25:39.177Z`,
        announce: `Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Им написано 300 композиций. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
        category: `Кино`,
        comments: [],
      };

      beforeAll(async () => {
        app = await createAPI();
        response = await request(app)
          .put(`/articles/20`)
          .send(validArticle);
      });

      test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
    });

    describe(`API returns status code 400 when trying to change an article with invalid data`, () => {
      let app;
      let response;

      const invalidArticle = {
        categories: `Кино`,
        title: `Это невалидный`,
        description: `объект`,
        picture: `объявления`,
        type: `нет поля sum`,
        userId: 1,
      };

      beforeAll(async () => {
        app = await createAPI();
        response = await request(app)
          .put(`/articles/1TtuWX`)
          .send(invalidArticle);
      });

      test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

    });
  });

  describe(`API works with comments`, () => {
    describe(`API returns a list of comments to given article`, () => {

      let response;
      let app;
      // let articleService = new DataService(cloneData);
      // let commentService = new DataService(cloneData);

      beforeAll(async () => {
        app = await createAPI();
        response = await request(app)
          .get(`/articles/wzhsa2/comments`);
      });

      test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

      test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));

      test(`First comment's text is "Хочу такую же футболку :-)"`, () => expect(response.body[0].text).toBe(`Хочу такую же футболку :-)`));

    });

    describe(`API creates a comment if data is valid`, () => {

      const newComment = {
        text: `Валидному комментарию достаточно этих полей`,
        userId: 1,
      };

      let app;
      let response;

      beforeAll(async () => {
        app = await createAPI();
        response = await request(app)
          .post(`/articles/wzhsa2/comments`)
          .send(newComment);
      });


      test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

      test(`Comments count is changed`, () => request(app)
        .get(`/articles/wzhsa2/comments`)
        .expect((res) => expect(res.body.length).toBe(3)),
      );

    });

    describe(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
      test(`Status code 404`, () => request(createAPI())
        .post(`/articles/20/comments`)
        .send({
          text: `Неважно`,
        })
        .expect(HttpCode.NOT_FOUND));
    });

    describe(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
      const invalidComment = {
        text: `Не указан userId`,
      };

      test(`Status code 400`, () => request(createAPI())
        .post(`/articles/1TtuWX/comments`)
        .send(invalidComment)
        .expect(HttpCode.BAD_REQUEST));
    });


    describe(`API correctly deletes a comment`, () => {

      let app;
      let response;
      let articleService = new DataService(cloneData);
      let commentService = new CommentService(cloneData);

      beforeAll(async () => {
        app = await createAPI([articleService, commentService]);
        response = await request(app)
          .delete(`/articles/EIZ8hL/comments/AFoxCA`);
      });

      test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

      // expect(articleServices.findAll()).toHaveLength(6));

      test(`Comments count is 0 now`, () => expect(commentService.findAll(`1TtuWX`)).toHaveLength(0));

      // test(`Comments count is 3 now`, () => request(app)
      //   .get(`/articles/1TtuWX/comments`)
      //   .expect((res) => expect(res.body.length).toBe(3)),
      // );

    });

    test(`API refuses to delete non-existent comment`, async () => {


      return request(createAPI())
        .delete(`/articles/1TtuWX/comments/100`)
        .expect(HttpCode.NOT_FOUND);

    });

    test(`API refuses to delete a comment to non-existent article`, async () => {


      return request(createAPI())
        .delete(`/articles/20/comments/1`)
        .expect(HttpCode.NOT_FOUND);

    });
  });
});
/* eslint-enable*/
