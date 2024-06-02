import { createUser } from "../service/user.service.js";
async function createUserHandler(req, res) {
  try {
    const user = await createUser(req.body);
    return await res.status(201).send(user);
  } catch (e) {
    return res.status(409).send(e.message);
  }
}

async function getCurrentUser(req, res) {
  return res.send(res.locals.user);
}

export { createUserHandler, getCurrentUser };
