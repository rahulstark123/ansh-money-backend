import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import * as z from 'zod';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = signupSchema.parse(body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), name, email },
    });
    return NextResponse.json({ message: 'User created', user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}
