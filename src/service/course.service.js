import Course from "../models/course.models.js";

export async function createCourse(input) {
  return Course.create(input);
}

export async function findCourse(query, options = { lean: true }) {
  return Course.findOne(query, {}, options);
}

export async function findAndUpdateCourse(query, update, options) {
  return Course.findOneAndUpdate(query, update, options);
}

export async function deleteCourse(query) {
  return Course.deleteOne(query);
}
