import mongoose, { Document, Schema } from 'mongoose';

export enum PostStatus {
  TOLEARN,
  LEARNING,
  LEARNED
}

export interface Post extends Document {
  title: string;
  description?: string;
  status?: number;
  user: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: [PostStatus.TOLEARN, PostStatus.LEARNING, PostStatus.LEARNED],
    required: false,
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
