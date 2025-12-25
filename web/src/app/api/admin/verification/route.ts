import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const adminRoles = ['REVIEWER', 'SENIOR_REVIEWER', 'SUPERVISOR', 'ADMIN'];

// Get all verification attempts (for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || !adminRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where = status && status !== 'ALL' ? { status: status as 'PENDING' | 'PASSED' | 'FAILED' } : {};

    const [attempts, total] = await Promise.all([
      prisma.verificationAttempt.findMany({
        where,
        include: {
          user: {
            select: { discordId: true, username: true, avatar: true },
          },
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.verificationAttempt.count({ where }),
    ]);

    return NextResponse.json({
      attempts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}

// Review verification (pass/fail)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || !adminRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { attemptId, decision, notes } = body;

    if (!attemptId || !decision || !['PASSED', 'FAILED'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Get the attempt
    const attempt = await prisma.verificationAttempt.findUnique({
      where: { id: attemptId },
      include: { user: true },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'Verification attempt not found' },
        { status: 404 }
      );
    }

    // Check if already decided
    if (attempt.status !== 'PENDING' && attempt.status !== 'IN_REVIEW') {
      // Check if current user can override
      if (session.user.role !== 'SENIOR_REVIEWER' && session.user.role !== 'SUPERVISOR' && session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'This verification has already been decided' },
          { status: 400 }
        );
      }
    }

    // Update the attempt
    const updatedAttempt = await prisma.verificationAttempt.update({
      where: { id: attemptId },
      data: {
        status: decision,
        decidedById: session.user.userId,
        decidedAt: new Date(),
        decisionNotes: notes,
      },
      include: {
        user: true,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: `VERIFICATION_${decision}`,
        userId: session.user.userId,
        details: {
          attemptId,
          targetUserId: attempt.userId,
          notes,
        },
      },
    });

    // TODO: Call Discord bot API to:
    // 1. Update the embed message
    // 2. Assign/remove roles
    // 3. Send DM to user

    return NextResponse.json({
      success: true,
      attempt: updatedAttempt,
    });
  } catch (error) {
    console.error('Error reviewing verification:', error);
    return NextResponse.json(
      { error: 'Failed to review verification' },
      { status: 500 }
    );
  }
}
