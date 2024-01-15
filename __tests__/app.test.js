const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("/api", () => {
  test("404: sends an appropriate error message if given an invalid path", () => {
    return request(app)
      .get("/api/toopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  describe("GET", () => {
    test("200: sends an object describing all endpoints available on the API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { endpoints } = body;
          const endpointData = require("../endpoints.json");
          expect(endpoints).toEqual(endpointData);
        });
    });
  });
  describe("/topics", () => {
    describe("GET", () => {
      test("200: sends an array of topic objects with the correct properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const { topics } = body;
            expect(Array.isArray(topics)).toBe(true);
            expect(topics.length).not.toBe(0);
            topics.forEach((topic) => {
              expect("slug" in topic).toBe(true);
              expect("description" in topic).toBe(true);
            });
          });
      });
    });
  });

  describe("/articles", () => {
    describe("GET", () => {
      test("200: sends an array of article objects with the correct properties, sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(Array.isArray(articles)).toBe(true);
            expect(articles.length).not.toBe(0);
            expect(articles).toBeSortedBy("created_at", { descending: true });
            articles.forEach((article) => {
              expect("body" in article).toBe(false);
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.comment_count).toBe("number");
            });
          });
      });
    });
    describe("/:article_id", () => {
      describe("GET", () => {
        test("200: sends an object of the article with the given id", () => {
          return request(app)
            .get("/api/articles/5")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).toEqual({
                article_id: 5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                body: "Bastet walks amongst us, and the cats are taking arms!",
                created_at: "2020-08-03T13:14:00.000Z",
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
            });
        });
        test("400: sends an appropriate error if id is invalid (i.e. a string)", () => {
          return request(app)
            .get("/api/articles/hello")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
        test("404: sends an appropriate error if id is valid but doesn't exist", () => {
          return request(app)
            .get("/api/articles/744859587")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Article not found");
            });
        });
      });
      describe("GET", () => {
        describe("/comments", () => {
          test("200: sends an array of comments objects with the correct properties, sorted by date created in ascending order", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                const { comments } = body;
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).not.toBe(0);
                expect(comments).toBeSortedBy("created_at");
                comments.forEach((comment) => {
                  expect(typeof comment.comment_id).toBe("number");
                  expect(typeof comment.author).toBe("string");
                  expect(typeof comment.body).toBe("string");
                  expect(typeof comment.created_at).toBe("string");
                  expect(typeof comment.votes).toBe("number");
                  expect(typeof comment.article_id).toBe("number");
                  expect(comment.article_id).toBe(1);
                });
              });
          });
          test("200: sends an empty array if article id exists, but the article has no comments", () => {
            return request(app)
              .get("/api/articles/hello/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
          });
          test("400: sends an appropriate error if id is invalid (i.e. a string)", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body }) => {
                const { comments } = body;
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(0);
              });
          });
          test("404: sends an appropriate error if article id is valid but doesn't exist", () => {
            return request(app)
              .get("/api/articles/744859587/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
              });
          });
        });
      });
    });
  });
});
