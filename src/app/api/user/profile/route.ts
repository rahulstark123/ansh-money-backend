import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('Fetching profile for userId:', userId);

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        wid: true,
        name: true,
        email: true,
      }
    });

    if (!user) {
      console.log('User not found in database:', userId);
      return NextResponse.json({ message: 'User not found in database. Make sure the sync trigger worked.' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('CRITICAL ERROR in Profile API:', error.message);
    return NextResponse.json({ 
      message: 'Internal Server Error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
