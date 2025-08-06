import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const userId = await createUser(name, email, password)

    const token = generateToken({
      id: userId,
      name,
      email,
      role: "customer",
    })

    return NextResponse.json({
      token,
      user: {
        id: userId,
        name,
        email,
        role: "customer",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
