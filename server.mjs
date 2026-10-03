import http from "node:http";

// Tasks scoped to specific user IDs
let tasks = [
  { id: "1", userId: "1", title: "Admin Task #1", done: false },
  { id: "2", userId: "1", title: "Admin Task #2", done: true },
];

// Updated to 3 initial users
const users = [
  { id: "1", username: "admin", email: "admin@example.com", password: "123456" },
  { id: "2", username: "john_doe", email: "john@example.com", password: "123456" },
  { id: "3", username: "jane_smith", email: "jane@example.com", password: "123456" }
];

// Initial 3 posts matching the 3 users
let posts = [
  { id: "1", userId: "1", title: "First Post by Admin", content: "Welcome to our new API server!" },
  { id: "2", userId: "2", title: "Hello World", content: "Excited to join this new network." },
  { id: "3", userId: "3", title: "Tech Thoughts", content: "Node.js without frameworks is surprisingly fun." }
];

// Token duration configurations:
const ACCESS_TOKEN_EXPIRATION_MS = 15 * 1000;
const REFRESH_TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

// Storage maps for active tokens
const activeAccessTokens = new Map();  // accessToken -> { userId, expiresAt }
const activeRefreshTokens = new Map(); // refreshToken -> { userId, expiresAt }

const allowedOrigins = new Set([
  process.env.FRONTEND_ORIGIN ?? "http://localhost:5173"
]);

const server = http.createServer((req, res) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Client-Version");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const urlObj = new URL(req.url ?? "/", "http://localhost");
  const path = urlObj.pathname;
  const method = req.method ?? "GET";
  const searchParams = urlObj.searchParams;

  const sendJSON = (statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  };

  const sendError = (status, code, message) => {
    return sendJSON(status, {
      status,
      code,
      message
    });
  };

  const generateTokens = (userId) => {
    const accessToken = `access-token-${userId}-${Date.now()}`;
    const refreshToken = `refresh-token-${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    activeAccessTokens.set(accessToken, {
      userId,
      expiresAt: Date.now() + ACCESS_TOKEN_EXPIRATION_MS
    });

    activeRefreshTokens.set(refreshToken, {
      userId,
      expiresAt: Date.now() + REFRESH_TOKEN_EXPIRATION_MS
    });

    return { accessToken, refreshToken };
  };

  const delayMs = Number(searchParams.get("delay") ?? 0);

  setTimeout(() => {
    // POST /register
    if (method === "POST" && path === "/register") {
      let body = "";
      req.on("data", (chunk) => { body += chunk.toString(); });
      req.on("end", () => {
        try {
          const { username, email, password } = JSON.parse(body);

          if (!username || !email || !password) {
            return sendError(400, "MISSING_FIELDS", "Username, email, and password are required");
          }

          const existingUser = users.find((u) => u.email === email);
          if (existingUser) {
            return sendError(409, "DUPLICATE_EMAIL", "Email address is already in use");
          }

          const newUser = { id: crypto.randomUUID(), username, email, password };
          users.push(newUser);

          const tokens = generateTokens(newUser.id);

          res.setHeader(
            "Set-Cookie",
            `refreshToken=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
          );

          return sendJSON(201, {
            accessToken: tokens.accessToken,
            user: { id: newUser.id, username: newUser.username, email: newUser.email },
            message: "User registered successfully"
          });
        } catch {
          return sendError(400, "INVALID_JSON", "Invalid JSON request body");
        }
      });
      return;
    }

    // POST /login
    if (method === "POST" && path === "/login") {
      let body = "";
      req.on("data", (chunk) => { body += chunk.toString(); });
      req.on("end", () => {
        try {
          const { email, password } = JSON.parse(body);

          const user = users.find((u) => u.email === email && u.password === password);
          if (user) {
            const tokens = generateTokens(user.id);

            res.setHeader(
              "Set-Cookie",
              `refreshToken=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
            );

            return sendJSON(200, {
              accessToken: tokens.accessToken,
              user: { id: user.id, username: user.username, email: user.email },
              message: "Login successful"
            });
          }

          return sendError(401, "INVALID_CREDENTIALS", "Invalid email or password");
        } catch {
          return sendError(400, "INVALID_JSON", "Invalid JSON request body");
        }
      });
      return;
    }

    const parseCookies = (cookieHeader) => {
      const list = {};
      if (!cookieHeader) return list;

      cookieHeader.split(";").forEach((cookie) => {
        let [name, ...rest] = cookie.split("=");
        name = name?.trim();
        if (!name) return;
        const value = rest.join("=").trim();
        list[name] = decodeURIComponent(value);
      });

      return list;
    };

    // POST /refresh
    if (method === "POST" && path === "/refresh") {
      const cookies = parseCookies(req.headers.cookie);
      const refreshToken = cookies.refreshToken;

      if (!refreshToken) {
        return sendError(400, "REFRESH_TOKEN_MISSING", "Refresh token cookie is required");
      }

      const tokenData = activeRefreshTokens.get(refreshToken);

      if (!tokenData) {
        return sendError(401, "REFRESH_TOKEN_INVALID", "Invalid refresh token");
      }

      if (Date.now() > tokenData.expiresAt) {
        activeRefreshTokens.delete(refreshToken);
        return sendError(401, "REFRESH_TOKEN_EXPIRED", "Refresh token expired, please log in again");
      }

      const user = users.find((u) => String(u.id) === String(tokenData.userId));

      if (!user) {
        return sendError(404, "USER_NOT_FOUND", "User associated with token not found");
      }

      const newAccessToken = `access-token-${tokenData.userId}-${Date.now()}`;
      activeAccessTokens.set(newAccessToken, {
        userId: tokenData.userId,
        expiresAt: Date.now() + ACCESS_TOKEN_EXPIRATION_MS
      });

      const { password, ...sanitizedUser } = user;

      return sendJSON(200, {
        accessToken: newAccessToken,
        user: sanitizedUser,
        message: "Token refreshed successfully"
      });
    }

    // POST /logout
    if (method === "POST" && path === "/logout") {
      const cookies = parseCookies(req.headers.cookie);
      const refreshToken = cookies.refreshToken;

      if (refreshToken) {
        activeRefreshTokens.delete(refreshToken);
      }

      const authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const accessToken = authHeader.split(" ")[1];
        activeAccessTokens.delete(accessToken);
      }

      res.setHeader(
        "Set-Cookie",
        `refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
      );

      return sendJSON(200, { message: "Logged out successfully" });
    }

    // GET /users or GET /users/ (PUBLIC)
    if (method === "GET" && (path === "/users" || path === "/users/")) {
      const sanitizedUsers = users.map(({ password, ...user }) => user);

      const limitParam = searchParams.get("limit");
      if (limitParam !== null) {
        const limit = Number(limitParam);
        if (!isNaN(limit) && limit >= 0) {
          return sendJSON(200, sanitizedUsers.slice(0, limit));
        }
      }

      return sendJSON(200, sanitizedUsers);
    }

    // GET /users/:id (PUBLIC)
    if (method === "GET" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      if (!id) return sendError(400, "INVALID_ID", "ID parameter must be provided");

      const user = users.find((u) => String(u.id) === String(id));
      if (!user) return sendError(404, "USER_NOT_FOUND", "User not found");

      const { password, ...sanitizedUser } = user;
      return sendJSON(200, sanitizedUser);
    }

    // POST /users
    if (method === "POST" && (path === "/users" || path === "/users/")) {
      let body = "";
      req.on("data", (chunk) => { body += chunk.toString(); });
      req.on("end", () => {
        try {
          const { username, email, password } = JSON.parse(body);

          if (!username || !email || !password) {
            return sendError(400, "MISSING_FIELDS", "Username, email, and password are required");
          }

          const existingUser = users.find((u) => u.email === email);
          if (existingUser) {
            return sendError(409, "DUPLICATE_EMAIL", "Email address is already in use");
          }

          const newUser = { id: crypto.randomUUID(), username, email, password };
          users.push(newUser);

          const { password: _, ...sanitizedUser } = newUser;
          return sendJSON(201, {
            user: sanitizedUser,
            message: "User created successfully"
          });
        } catch {
          return sendError(400, "INVALID_JSON", "Invalid JSON request body");
        }
      });
      return;
    }

    // PATCH /users/:id
    if (method === "PATCH" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      if (!id) return sendError(400, "INVALID_ID", "ID parameter must be provided");

      let body = "";
      req.on("data", (chunk) => { body += chunk.toString(); });
      req.on("end", () => {
        const user = users.find((u) => String(u.id) === String(id));
        if (!user) return sendError(404, "USER_NOT_FOUND", "User not found");

        try {
          const parsed = JSON.parse(body);

          if (parsed.email && parsed.email !== user.email) {
            const duplicate = users.find((u) => u.email === parsed.email);
            if (duplicate) {
              return sendError(409, "DUPLICATE_EMAIL", "Email address is already in use");
            }
          }

          Object.assign(user, parsed);

          const { password: _, ...sanitizedUser } = user;
          return sendJSON(200, {
            user: sanitizedUser,
            message: "User updated successfully"
          });
        } catch {
          return sendError(400, "INVALID_JSON", "Invalid JSON request body");
        }
      });
      return;
    }

    // DELETE /users/:id
    if (method === "DELETE" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      if (!id) return sendError(400, "INVALID_ID", "ID parameter must be provided");

      const index = users.findIndex((u) => String(u.id) === String(id));
      if (index === -1) return sendError(404, "USER_NOT_FOUND", "User not found");

      const [deletedUser] = users.splice(index, 1);

      return sendJSON(200, {
        message: `User ${id} deleted successfully`,
        id: deletedUser.id
      });
    }

    // ==========================================
    // GET /posts & /posts/:id (PUBLIC ENDPOINTS)
    // ==========================================

    // GET /posts or GET /posts/
    if (method === "GET" && (path === "/posts" || path === "/posts/")) {
      const userIdFilter = searchParams.get("userId");
      const searchQuery = searchParams.get("q")?.toLowerCase() ?? "";

      let filteredPosts = [...posts];

      if (userIdFilter) {
        filteredPosts = filteredPosts.filter((p) => String(p.userId) === String(userIdFilter));
      }

      if (searchQuery) {
        filteredPosts = filteredPosts.filter(
          (p) => p.title.toLowerCase().includes(searchQuery) || p.content.toLowerCase().includes(searchQuery)
        );
      }

      const page = Number(searchParams.get("page") ?? 1);
      const limit = Number(searchParams.get("limit") ?? 100);

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / limit) || 1;

      return sendJSON(200, {
        data: paginatedPosts,
        total,
        page,
        limit,
        totalPages,
      });
    }

    // GET /posts/:id
    if (method === "GET" && path.startsWith("/posts/")) {
      const id = path.split("/")[2];
      if (!id) return sendError(400, "INVALID_ID", "ID parameter must be provided");

      const post = posts.find((p) => String(p.id) === String(id));
      if (!post) return sendError(404, "POST_NOT_FOUND", "Post not found");

      return sendJSON(200, post);
    }

    // ==========================================
    // AUTH GUARD FOR PROTECTED ENDPOINTS (TASKS)
    // ==========================================
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(401, "TOKEN_MISSING", "Authentication required: Missing or invalid token format");
    }

    const token = authHeader.split(" ")[1];
    const tokenData = activeAccessTokens.get(token);

    if (!tokenData) {
      return sendError(401, "TOKEN_INVALID", "Invalid access token");
    }

    if (Date.now() > tokenData.expiresAt) {
      activeAccessTokens.delete(token);
      return sendError(401, "TOKEN_EXPIRED", "Session expired, access token has expired");
    }

    const currentUserId = tokenData.userId;

    // GET /tasks
    if (method === "GET" && (path === "/tasks" || path === "/tasks/")) {
      const statusFilter = searchParams.get("status");
      const searchQuery = searchParams.get("q")?.toLowerCase() ?? "";

      let filteredTasks = tasks.filter((t) => String(t.userId) === String(currentUserId));

      if (statusFilter === "completed") {
        filteredTasks = filteredTasks.filter((t) => t.done === true);
      } else if (statusFilter === "pending") {
        filteredTasks = filteredTasks.filter((t) => t.done === false);
      }

      if (searchQuery) {
        filteredTasks = filteredTasks.filter((t) =>
          t.title.toLowerCase().includes(searchQuery)
        );
      }

      const page = Number(searchParams.get("page") ?? 1);
      const limit = Number(searchParams.get("limit") ?? 100);

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
      const total = filteredTasks.length;
      const totalPages = Math.ceil(total / limit) || 1;

      return sendJSON(200, {
        data: paginatedTasks,
        total,
        page,
        limit,
        totalPages,
      });
    }

    // POST /tasks
    if (method === "POST" && (path === "/tasks" || path === "/tasks/")) {
      let body = "";
      req.on("data", (chunk) => { body += chunk.toString(); });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          if (!parsed.title) return sendError(400, "MISSING_TITLE", "Task title is required");

          const newTask = {
            id: crypto.randomUUID(),
            userId: currentUserId,
            title: parsed.title,
            done: false
          };
          tasks.push(newTask);
          return sendJSON(201, newTask);
        } catch {
          return sendError(400, "INVALID_JSON", "Invalid JSON request body");
        }
      });
      return;
    }

    // PATCH /tasks/:id
    if (method === "PATCH" && path.startsWith("/tasks/")) {
      const id = path.split("/")[2];
      if (!id) return sendError(400, "INVALID_ID", "ID parameter must be provided");

      let body = "";
      req.on("data", (chunk) => { body += chunk.toString(); });
      req.on("end", () => {
        const task = tasks.find((t) => String(t.id) === String(id) && String(t.userId) === String(currentUserId));
        if (!task) return sendError(404, "TASK_NOT_FOUND", "Task not found or unauthorized access");

        try {
          const parsed = JSON.parse(body);
          Object.assign(task, parsed);
          return sendJSON(200, task);
        } catch {
          return sendError(400, "INVALID_JSON", "Invalid JSON request body");
        }
      });
      return;
    }

    // DELETE /tasks/:id
    if (method === "DELETE" && path.startsWith("/tasks/")) {
      const id = path.split("/")[2];
      if (!id) return sendError(400, "INVALID_ID", "ID parameter must be provided");

      const index = tasks.findIndex((t) => String(t.id) === String(id) && String(t.userId) === String(currentUserId));
      if (index === -1) return sendError(404, "TASK_NOT_FOUND", "Task not found or unauthorized access");

      tasks.splice(index, 1);
      return sendJSON(200, { message: `Task ${id} deleted` });
    }

    return sendError(404, "ENDPOINT_NOT_FOUND", "Unknown API endpoint");
  }, delayMs);
});

server.listen(3000, () => {
  console.log("API running at http://localhost:3000");
});