// import Queue from 'bull';
// import Movie from '../models/Movie.js';

// // Create a queue for movie operations
// const movieQueue = new Queue('movie operations', {
//   redis: {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: process.env.REDIS_PORT || 6379,
//   },
// });

// // Process queue jobs
// movieQueue.process('insert-movie', async (job) => {
//   try {
//     const movieData = job.data;
//     const movie = new Movie(movieData);
//     await movie.save();
//     console.log(`Movie ${movie.title} inserted successfully`);
//     return { success: true, movieId: movie._id };
//   } catch (error) {
//     console.error('Error processing movie insertion:', error);
//     throw error;
//   }
// });

// movieQueue.process('update-movie', async (job) => {
//   try {
//     const { movieId, updateData } = job.data;
//     const movie = await Movie.findByIdAndUpdate(movieId, updateData, {
//       new: true,
//       runValidators: true,
//     });
//     if (!movie) {
//       throw new Error('Movie not found');
//     }
//     console.log(`Movie ${movie.title} updated successfully`);
//     return { success: true, movie };
//   } catch (error) {
//     console.error('Error processing movie update:', error);
//     throw error;
//   }
// });

// movieQueue.process('delete-movie', async (job) => {
//   try {
//     const { movieId } = job.data;
//     const movie = await Movie.findByIdAndDelete(movieId);
//     if (!movie) {
//       throw new Error('Movie not found');
//     }
//     console.log(`Movie ${movie.title} deleted successfully`);
//     return { success: true };
//   } catch (error) {
//     console.error('Error processing movie deletion:', error);
//     throw error;
//   }
// });

// // Handle job completion
// movieQueue.on('completed', (job, result) => {
//   console.log(`Job ${job.id} completed:`, result);
// });

// // Handle job failure
// movieQueue.on('failed', (job, err) => {
//   console.error(`Job ${job.id} failed:`, err);
// });

// export default movieQueue;



