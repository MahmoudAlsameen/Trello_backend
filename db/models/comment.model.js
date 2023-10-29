import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  creatorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskID: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  text: String
},
{
  timestamps: true,
});

const commentModel = mongoose.model('Comment', commentSchema);

export default commentModel;
