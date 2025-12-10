
import express from "express";
import { body, validationResult } from "express-validator";
import Movie from "../models/Movie.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// -------------------- SORTED MOVIES --------------------
router.get("/sorted", async (req, res, next) => {
  try {
    const { sortBy, order = "desc", page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    let sortOption = {};
    switch (sortBy) {
      case "name": sortOption = { title: order === "asc" ? 1 : -1 }; break;
      case "rating": sortOption = { rating: order === "asc" ? 1 : -1 }; break;
      case "releaseDate": sortOption = { releaseDate: order === "asc" ? 1 : -1 }; break;
      case "duration": sortOption = { duration: order === "asc" ? 1 : -1 }; break;
      default: sortOption = { createdAt: -1 };
    }
    const movies = await Movie.find().sort(sortOption).skip(skip).limit(Number(limit));
    const total = await Movie.countDocuments();
    res.json({ success: true, movies, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }});
  } catch (err) { next(err); }
});

// -------------------- GET ALL MOVIES --------------------
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    const movies = await Movie.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Movie.countDocuments();
    res.json({ success: true, movies, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }});
  } catch (err) { next(err); }
});

// -------------------- SEARCH MOVIES (must be before /:id) --------------------
router.get("/search", async (req, res, next) => {
  try {
    const q = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    if (!q || q.trim() === "") {
      return res.json({ success: true, movies: [], pagination: { page, limit, total: 0, pages: 0 }});
    }
    const movies = await Movie.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Movie.countDocuments({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    });
    res.json({ success: true, movies, pagination: { page, limit, total, pages: Math.ceil(total / limit) }});
  } catch (err) { next(err); }
});

// ----------------- ADD MOVIE (Admin only) -----------------
router.post(
  "/",
  authenticate,
  authorize("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("rating").isFloat({ min: 0, max: 10 }).withMessage("Rating must be between 0 and 10"),
    body("releaseDate").isISO8601().withMessage("Valid release date is required"),
    body("duration").isInt({ min: 1 }).withMessage("Duration must be positive")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
      const movie = new Movie(req.body);
      await movie.save();
      res.status(201).json({ success: true, movie });
    } catch (error) { next(error); }
  }
);


// -------------------- UPDATE MOVIE (ADMIN ONLY) --------------------
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      res.json({
        success: true,
        message: "Movie updated successfully",
        movie,
      });
    } catch (err) {
      next(err);
    }
  }
);

// -------------------- GET SINGLE MOVIE (MUST BE LAST) --------------------
router.get("/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ success: true, movie });
  } catch (err) { next(err); }
});

export default router;

// ----------------- ADD MOVIE (Admin only) -----------------
router.post(
  "/",
  authenticate,
  authorize("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("rating").isFloat({ min: 0, max: 10 }).withMessage("Rating must be between 0 and 10"),
    body("releaseDate").isISO8601().withMessage("Valid release date is required"),
    body("duration").isInt({ min: 1 }).withMessage("Duration must be positive"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const movie = new Movie(req.body);
      await movie.save();

      res.status(201).json({
        success: true,
        message: "Movie added successfully",
        movie,
      });
    } catch (err) {
      next(err);
    }
  }
);

// -------------------- DELETE MOVIE (ADMIN ONLY) --------------------
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.id);

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      await Movie.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Movie deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
);
