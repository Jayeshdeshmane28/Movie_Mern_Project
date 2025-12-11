import express from "express";
import { body } from "express-validator";
import {
  getAllMovies,
  getSortedMovies,
  searchMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movieController.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", getAllMovies);
router.get("/sorted", getSortedMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieById);

// Admin
router.post(
  "/",
  authenticate,
  authorize("admin"),
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("rating").isFloat({ min: 0, max: 10 }),
    body("releaseDate").isISO8601(),
    body("duration").isInt({ min: 1 }),
  ],
  addMovie
);

router.put("/:id", authenticate, authorize("admin"), updateMovie);
router.delete("/:id", authenticate, authorize("admin"), deleteMovie);

export default router;
