import prisma from "@/lib/prisma";
import { validateNotice } from "@/lib/validateNotice";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return handleList(req, res);
  }
  if (req.method === "POST") {
    return handleCreate(req, res);
  }
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

// GET /api/notices - list all notices, Urgent first, then newest publishDate first.
// The ordering is done entirely in the database via Prisma's orderBy.
async function handleList(req, res) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        { priority: "desc" }, // "Urgent" > "Normal" alphabetically -> Urgent first
        { publishDate: "desc" },
      ],
    });
    return res.status(200).json(notices);
  } catch (err) {
    console.error("GET /api/notices failed:", err);
    return res.status(500).json({ error: "Failed to load notices." });
  }
}

// POST /api/notices - create a new notice.
async function handleCreate(req, res) {
  const result = validateNotice(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: "Validation failed.", fields: result.errors });
  }

  try {
    const notice = await prisma.notice.create({ data: result.data });
    return res.status(201).json(notice);
  } catch (err) {
    console.error("POST /api/notices failed:", err);
    return res.status(500).json({ error: "Failed to create notice." });
  }
}
