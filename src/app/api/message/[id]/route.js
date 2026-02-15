import { NextResponse } from 'next/server';
import Message from '@/providers/database/Message';
import dbConnect from '@/lib/mongodb';


export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const message = await Message.findById(id);
    if (!message) {
      return new NextResponse('Message not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', message.contentType);
    headers.set('Content-Length', message.content.length);

    return new NextResponse(message.content, { status: 200, headers });
  } catch (error) {
    console.error('Error fetching message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
