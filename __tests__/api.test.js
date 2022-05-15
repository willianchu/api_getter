const app = require ('../app.js');
const supertest = require('supertest');

const request = supertest(app);

describe("Test /ping Route", () => {

  it("gets the test of /ping endpoint", async () => {
    const response = await request.get("/api/ping");
    const message = {"success": true };
    const body = JSON.parse(response.text);
    expect(response.status).toBe(200);
    expect(body).toMatchObject(message);
  });
  
});

describe("Test /posts Route parameters", () => {

  it("gets the test of /post endpoint, without parameters", async () => {
    const response = await request.get("/api/posts");
    const message = { error: 'Tags parameter is required' };
    const body = JSON.parse(response.text);
    expect(response.status).toBe(400);
    expect(body).toMatchObject(message);
  });

  it("gets the test of /post endpoint, with invalid sort field", async () => {
    const response = await request.get("/api/posts?tag=tech&sortBy=cities");
    const message = { error: 'sortBy parameter is invalid' };
    const body = JSON.parse(response.text);
    expect(response.status).toBe(400);
    expect(body).toMatchObject(message);
  });

  it("gets the test of /post endpoint, with invalid direction field", async () => {
    const response = await request.get("/api/posts?tag=tech&direction=one");
    const message = { error: 'direction parameter is invalid' };
    const body = JSON.parse(response.text);
    expect(response.status).toBe(400);
    expect(body).toMatchObject(message);
  });

  it("gets the test of /post endpoint, with an unknown tag", async () => {
    const response = await request.get("/api/posts?tag=techie");
    const message = { posts: [] };
    const body = JSON.parse(response.text);
    expect(response.status).toBe(200);
    expect(body).toMatchObject(message);
  });

  it("gets the test of /post endpoint, with multiple tags", async () => {
    const response = await request.get("/api/posts?tag=history,tech");
    const first = {id: 1};
    const last = {id: 100};
    const arrayLength = 46;
    const body = JSON.parse(response.text);
    const array = (body.posts);
    const firstPost = array[0];
    const lastPost = array[arrayLength - 1];
    expect(response.status).toBe(200);
    expect(array.length).toBe(arrayLength);
    expect(firstPost.id).toBe(first.id);
    expect(lastPost.id).toBe(last.id);
  });
  
});


