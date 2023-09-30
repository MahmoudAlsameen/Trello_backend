import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fName:{
      type: String,
      required: true
    },lName:{
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: Number,
    gender: String,
    phone: String,
    isVerified: {type: Boolean, required:true},
    createdTasks:[{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task'
    }],
    assignedTasks:[{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task'
    }],
    isLogout: Boolean,
    isDeleted:{type: Boolean, required:true}
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
