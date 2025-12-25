import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Submit verification attempt
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { answers, integrityFlags } = body;

    // Check if user is blacklisted
    const blacklisted = await prisma.blacklist.findUnique({
      where: { discordId: session.user.discordId },
    });

    if (blacklisted) {
      if (blacklisted.isPermanent || (blacklisted.expiresAt && new Date(blacklisted.expiresAt) > new Date())) {
        return NextResponse.json(
          { error: 'You are blacklisted from verification' },
          { status: 403 }
        );
      }
    }

    // Check for pending verification
    const pendingVerification = await prisma.verificationAttempt.findFirst({
      where: {
        userId: session.user.userId,
        status: { in: ['PENDING', 'IN_REVIEW'] },
      },
    });

    if (pendingVerification) {
      return NextResponse.json(
        { error: 'You already have a pending verification' },
        { status: 400 }
      );
    }

    // Create verification attempt
    const attempt = await prisma.verificationAttempt.create({
      data: {
        userId: session.user.userId,
        copyPasteCount: integrityFlags?.copyPasteCount || 0,
        tabSwitchCount: integrityFlags?.tabSwitchCount || 0,
        suspiciousFlags: integrityFlags,
        answers: {
          create: answers.map((answer: { questionId: string; answer: string }) => ({
            questionId: answer.questionId,
            answer: answer.answer,
          })),
        },
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
        user: true,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'VERIFICATION_SUBMITTED',
        userId: session.user.userId,
        details: {
          attemptId: attempt.id,
          questionsCount: answers.length,
          integrityFlags,
        },
      },
    });

    // Send Discord notification to admin channel via bot API
    if (process.env.BOT_API_URL && process.env.API_SECRET) {
      try {
        await fetch(`${process.env.BOT_API_URL}/api/verification/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-secret': process.env.API_SECRET,
          },
          body: JSON.stringify({
            attemptId: attempt.id,
            user: {
              discordId: attempt.user.discordId,
              username: attempt.user.username,
              avatar: attempt.user.avatar,
            },
            answers: attempt.answers.map(a => ({
              question: a.question.content,
              answer: a.answer,
            })),
            integrityFlags: {
              copyPasteCount: attempt.copyPasteCount,
              tabSwitchCount: attempt.tabSwitchCount,
            },
          }),
        });
      } catch (botError) {
        console.error('Failed to notify Discord bot:', botError);
        // Continue even if bot notification fails
      }
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification' },
      { status: 500 }
    );
  }
}

// Get user's verification history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const attempts = await prisma.verificationAttempt.findMany({
      where: { userId: session.user.userId },
      include: {
        answers: {
          include: {
            question: {
              select: { content: true, type: true },
            },
          },
        },
        decidedBy: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching verification history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification history' },
      { status: 500 }
    );
  }
}
