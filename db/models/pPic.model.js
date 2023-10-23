import mongoose from 'mongoose';

const pPicSchema = new mongoose.Schema({
  pic: {
    type: Buffer,
    required: true,
  },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{
  timestamps: true,
});

const pPicModel = mongoose.model('PPic', pPicSchema);

export default pPicModel;
