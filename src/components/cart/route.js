import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Message from '@/models/Message';

// Ensure DB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const newMessage = await Message.create({
      content: buffer,
      contentType: file.type || (type === 'video' ? 'video/webm' : 'audio/webm'),
    });

    return NextResponse.json({ success: true, id: newMessage._id }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload message' }, { status: 500 });
  }
}