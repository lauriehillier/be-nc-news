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
          expect(Object.keys(endpoints).length).not.toBe(0);
          Object.keys(endpoints).forEach((endpointKey) => {
            expect(typeof endpoints[endpointKey].description).toBe("string");
            expect(Array.isArray(endpoints[endpointKey].queries)).toBe(true);
            expect(typeof endpoints[endpointKey].exampleRequest).toBe("object");
            expect(typeof endpoints[endpointKey].exampleResponse).toBe(
              "object"
            );
          });
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
            const { topics } = body
            expect(Array.isArray(topics)).toBe(true);
            expect(topics.length).not.toBe(0)
            topics.forEach((topic) => {
              expect("slug" in topic).toBe(true);
              expect("description" in topic).toBe(true);
            });
          });
      });
    });
  });
  describe("/articles/:article_id", () => {
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
  });
});
