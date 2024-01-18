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
      test("200: sends an array of articles objects with the correct properties, sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(Array.isArray(articles)).toBe(true);
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
      describe("?sort_by", () => {
        test("200: sends an array of article objects sorted by an optional sort_by query", () => {
          return request(app)
            .get("/api/articles?sort_by=comment_count")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles).toBeSortedBy("comment_count", {
                descending: true,
              });
            });
        });
        test("400: sends an appropriate error if sort_by query is invalid or not allowed (only created_by, comment_count & votes are allowed)", () => {
          return request(app)
            .get("/api/articles?sort_by=hello")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid sort query");
            });
        });
      });
      describe("?order", () => {
        test("200: sends an array of article objects ordered by an optional order_by query (in any case)", () => {
          return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles).toBeSortedBy("created_at");
            });
        });
        test("400: sends an appropriate error if order query is invalid (not asc or desc)", () => {
          return request(app)
            .get("/api/articles?order=hello")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid order query");
            });
        });
      });
      describe("?topic=topic", () => {
        test("200: sends an array of article objects with the given topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              articles.forEach((article) => {
                expect(article.topic).toBe("mitch");
              });
            });
        });
        test("404: sends an appropriate error if topic doesn't exist", () => {
          return request(app)
            .get("/api/articles?topic=hello")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Topic not found");
            });
        });
        test("200: sends an empty array if topic exists but no articles are linked to it", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(Array.isArray(articles)).toBe(true);
              expect(articles.length).toBe(0);
            });
        });
      });
      describe("?limit&p", () => {
        test("200: sends an array of articles with a default limit of 10 and a total count of potential results", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles.length).toBe(10);
              expect(articles[0].total_count).toBe(12);
            });
        });
        test("200: sends an array of articles with the given number of articles", () => {
          return request(app)
            .get("/api/articles?topic=mitch&limit=5")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles.length).toBe(5);
              expect(articles[0].total_count).toBe(12);
            });
        });
        test("200: sends an array of articles starting at the given 'page'", () => {
          return request(app)
            .get("/api/articles?topic=mitch&limit=5&p=2")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles[0].created_at).toBe("2020-07-09T20:11:00.000Z");
            });
        });
        test("400: sends an appropriate error if the limit given is invalid (not a positive number)", () => {
          return request(app)
            .get("/api/articles?limit=-1")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
        test("400: sends an appropriate error if the page given is invalid (not a positive number)", () => {
          return request(app)
            .get("/api/articles?p=hello")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });

        // page doesn't exist - or do we just want to return empty?
      });
    });
    describe("POST", () => {
      test("201: sends an object of the posted article", () => {
        return request(app)
          .post("/api/articles/")
          .send({
            author: "butter_bridge",
            title: "this is a title!",
            body: "this is an article!",
            topic: "paper",
            article_img_url: "https://image.images.com",
          })
          .expect(201)
          .then(({ body }) => {
            const { article } = body;
            expect(article).toMatchObject({
              article_id: 14,
              author: "butter_bridge",
              title: "this is a title!",
              body: "this is an article!",
              topic: "paper",
              article_img_url: "https://image.images.com",
              votes: 0,
              comment_count: 0,
            });
            expect(typeof article.created_at).toBe("string");
          });
      });
      test("404: sends an appropriate error if the topic doesn't exist", () => {
        return request(app)
          .post("/api/articles/")
          .send({
            author: "butter_bridge",
            title: "this is a title!",
            body: "this is an article!",
            topic: "hello",
            article_img_url: "https://image.images.com",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Topic not found");
          });
      });
      test("404: sends an appropriate error if the user doesn't exist", () => {
        return request(app)
          .post("/api/articles/")
          .send({
            author: "hello",
            title: "this is a title!",
            body: "this is an article!",
            topic: "paper",
            article_img_url: "https://image.images.com",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("User not found");
          });
      });
      test("400: sends an appropriate error if and required keys are empty (anything other than article_img_url)", () => {
        return request(app)
          .post("/api/articles/")
          .send({
            author: "",
            title: "this is a title!",
            body: "fgdg",
            topic: "paper",
            article_img_url: "https://image.images.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: Missing Required Fields");
          });
      });
      test("400: sends an appropriate error if any required keys are missing", () => {
        return request(app)
          .post("/api/articles/")
          .send({
            author: "",
            title: "this is a title!",
            topic: "paper",
            article_img_url: "https://image.images.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: Missing Required Fields");
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
              const { article } = body;
              expect(article).toMatchObject({
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
        test("200: sends an object of the article with the given id, now with comment count", () => {
          return request(app)
            .get("/api/articles/5")
            .expect(200)
            .then(({ body }) => {
              const { article } = body;
              expect(article).toMatchObject({
                comment_count: 2,
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
      describe("PATCH", () => {
        test("200: sends an object of the updated article if given positive vote number", () => {
          return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              const { article } = body;
              expect(article).toEqual({
                article_id: 5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                body: "Bastet walks amongst us, and the cats are taking arms!",
                created_at: "2020-08-03T13:14:00.000Z",
                votes: 1,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
            });
        });
        test("200: sends an object of the updated article if given negative vote number", () => {
          return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: -20 })
            .expect(200)
            .then(({ body }) => {
              const { article } = body;
              expect(article.votes).toBe(-20);
            });
        });
        test("400: sends an appropriate error if id is invalid", () => {
          return request(app)
            .patch("/api/articles/hello")
            .send({ inc_votes: -20 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
        test("404: sends an appropriate error if id is valid but doesn't exist", () => {
          return request(app)
            .patch("/api/articles/744859587")
            .send({ inc_votes: -20 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Article not found");
            });
        });
        test("400: sends an appropriate error if given vote is invalid (e.g. not a number)", () => {
          return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
        test("400: sends an appropriate error if vote is missing", () => {
          return request(app)
            .patch("/api/articles/5")
            .send({ another: "hello" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
      });
      describe("/comments", () => {
        describe("GET", () => {
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
          test("400: sends an appropriate error if id is invalid (i.e. a string)", () => {
            return request(app)
              .get("/api/articles/hello/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
          });
          test("200: sends an empty array if article id exists, but the article has no comments", () => {
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
        describe("POST", () => {
          test("201: sends an object of the posted comment", () => {
            return request(app)
              .post("/api/articles/5/comments")
              .send({ username: "butter_bridge", body: "this is a comment!" })
              .expect(201)
              .then(({ body }) => {
                const { comment } = body;
                expect(typeof comment.comment_id).toBe("number");
                expect(comment.author).toBe("butter_bridge");
                expect(comment.body).toBe("this is a comment!");
                expect(typeof comment.created_at).toBe("string");
                expect(comment.votes).toBe(0);
                expect(comment.article_id).toBe(5);
              });
          });
          test("400: sends an appropriate error if article id is invalid", () => {
            return request(app)
              .post("/api/articles/hello/comments")
              .send({ username: "butter_bridge", body: "this is a comment!" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
          });
          test("404: sends an appropriate error if article id is valid but doesn't exist", () => {
            return request(app)
              .post("/api/articles/744859587/comments")
              .send({ username: "butter_bridge", body: "this is a comment!" })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
              });
          });
          test("400: sends an appropriate error if the comment body is empty", () => {
            return request(app)
              .post("/api/articles/5/comments")
              .send({ username: "butter_bridge", body: "" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Empty Comment");
              });
          });
          test("404: sends an appropriate error if user does not exist", () => {
            return request(app)
              .post("/api/articles/5/comments")
              .send({
                username: "butter_bridge_3838383",
                body: "this is a comment!",
              })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("User not found");
              });
          });
        });
      });
    });
  });
  describe("/comments/:comment_id", () => {
    describe("DELETE", () => {
      test("204: returns no content", () => {
        return request(app)
          .delete("/api/comments/5")
          .expect(204)
          .then(({ body }) => {
            expect(body).toEqual({});
          });
      });
      test("400: sends an appropriate error if id is invalid", () => {
        return request(app)
          .delete("/api/comments/hello/")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("404: sends an appropriate error if id is valid but doesn't exist", () => {
        return request(app)
          .delete("/api/comments/744859587")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Comment not found");
          });
      });
    });
    describe("PATCH", () => {
      test("200: sends an object of the updated comment if given positive vote number", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toEqual({
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 17,
              author: "butter_bridge",
              article_id: 9,
              created_at: "2020-04-06T12:17:00.000Z",
            });
          });
      });
      test("200: sends an object of the updated comment if given negative vote number", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment.votes).toBe(6);
          });
      });
      test("400: sends an appropriate error if id is invalid", () => {
        return request(app)
          .patch("/api/comments/hello")
          .send({ inc_votes: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("404: sends an appropriate error if id is valid but doesn't exist", () => {
        return request(app)
          .patch("/api/comments/744859587")
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Comment not found");
          });
      });
      test("400: sends an appropriate error if given vote is invalid (e.g. not a number)", () => {
        return request(app)
          .patch("/api/comments/5")
          .send({ inc_votes: "hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("400: sends an appropriate error if inc_vote is missing", () => {
        return request(app)
          .patch("/api/comments/5")
          .send({ another: "hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      test("200: sends an array of user objects with the correct properties", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).not.toBe(0);
            users.forEach((user) => {
              expect(typeof user.username).toBe("string");
              expect(typeof user.name).toBe("string");
              expect(typeof user.avatar_url).toBe("string");
            });
          });
      });
    });
    describe("/:username", () => {
      describe("GET", () => {
        test("200: sends an object of the user with the given username", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              const { user } = body;
              expect(user).toMatchObject({
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              });
            });
        });
        test("404: sends an appropriate error if the user doesn't exist", () => {
          return request(app)
            .get("/api/users/hello")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("User not found");
            });
        });
      });
    });
  });
});
