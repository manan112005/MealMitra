import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { prisma } from "../src/config/database.js";
import { Server } from "node:http";

describe("Phase 2: Authentication, RBAC & Address Security Tests", () => {
  let server: Server;
  let baseUrl: string;

  let customerToken: string;
  let customerRefreshToken: string;
  let customerId: string;

  let chefToken: string;
  let chefId: string;

  let deliveryToken: string;
  let deliveryId: string;

  let customerAddressId: string;

  before(async () => {
    // Start test server on random port
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        if (addr && typeof addr === "object") {
          baseUrl = `http://localhost:${addr.port}/api/v1`;
        }
        resolve();
      });
    });

    // Clean up test data if any
    await prisma.address.deleteMany({
      where: { user: { email: { contains: "test.phase2" } } },
    });
    await prisma.refreshToken.deleteMany({
      where: { user: { email: { contains: "test.phase2" } } },
    });
    await prisma.passwordResetToken.deleteMany({
      where: { user: { email: { contains: "test.phase2" } } },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: "test.phase2" } },
    });
  });

  after(async () => {
    // Teardown
    await prisma.address.deleteMany({
      where: { user: { email: { contains: "test.phase2" } } },
    });
    await prisma.refreshToken.deleteMany({
      where: { user: { email: { contains: "test.phase2" } } },
    });
    await prisma.passwordResetToken.deleteMany({
      where: { user: { email: { contains: "test.phase2" } } },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: "test.phase2" } },
    });

    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  // 1. Customer Registration
  it("should successfully register a CUSTOMER account", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test Customer",
        email: "customer.test.phase2@mealmitra.com",
        phone: "+919876540001",
        password: "Password123!",
        role: "CUSTOMER",
        dietaryPreferences: "Vegetarian",
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.user.role, "CUSTOMER");
    assert.equal(body.data.user.customerProfile.dietaryPreferences, "Vegetarian");
    assert.ok(body.data.tokens.accessToken);
    assert.ok(body.data.tokens.refreshToken);
    assert.equal(body.data.user.passwordHash, undefined); // Never return passwordHash

    customerToken = body.data.tokens.accessToken;
    customerRefreshToken = body.data.tokens.refreshToken;
    customerId = body.data.user.id;
  });

  // 2. Chef Registration
  it("should successfully register a CHEF account with Kitchen", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Chef Sanjeev",
        email: "chef.test.phase2@mealmitra.com",
        phone: "+919876540002",
        password: "ChefPassword123!",
        role: "CHEF",
        kitchenName: "Sanjeev's Desi Kitchen",
        cuisine: "North Indian",
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.user.role, "CHEF");
    assert.equal(body.data.user.chefProfile.cuisine, "North Indian");
    assert.equal(body.data.user.chefProfile.kitchen.name, "Sanjeev's Desi Kitchen");

    chefToken = body.data.tokens.accessToken;
    chefId = body.data.user.id;
  });

  // 3. Delivery Registration
  it("should successfully register a DELIVERY account", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Delivery Runner",
        email: "delivery.test.phase2@mealmitra.com",
        phone: "+919876540003",
        password: "RiderPassword123!",
        role: "DELIVERY",
        vehicleType: "Electric Scooter",
        vehicleNumber: "GJ01AB1234",
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.user.role, "DELIVERY");
    assert.equal(body.data.user.deliveryProfile.vehicleType, "Electric Scooter");

    deliveryToken = body.data.tokens.accessToken;
    deliveryId = body.data.user.id;
  });

  // 4. Attempted ADMIN Registration (Must Fail)
  it("should reject attempted ADMIN registration with 400 validation error", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Fake Admin Hacker",
        email: "fakeadmin.test.phase2@mealmitra.com",
        phone: "+919876540099",
        password: "AdminPassword123!",
        role: "ADMIN",
      }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, "VALIDATION_ERROR");
  });

  // 5. Duplicate Email Registration (Must Fail)
  it("should reject duplicate email registration with 409 Conflict", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Duplicate User",
        email: "customer.test.phase2@mealmitra.com",
        password: "Password123!",
        role: "CUSTOMER",
      }),
    });

    assert.equal(res.status, 409);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, "EMAIL_ALREADY_EXISTS");
  });

  // 6. Invalid Email Format (Must Fail)
  it("should reject invalid email format with 400 Validation Error", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Invalid Email",
        email: "not-a-valid-email",
        password: "Password123!",
        role: "CUSTOMER",
      }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, "VALIDATION_ERROR");
  });

  // 7. Login with Wrong Password (Must Fail)
  it("should reject login with incorrect password with 401 Unauthorized", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "customer.test.phase2@mealmitra.com",
        password: "WrongPassword999!",
      }),
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, "INVALID_CREDENTIALS");
  });

  // 8. Successful Login
  it("should successfully log in with valid credentials", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "customer.test.phase2@mealmitra.com",
        password: "Password123!",
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.tokens.accessToken);
    assert.ok(body.data.tokens.refreshToken);
    assert.equal(body.data.user.email, "customer.test.phase2@mealmitra.com");

    customerToken = body.data.tokens.accessToken;
    customerRefreshToken = body.data.tokens.refreshToken;
  });

  // 9. Token Refresh with Rotation
  it("should rotate and refresh token using valid refresh token", async () => {
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: customerRefreshToken,
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.accessToken);
    assert.ok(body.data.refreshToken);

    const newAccessToken = body.data.accessToken;
    const newRefreshToken = body.data.refreshToken;

    // Verify the OLD refresh token is now revoked and cannot be reused
    const reuseRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: customerRefreshToken,
      }),
    });
    assert.equal(reuseRes.status, 401);

    // Update with latest valid tokens
    customerToken = newAccessToken;
    customerRefreshToken = newRefreshToken;
  });

  // 10. GET /api/v1/auth/me (Current User)
  it("GET /api/v1/auth/me should return authenticated user details", async () => {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.id, customerId);
    assert.equal(body.data.email, "customer.test.phase2@mealmitra.com");
    assert.equal(body.data.role, "CUSTOMER");
  });

  // 11. Profile Update
  it("PATCH /api/v1/users/me should update profile details", async () => {
    const res = await fetch(`${baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Updated Customer Name",
        dietaryPreferences: "Jain Vegetarian",
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.fullName, "Updated Customer Name");
    assert.equal(body.data.customerProfile.dietaryPreferences, "Jain Vegetarian");
  });

  // 12. Address CRUD & Ownership Enforcement
  it("should create address for customer", async () => {
    const res = await fetch(`${baseUrl}/addresses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: "HOME",
        addressLine1: "102 Sunrise Towers",
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380015",
        isDefault: true,
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.data.addressLine1, "102 Sunrise Towers");
    assert.equal(body.data.isDefault, true);
    customerAddressId = body.data.id;
  });

  it("should prevent another user (Chef) from updating or deleting Customer address", async () => {
    // Chef tries to update Customer's address
    const patchRes = await fetch(`${baseUrl}/addresses/${customerAddressId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${chefToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addressLine1: "Hacked Address Line",
      }),
    });
    assert.equal(patchRes.status, 403);

    // Chef tries to delete Customer's address
    const deleteRes = await fetch(`${baseUrl}/addresses/${customerAddressId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${chefToken}` },
    });
    assert.equal(deleteRes.status, 403);
  });

  it("should allow customer to update and delete their own address", async () => {
    // Update
    const patchRes = await fetch(`${baseUrl}/addresses/${customerAddressId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addressLine2: "Near SG Highway",
      }),
    });
    assert.equal(patchRes.status, 200);
    const patchBody = await patchRes.json();
    assert.equal(patchBody.data.addressLine2, "Near SG Highway");

    // Delete
    const deleteRes = await fetch(`${baseUrl}/addresses/${customerAddressId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(deleteRes.status, 200);
  });

  // 13. Password Change & Invalidation
  it("should allow password change and authenticate with new password", async () => {
    const res = await fetch(`${baseUrl}/auth/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: "Password123!",
        newPassword: "BrandNewPassword456!",
      }),
    });

    assert.equal(res.status, 200);

    // Login with new password
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "customer.test.phase2@mealmitra.com",
        password: "BrandNewPassword456!",
      }),
    });
    assert.equal(loginRes.status, 200);
  });

  // 14. Forgot and Reset Password Flow
  it("should support forgot password and reset password flow", async () => {
    const forgotRes = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "customer.test.phase2@mealmitra.com",
      }),
    });

    assert.equal(forgotRes.status, 200);
    const forgotBody = await forgotRes.json();
    assert.ok(forgotBody.data.resetToken);

    // Reset password with token
    const resetRes = await fetch(`${baseUrl}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: forgotBody.data.resetToken,
        newPassword: "ResetPassword789!",
      }),
    });
    assert.equal(resetRes.status, 200);

    // Login with reset password
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "customer.test.phase2@mealmitra.com",
        password: "ResetPassword789!",
      }),
    });
    assert.equal(loginRes.status, 200);
  });

  // 15. Disabled User Access Prevention
  it("should prevent deactivated users from authenticating", async () => {
    // Deactivate user in database
    await prisma.user.update({
      where: { id: customerId },
      data: { isActive: false },
    });

    // Login attempt
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "customer.test.phase2@mealmitra.com",
        password: "ResetPassword789!",
      }),
    });
    assert.equal(loginRes.status, 403);

    // Bearer token attempt
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(meRes.status, 403);
  });
});
