import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { items, total, orderType, tableNumber, deliveryAddress, notes } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 })
    }

    // Calculate total with tax and delivery fee
    const tax = total * 0.085
    const deliveryFee = orderType === "delivery" ? 3.99 : 0
    const finalTotal = total + tax + deliveryFee

    // Create order
    const orderResult = (await query(
      `
      INSERT INTO orders (user_id, total_amount, status, order_type, table_number, delivery_address, notes, estimated_time)
      VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)
    `,
      [user.id, finalTotal, orderType, tableNumber, deliveryAddress, notes, 30],
    )) as any

    const orderId = orderResult.insertId

    // Add order items
    for (const item of items) {
      await query(
        `
        INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, special_instructions)
        VALUES (?, ?, ?, ?, ?)
      `,
        [orderId, item.id, item.quantity, item.price, item.special_instructions],
      )
    }

    return NextResponse.json({
      id: orderId,
      message: "Order placed successfully",
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const orders = await query(
      `
      SELECT 
        o.id, o.total_amount, o.status, o.order_type, o.table_number,
        o.delivery_address, o.notes, o.estimated_time, o.created_at,
        GROUP_CONCAT(
          CONCAT(oi.quantity, 'x ', mi.name) 
          ORDER BY mi.name 
          SEPARATOR ', '
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `,
      [user.id],
    )

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
