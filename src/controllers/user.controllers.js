import { createUser } from "../service/user.service";
async function createUserHandler(req, res) {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e) {
    return res.status(409).send(e.message);
  }
}

async function getCurrentUser(req, res) {
  return res.send(res.locals.user);
}

export { createUserHandler, getCurrentUser };
