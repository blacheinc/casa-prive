// app/api/members/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fullName, email, phone, profession, interest, membershipType, status } = body;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // If email is changing, check it's not taken by another member
    if (email && email !== existing.email) {
      const emailTaken = await prisma.member.findUnique({ where: { email } });
      if (emailTaken) {
        return NextResponse.json({ error: 'Email already in use by another member' }, { status: 400 });
      }
    }

    const data: Record<string, unknown> = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone || null;
    if (profession !== undefined) data.profession = profession || null;
    if (interest !== undefined) data.interest = interest || null;
    if (membershipType === 'PREMIUM' || membershipType === 'STANDARD') data.membershipType = membershipType;
    if (status === 'ACTIVE' || status === 'EXPIRED' || status === 'SUSPENDED') data.status = status;

    const member = await prisma.member.update({ where: { id }, data });

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await prisma.member.delete({ where: { id } });

    return NextResponse.json({ success: true, message: `Member ${existing.fullName} deleted` });
  } catch (error) {
    console.error('Delete member error:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
