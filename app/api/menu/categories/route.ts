import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const categories = await query(
      "SELECT id, name, description, image_url FROM categories WHERE is_active = TRUE ORDER BY name",
    )

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
