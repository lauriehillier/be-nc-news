const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("/api", () => {
  test("400: sends an appropriate error message if given an invalid path", () => {
    return request(app)
      .get("/api/toopics")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Path");
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
            expect(typeof endpoints[endpointKey].exampleRequest).toBe(
              "object"
            );
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
            expect(Array.isArray(body.topics)).toBe(true);
            body.topics.forEach((topic) => {
              expect("slug" in topic).toBe(true);
              expect("description" in topic).toBe(true);
            });
          });
      });
    });
  });
});
// test for bad path?
