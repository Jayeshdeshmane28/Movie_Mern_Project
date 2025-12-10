import mongoose from "mongoose";
import Movie from "./models/Movie.js";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("ERROR: API_KEY not found in .env file");
  process.exit(1);
}

const moviesToAdd = [
  "The Shawshank Redemption",
  "The Dark Knight",
  "Inception",
  "Interstellar",
  "Fight Club",
  "The Godfather",
  "The Godfather Part II",
  "The Matrix",
  "The Prestige",
  "The Social Network",
  "The Lion King",
  "Pulp Fiction",
  "Forrest Gump",
  "The Departed",
  "Gladiator",
  "Saving Private Ryan",
  "The Green Mile",
  "The Dark Knight Rises",
  "Joker",
  "Avengers: Endgame",
  "Avengers: Infinity War",
  "Guardians of the Galaxy",
  "Guardians of the Galaxy Vol. 2",
  "Iron Man",
  "Captain America: Civil War",
  "Spider-Man: No Way Home",
  "Doctor Strange",
  "Black Panther",
  "Thor: Ragnarok",
  "Mad Max: Fury Road",
  "Dune",
  "The Batman",
  "John Wick",
  "John Wick: Chapter 2",
  "John Wick: Chapter 3",
  "Mission: Impossible – Fallout",
  "Top Gun: Maverick",
  "The Revenant",
  "Avatar",
  "Avatar: The Way of Water"
];

async function seedMovies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Movie.deleteMany({});
    console.log(" Old movies removed");

    for (const title of moviesToAdd) {
      const res = await axios.get(
        `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`
      );

      if (res.data.Response === "False") {
        console.log(` Movie not found: ${title}`);
        continue;
      }

      const movie = new Movie({
        title: res.data.Title,
        description: res.data.Plot,
        rating: parseFloat(res.data.imdbRating),
        releaseDate: new Date(res.data.Released),
        duration: parseInt(res.data.Runtime),
        genre: res.data.Genre?.split(",").map(g => g.trim()) || [],
        director: res.data.Director,
        cast: res.data.Actors?.split(",").map(a => a.trim()) || [],
        poster: res.data.Poster,
        imdbId: res.data.imdbID
      });

      await movie.save();
      console.log(` Added: ${movie.title}`);
    }

    console.log(" Movies seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

seedMovies();
