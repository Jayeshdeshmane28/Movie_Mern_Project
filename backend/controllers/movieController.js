import { validationResult } from "express-validator";
import Movie from "../models/Movie.js";

// -------------------- GET ALL --------------------
export const getAllMovies = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Movie.countDocuments();

    res.json({
      success: true,
      movies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- SORTED --------------------
export const getSortedMovies = async (req, res, next) => {
  try {
    const { sortBy, order = "desc", page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    let sortOption = {};
    switch (sortBy) {
      case "name":
        sortOption = { title: order === "asc" ? 1 : -1 };
        break;
      case "rating":
        sortOption = { rating: order === "asc" ? 1 : -1 };
        break;
      case "releaseDate":
        sortOption = { releaseDate: order === "asc" ? 1 : -1 };
        break;
      case "duration":
        sortOption = { duration: order === "asc" ? 1 : -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const movies = await Movie.find()
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Movie.countDocuments();

    res.json({
      success: true,
      movies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- SEARCH --------------------
export const searchMovies = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    if (!q.trim()) {
      return res.json({
        success: true,
        movies: [],
        pagination: { page, limit, total: 0, pages: 0 },
      });
    }

    const filter = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    };

    const movies = await Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments(filter);

    res.json({
      success: true,
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// -------------------- GET BY ID --------------------
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json({ success: true, movie });
  } catch (err) {
    next(err);
  }
};

// -------------------- ADD MOVIE --------------------
export const addMovie = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

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
};

// -------------------- UPDATE MOVIE --------------------
export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie)
      return res.status(404).json({ message: "Movie not found" });

    res.json({ success: true, message: "Movie updated", movie });
  } catch (err) {
    next(err);
  }
};

// -------------------- DELETE MOVIE --------------------
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).json({ message: "Movie not found" });

    await Movie.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Movie deleted" });
  } catch (err) {
    next(err);
  }
};
