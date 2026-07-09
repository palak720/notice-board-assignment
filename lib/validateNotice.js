// Server-side validation for Notice payloads.
// This runs inside the API routes (pages/api/notices/*) and is the
// source of truth — the browser form also validates for a better UX,
// but nothing here trusts the client.

export const CATEGORIES = ["Exam", "Event", "General"];
export const PRIORITIES = ["Normal", "Urgent"];

const TITLE_MAX = 200;
const BODY_MAX = 5000;
// ~4MB base64 image cap, comfortably under Vercel's serverless body limit.
const IMAGE_MAX_CHARS = 4 * 1024 * 1024 * 1.4;

/**
 * Validate a notice payload coming from the client.
 * Returns { valid: true, data } with cleaned data, or
 * { valid: false, errors } with a field -> message map.
 */
export function validateNotice(body) {
  const errors = {};
  const data = {};

  if (typeof body !== "object" || body === null) {
    return { valid: false, errors: { _: "Request body must be a JSON object." } };
  }

  // title
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > TITLE_MAX) {
    errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
  } else {
    data.title = title;
  }

  // body
  const noticeBody = typeof body.body === "string" ? body.body.trim() : "";
  if (!noticeBody) {
    errors.body = "Body is required.";
  } else if (noticeBody.length > BODY_MAX) {
    errors.body = `Body must be ${BODY_MAX} characters or fewer.`;
  } else {
    data.body = noticeBody;
  }

  // category
  if (!CATEGORIES.includes(body.category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(", ")}.`;
  } else {
    data.category = body.category;
  }

  // priority
  if (!PRIORITIES.includes(body.priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(", ")}.`;
  } else {
    data.priority = body.priority;
  }

  // publishDate
  const parsedDate = new Date(body.publishDate);
  if (!body.publishDate || Number.isNaN(parsedDate.getTime())) {
    errors.publishDate = "A valid publish date is required.";
  } else {
    data.publishDate = parsedDate;
  }

  // image (optional)
  if (body.image !== undefined && body.image !== null && body.image !== "") {
    if (typeof body.image !== "string") {
      errors.image = "Image must be a string (data URL).";
    } else if (body.image.length > IMAGE_MAX_CHARS) {
      errors.image = "Image is too large. Please use an image under ~3MB.";
    } else if (!/^data:image\/(png|jpe?g|gif|webp);base64,/.test(body.image)) {
      errors.image = "Image must be a PNG, JPEG, GIF or WEBP file.";
    } else {
      data.image = body.image;
    }
  } else {
    data.image = null;
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }
  return { valid: true, data };
}
