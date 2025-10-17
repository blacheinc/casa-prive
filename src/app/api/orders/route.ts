/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/orders/route.ts - FIXED TYPE ERROR
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paystack } from '@/lib/paystack';
import { googleSheets } from '@/lib/sheets';
import { emailService } from '@/lib/email';
import { format } from 'date-fns';
import { OrderStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      tableNumberOrName,
      items, // Array of { menuItemId, quantity, notes }
      paymentMethod,
      email,
    } = body;

    if (!customerName || !tableNumberOrName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menuItemId} not found` },
          { status: 404 }
        );
      }

      if (!menuItem.isAvailable) {
        return NextResponse.json(
          { error: `${menuItem.name} is currently unavailable` },
          { status: 400 }
        );
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItemId: menuItem.id,
        quantity: item.quantity,
        price: itemTotal,
        notes: item.notes,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName,
        tableNumberOrName,
        paymentMethod,
        totalAmount,
        paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING',
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // If Paystack, initialize payment
    if (paymentMethod === 'PAYSTACK' && email) {
      const paymentResponse = await paystack.initializeTransaction(
        email,
        totalAmount,
        order.id,
        {
          orderId: order.id,
          customerName,
          type: 'order',
        }
      );

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentReference: paymentResponse.data.reference },
      });

      return NextResponse.json({
        order,
        paymentUrl: paymentResponse.data.authorization_url,
      });
    }

    // Log to Google Sheets
    try {
      await googleSheets.logOrder({
        id: order.id,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        customerName: order.customerName,
        tableNumberOrName: order.tableNumberOrName,
        items: order.items.map((item: { menuItem: { name: any; }; quantity: any; price: any; }) => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      });
    } catch (error) {
      console.error('Google Sheets logging failed:', error);
    }

    // Send email notification
    if (email) {
      try {
        await emailService.sendOrderConfirmation(email, {
          id: order.id,
          customerName: order.customerName,
          tableNumberOrName: order.tableNumberOrName,
          items: order.items.map((item: { menuItem: { name: any; }; quantity: any; price: any; }) => ({
            name: item.menuItem.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: order.totalAmount,
        });
      } catch (error) {
        console.error('Email sending failed:', error);
      }
    }

    // Notify admin
    try {
      const itemsList = order.items
        .map((item: { menuItem: { name: any; }; quantity: any; }) => `${item.menuItem.name} x${item.quantity}`)
        .join(', ');
      
      await emailService.sendAdminNotification(
        'New Order Received',
        `
          <h2>New Order</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Table:</strong> ${tableNumberOrName}</p>
          <p><strong>Items:</strong> ${itemsList}</p>
          <p><strong>Total:</strong> GHS ${totalAmount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        `
      );
    } catch (error) {
      console.error('Admin notification failed:', error);
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    // FIXED: Validate status parameter against OrderStatus enum
    const validStatuses: OrderStatus[] = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'];
    
    let where = {};
    if (statusParam && validStatuses.includes(statusParam as OrderStatus)) {
      where = { status: statusParam as OrderStatus };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}