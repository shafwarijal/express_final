import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: String, required: true },
  genre: { type: String, required: true },
  desc: { type: String, required: true },
  photo: { type: String, required: true },
  cloudinary_id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const movieModel = mongoose.model('Movie', MovieSchema);

export default movieModel;
