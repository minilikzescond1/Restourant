import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const items = await query(`
      SELECT 
        id, name, description, price, image_url, category_id,
        is_available, preparation_time, ingredients, allergens
      FROM menu_items 
      ORDER BY category_id, name
    `)

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
  }
}
