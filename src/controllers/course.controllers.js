import {
  createCourse,
  findCourse,
  findAndUpdateCourse,
  deleteCourse,
} from "../service/course.service.js";

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

  const course = await findCourse({ courseId });

  if (!course) {
    return res.sendStatus(404);
  }

  if (String(course.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedCourse = await findAndUpdateCourse({ courseId }, update, {
    new: true,
  });

  return res.send(updatedCourse);
}

export async function getCourseHandler(req, res) {
  const courseId = req.params.courseId;
  const course = await findCourse({ courseId });

  if (!course) {
    return res.sendStatus(404);
  }

  return res.send(course);
}

export async function deleteCourseHandler(req, res) {
  const userId = res.locals.user._id;
  const courseId = req.params.courseId;

  const course = await findCourse({ courseId });

  if (!course) {
    return res.sendStatus(404);
  }

  if (String(course.user) !== userId) {
    return res.sendStatus(403);
  }

  await deleteCourse({ courseId });

  return res.sendStatus(200);
}

export async function getCoursesByUserHandler(req, res) {
  const userId = res.locals.user._id;

  try {
    const courses = await findCourse({ user: userId });
    return res.send(courses);
  } catch (error) {
    console.error("Error fetching courses by user:", error);
    return res.sendStatus(500);
  }
}
