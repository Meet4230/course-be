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

router.post("/user", requireUser, getCoursesByUserHandler);

router.put("/:courseId", requireUser, updateCourseHandler);

router.get("/:courseId", requireUser, getCourseHandler);

router.delete("/:courseId", requireUser, deleteCourseHandler);

export default router;
