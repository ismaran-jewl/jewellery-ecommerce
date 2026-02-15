import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth"; // Using your reference
import dbConnect from '@/lib/mongodb';
import Message from '@/providers/database/Message';

export async function POST(request) {
  try {
    // 1. Get session using your reference style
    const session = await auth();
    
    // 2. Validate session (No role check needed unless messages are user-specific)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 3. Create message with session.user.id
    const newMessage = await Message.create({
      sender: session.user.id, // Linking the user ID here
      content: buffer,
      contentType: file.type || (type === 'video' ? 'video/webm' : 'audio/webm'),
    });

    return NextResponse.json({ success: true, id: newMessage._id }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload message' }, { status: 500 });
  }
}