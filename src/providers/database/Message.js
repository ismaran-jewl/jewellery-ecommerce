import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  // New field to link the user
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This must match the name of your User model
    required: true,
  },
  content: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String, // 'audio/webm' or 'video/webm'
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);