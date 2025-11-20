import connectDb from "../src/db/db.js";
import songModel from "../src/models/song.model.js";

export default async function handler(req, res) {
  await connectDb();

  if (req.method === "GET") {
    const { mood } = req.query;
    const songs = await songModel.find({ mood: mood.toLowerCase() });
    return res.status(200).json({ songs });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
