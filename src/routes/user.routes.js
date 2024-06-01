import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
  googleOauthHandler,
} from "./controller/session.controller";
import {
  createUserHandler,
  getCurrentUser,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";

const routes = (app) => {
  app.get("/healthcheck", (req, res) => res.sendStatus(200));

  app.post("/api/users", createUserHandler);

  app.get("/api/me", requireUser, getCurrentUser);

  app.post("/api/sessions", createUserSessionHandler);

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  app.get("/api/sessions/oauth/google", googleOauthHandler);
};

export default routes;
