import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { Server } from "node:http";

describe("Health Route & API Tests", () => {
  let server: Server;
  let port: number;

  it("should start test server instance", async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        if (addr && typeof addr === "object") {
          port = addr.port;
        }
        resolve();
      });
    });
    assert.ok(port > 0);
  });

  it("GET / should return operational metadata", async () => {
    const res = await fetch(`http://localhost:${port}/`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.name, "MealMitra API");
    assert.equal(body.version, "1.0.0");
  });

  it("GET /api/v1/health should return health payload", async () => {
    const res = await fetch(`http://localhost:${port}/api/v1/health`);
    assert.ok([200, 503].includes(res.status));
    const body = await res.json();
    assert.ok("success" in body);
    assert.ok("data" in body);
    assert.equal(body.data.appName, "MealMitra Backend API");
    assert.ok("database" in body.data);
  });

  it("GET /non-existent-route should return structured 404", async () => {
    const res = await fetch(`http://localhost:${port}/non-existent-route`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, "NOT_FOUND");
  });

  it("should clean up test server instance", async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });
});
