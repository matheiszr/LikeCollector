import * as mongoose from 'mongoose';

var SALT_WORK_FACTOR = 10;

export interface IPicture extends mongoose.Document {
  id: number;
  likes: number;
  image: string;
};

export const PictureSchema = new mongoose.Schema({
    id:  Number,
    likes: Number,
    image: String
}, { collection: 'pictures' });

export const Picture: mongoose.model<IPicture> = mongoose.model<IPicture>('Picture', PictureSchema);