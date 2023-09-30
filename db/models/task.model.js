import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['toDo', 'doing', 'done'] },
  creatorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline: Date,
});

const taskModel = mongoose.model('Task', taskSchema);

export default taskModel;
