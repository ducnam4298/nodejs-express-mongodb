import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export enum PostStatus {
  TOLEARN,
  LEARNING,
  LEARNED
}

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: [PostStatus.TOLEARN, PostStatus.LEARNING, PostStatus.LEARNED]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('posts', PostSchema);
