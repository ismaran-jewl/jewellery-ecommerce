import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
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