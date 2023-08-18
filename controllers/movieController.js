import movieModel from '../databases/models/movieModel.js';
import cloudinary from '../utils/cloudinary.js';
import responseHelper from '../helpers/responseHelper.js';

const movieController = {
  getMovies: async (req, res) => {
    try {
      const movies = await movieModel.find();
      responseHelper(res, 200, movies, 'Movies retrieved successfully');
    } catch (error) {
      responseHelper(res, 500);
    }
  },

  getMovie: async (req, res) => {
    const { title } = req.params;
    try {
      const movie = await movieModel.findOne({ title });
      if (!movie) return responseHelper(res, 400, '', 'Movie not found');
      responseHelper(res, 200, movie, 'Movie retrieved successfully');
    } catch (error) {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },

  createMovie: async (req, res) => {
    const { title, year, genre, desc } = req.body;
    const photoUrl = await cloudinary.uploader.upload(req.file.path);
    try {
      const movie = new movieModel({
        title,
        year,
        genre,
        desc,
        photo: photoUrl.secure_url,
        cloudinary_id: photoUrl.public_id,
      });
      const newMovie = await movie.save();
      responseHelper(res, 200, newMovie, 'Movie added successfully');
    } catch (error) {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },

  editMovie: async (req, res) => {
    const { id } = req.params;
    const { title, year, genre, desc } = req.body;
    try {
      let beforeMovie = await movieModel.findById(id);
      if (!beforeMovie) return responseHelper(res, 400, '', 'Movie not found');

      if (beforeMovie.cloudinary_id) {
        await cloudinary.uploader.destroy(beforeMovie.cloudinary_id);
      }

      let newFile;
      if (req.file) {
        newFile = await cloudinary.uploader.upload(req.file.path);
      }

      //   const photoUrl = await cloudinary.uploader.upload(req.file.path);

      const data = {
        title: title || beforeMovie.title,
        year: year || beforeMovie.year,
        genre: genre || beforeMovie.genre,
        desc: desc || beforeMovie.desc,
        photo: newFile?.secure_url || beforeMovie.photo,
        cloudinary_id: newFile?.public_id || beforeMovie.cloudinary_id,
      };

      const movie = await movieModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      responseHelper(res, 200, movie, 'Movie updated successfully');
    } catch {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },

  deleteMovie: async (req, res) => {
    const { id } = req.params;
    try {
      let movie = await movieModel.findById(id);
      if (!movie) return responseHelper(res, 400, '', 'Movie not found');
      if (movie.cloudinary_id) {
        await cloudinary.uploader.destroy(movie.cloudinary_id);
      }
      await movieModel.findByIdAndDelete(id);
      responseHelper(res, 200, movie, 'Movie deleted successfully');
    } catch {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },
};

export default movieController;
