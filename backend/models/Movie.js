import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating must be at most 10'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    genre: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      trim: true,
    },
    cast: {
      type: [String],
      default: [],
    },
   poster: {
  type: String,
  trim: true,
},

    imdbId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ rating: -1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ duration: 1 });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;



