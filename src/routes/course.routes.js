import { Router } from "express";
import {
  createCourseHandler,
  updateCourseHandler,
  getCourseHandler,
  deleteCourseHandler,
  getCoursesByUserHandler,
} from "../controllers/course.controllers.js";

import requireUser from "../middlewares/requireUser.middleware.js";

const router = Router();

router.post("/", requireUser, createCourseHandler);

router.get("/:user", requireUser, getCoursesByUserHandler);

router.put("/:courseId", requireUser, updateCourseHandler);

router.get("/courseId/:id", requireUser, getCourseHandler);

router.delete("/courseId/:id", requireUser, deleteCourseHandler);

export default router;
