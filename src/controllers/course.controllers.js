import mongoose from "mongoose";
import {
  createCourse,
  findCourse,
  findAndUpdateCourse,
  deleteCourse,
} from "../service/course.service.js";
import Course from "../models/course.models.js";

export async function createCourseHandler(req, res) {
  const userId = res.locals.user._id;
  const body = req.body;

  const course = await createCourse({ ...body, user: userId });

  return res.send(course);
}

export async function updateCourseHandler(req, res) {
  const userId = res.locals.user._id;
  const courseId = req.params.courseId;
  const update = req.body;

  const course = await Course.findOne({
    _id: courseId,
  });

  if (!course) {
    return res.sendStatus(404);
  }

  if (String(course.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedCourse = await findAndUpdateCourse(
    { _id: courseId.toString() },
    update,
    {
      new: true,
    }
  );

  return res.send(updatedCourse);
}

export async function getCourseHandler(req, res) {
  const courseId = req.params.id;

  const course = await Course.findOne({
    _id: courseId,
  });
  if (!course) {
    return res.sendStatus(404);
  }

  return res.send(course);
}

export async function deleteCourseHandler(req, res) {
  const userId = res.locals.user._id;
  const courseId = req.params.id;

  const course = await Course.findOne({
    _id: courseId,
  });

  if (!course) {
    return res.sendStatus(404);
  }

  if (String(course.user) !== userId) {
    return res.sendStatus(403);
  }

  const deletedCourseId = await deleteCourse({ _id: courseId.toString() });
  return res.send({ courseId: deletedCourseId._id });
}

export async function getCoursesByUserHandler(req, res) {
  const user = req.params.user;

  try {
    const courses = await findCourse({ user });
    return res.send(courses);
  } catch (error) {
    return res.sendStatus(500);
  }
}
