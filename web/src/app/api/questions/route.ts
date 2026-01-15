import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { enabled: true },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// Get random questions for verification exam
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = body.count || 10;

    const questions = await prisma.question.findMany({
      where: { 
        enabled: true,
        type: 'SHORT_ANSWER',
      },
      select: {
        id: true,
        content: true,
        type: true,
        options: true,
        category: {
          select: { name: true },
        },
      },
    });

    // Shuffle and select random questions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, questions.length));

    return NextResponse.json(selected);
  } catch (error) {
    console.error('Error fetching random questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
