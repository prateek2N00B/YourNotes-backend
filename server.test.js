const app = require("./server.js");
const request = require("supertest");

let token = "";
let note_id = "";

// Register a user how already exists
describe("Post /users-api/register", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app).post("/users-api/register").send({
      username: "testuser",
      email: "testuser@gmail.com",
      password: "123",
    });
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe("application/json");
  });
});

// User login
describe("Post /users-api/login", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app).post("/users-api/login").send({
      email: "testuser@gmail.com",
      password: "123",
    });
    token = response.body.token;
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// User login with a user that does not exists
describe("Post /users-api/login", () => {
  test("Status Code should be 400 and type should be json list", async () => {
    const response = await request(app).post("/users-api/login").send({
      email: "randomuseremail@gmail.com",
      password: "123",
    });
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe("application/json");
  });
});

// User login with a wrong password
describe("Post /users-api/login", () => {
  test("Status Code should be 400 and type should be json list", async () => {
    const response = await request(app).post("/users-api/login").send({
      email: "testuser@gmail.com",
      password: "12345",
    });
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe("application/json");
  });
});

// Get all notes of a user
describe("Get /notes-api/", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .get("/notes-api/")
      .set("Authorization", token)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// Create a new note for a user
describe("Post /notes-api/", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .post("/notes-api/")
      .set("Authorization", token)
      .send({
        title: "title",
        blocks: [],
        date: new Date(),
        childPages: [],
        parentPages: [],
      });
    expect(response.statusCode).toBe(200);
    note_id = response.body.id;
    expect(response.type).toBe("application/json");
  });
});

// Get a note of a user
describe("Get /notes-api/:id", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .get(`/notes-api/${note_id}`)
      .set("Authorization", token)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// update a note of a user
describe("Put /notes-api/:id", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .put(`/notes-api/${note_id}`)
      .set("Authorization", token)
      .send({
        title: "title",
        blocks: [{ id: "0987654321", tag: "p", html: "this block is added" }],
        date: new Date(),
        childPages: [],
        parentPages: [],
      });
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// Delete a note of a user
describe("Delete /notes-api/:id", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .delete(`/notes-api/${note_id}`)
      .set("Authorization", token)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// Get notes title of a user
describe("Post /notes-api/get-title", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .post(`/notes-api/get-title`)
      .set("Authorization", token)
      .send({ notes_id: ["6277cfb0cb849b1bd829d4b4"] });
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// Add to shared notes of a user
describe("Post /shared-notes-api/", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .post(`/shared-notes-api/`)
      .set("Authorization", token)
      .send({
        note_id: note_id,
      });
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// Get shared notes of a user
describe("Get /shared-notes-api/", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .get(`/shared-notes-api/`)
      .set("Authorization", token)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});

// Delete a shared note of a user
describe("Post /shared-notes-api/delete", () => {
  test("Status Code should be 200 and type should be json list", async () => {
    const response = await request(app)
      .post(`/shared-notes-api/delete`)
      .set("Authorization", token)
      .send({
        note_id: note_id,
      });
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});
