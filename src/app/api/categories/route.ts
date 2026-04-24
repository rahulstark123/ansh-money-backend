import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

const categorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
  monthlyBudget: z.number().default(0),
  wid: z.number(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wid = searchParams.get('wid');

    console.log('Fetching categories for WID:', wid);

    if (!wid) {
      return NextResponse.json({ message: 'wid is required' }, { status: 400 });
    }

    const categories = await prisma.category.findMany({
      where: { wid: parseInt(wid) },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('CRITICAL ERROR in Categories GET API:', error.message);
    return NextResponse.json({ 
      message: 'Internal Server Error', 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    console.log('Creating category for WID:', validatedData.wid);

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        icon: validatedData.icon,
        color: validatedData.color,
        monthlyBudget: validatedData.monthlyBudget,
        wid: validatedData.wid,
      },
    });

    return NextResponse.json({ message: 'Category created', category }, { status: 201 });
  } catch (error: any) {
    console.error('CRITICAL ERROR in Categories POST API:', error.message);
    return NextResponse.json({ 
      message: 'Error creating category', 
      error: error.message 
    }, { status: 500 });
  }
}
