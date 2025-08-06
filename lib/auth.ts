import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: number
  name: string
  email: string
  role: "customer" | "admin" | "staff"
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User
  } catch {
    return null
  }
}

export async function getUserByEmail(email: string) {
  const results = (await query("SELECT id, name, email, password, role FROM users WHERE email = ?", [email])) as any[]
  return results[0] || null
}

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  const result = (await query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
    name,
    email,
    hashedPassword,
  ])) as any
  return result.insertId
}
