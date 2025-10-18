/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paystack } from "@/lib/paystack";
import { googleSheets } from "@/lib/sheets";
import { emailService } from "@/lib/email";
import { format } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, tableNumberOrName, email, paymentMethod, items } =
      body;

    // Validate required fields
    if (!customerName || !tableNumberOrName || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total amount
    let totalAmount = 0;
    const menuItemIds = items.map((item: any) => item.menuItemId);

    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    const itemsWithPrices = items.map((item: any) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes,
      };
    });

    // Create order in database
    const order = await prisma.order.create({
      data: {
        customerName,
        tableNumberOrName,
        email: email || null,
        paymentMethod,
        paymentStatus: paymentMethod === "CASH" ? "PENDING" : "PENDING",
        totalAmount,
        status: "PENDING",
        items: {
          create: itemsWithPrices,
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

    // If Paystack payment, initialize transaction
    if (paymentMethod === "PAYSTACK") {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || 
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:3000";
      const callbackUrl = `${baseUrl}/api/payment/callback`;

      const paymentResponse = await paystack.initializeTransaction(
        email || "noemail@casaprive.com",
        totalAmount,
        order.id,
        {
          orderId: order.id,
          customerName,
          type: "order",
          callback_url: callbackUrl,
        }
      );

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentReference: paymentResponse.data.reference },
      });

      // Return immediately with payment URL - don't wait for email/sheets
      // Fire off background tasks without blocking
      sendOrderNotifications(order, email).catch((err) =>
        console.error("Background notification error:", err)
      );

      return NextResponse.json({
        order,
        paymentUrl: paymentResponse.data.authorization_url,
      });
    }

    // For cash orders, send response immediately
    const response = NextResponse.json({ order });

    // Send notifications in background (non-blocking)
    sendOrderNotifications(order, email).catch((err) =>
      console.error("Background notification error:", err)
    );

    return response;
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Background function for sending notifications (non-blocking)
async function sendOrderNotifications(order: any, email?: string) {
  // Run all notifications in parallel
  const notifications = [];

  // Send customer email confirmation if email provided
  if (email) {
    const orderData = {
      id: order.id,
      customerName: order.customerName,
      tableNumberOrName: order.tableNumberOrName,
      items: order.items.map((item: any) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: order.totalAmount,
    };

    notifications.push(
      emailService
        .sendOrderConfirmation(email, orderData)
        .catch((err) => console.error("Customer email error:", err))
    );
  }

  // Log to Google Sheets
  notifications.push(
    googleSheets
      .logOrder({
        id: order.id,
        date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        customerName: order.customerName,
        tableNumberOrName: order.tableNumberOrName,
        items: order.items.map(
          (item: { menuItem: { name: any }; quantity: any; price: any }) => ({
            name: item.menuItem.name,
            quantity: item.quantity,
            price: item.price,
          })
        ),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
      })
      .catch((err) => console.error("Sheets error:", err))
  );

  // Notify admin
  notifications.push(
    emailService
      .sendAdminNotification(
        "New Order Received",
        `
        <h2>New Order</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        <p><strong>Table:</strong> ${order.tableNumberOrName}</p>
        <p><strong>Total:</strong> GHS ${order.totalAmount.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <h3>Items:</h3>
        <ul>
          ${order.items
            .map(
              (item: any) =>
                `<li>${item.menuItem.name} x${item.quantity} - GHS ${(
                  item.price * item.quantity
                ).toFixed(2)}</li>`
            )
            .join("")}
        </ul>
      `
      )
      .catch((err) => console.error("Admin email error:", err))
  );

  // Wait for all notifications to complete (but this doesn't block the API response)
  await Promise.allSettled(notifications);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let where = {};
    if (status) {
      where = { status };
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}