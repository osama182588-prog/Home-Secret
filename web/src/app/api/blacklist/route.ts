import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const adminRoles = ['SENIOR_REVIEWER', 'SUPERVISOR', 'ADMIN'];

// Get blacklist
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || !adminRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const blacklist = await prisma.blacklist.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(blacklist);
  } catch (error) {
    console.error('Error fetching blacklist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blacklist' },
      { status: 500 }
    );
  }
}

// Add to blacklist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || !adminRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { discordId, reason, isPermanent, expiresAt } = body;

    if (!discordId || !reason) {
      return NextResponse.json(
        { error: 'Discord ID and reason are required' },
        { status: 400 }
      );
    }

    // Check if already blacklisted
    const existing = await prisma.blacklist.findUnique({
      where: { discordId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'User is already blacklisted' },
        { status: 400 }
      );
    }

    const entry = await prisma.blacklist.create({
      data: {
        discordId,
        reason,
        isPermanent: isPermanent ?? true,
        expiresAt: isPermanent ? null : expiresAt ? new Date(expiresAt) : null,
        createdById: session.user.userId,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'BLACKLIST_ADD',
        userId: session.user.userId,
        details: {
          discordId,
          reason,
          isPermanent,
        },
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error adding to blacklist:', error);
    return NextResponse.json(
      { error: 'Failed to add to blacklist' },
      { status: 500 }
    );
  }
}

// Remove from blacklist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || !adminRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Blacklist entry ID is required' },
        { status: 400 }
      );
    }

    const entry = await prisma.blacklist.delete({
      where: { id },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'BLACKLIST_REMOVE',
        userId: session.user.userId,
        details: {
          discordId: entry.discordId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from blacklist:', error);
    return NextResponse.json(
      { error: 'Failed to remove from blacklist' },
      { status: 500 }
    );
  }
}
