"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function CartPage() {
  const { state, dispatch } = useCart()
  const { user } = useAuth()
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway" | "delivery">("dine_in")
  const [tableNumber, setTableNumber] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id })
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const updateInstructions = (id: number, instructions: string) => {
    dispatch({ type: "UPDATE_INSTRUCTIONS", payload: { id, instructions } })
  }

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = "/login?redirect=/cart"
      return
    }

    setLoading(true)
    try {
      const orderData = {
        items: state.items,
        total: state.total,
        orderType,
        tableNumber: orderType === "dine_in" ? tableNumber : null,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : null,
        notes,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        dispatch({ type: "CLEAR_CART" })
        window.location.href = `/orders/${order.id}`
      } else {
        throw new Error("Failed to place order")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some delicious items from our menu to get started</p>
          <Button asChild>
            <Link href="/menu">Browse Menu</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Image
                    src={item.image_url || "/placeholder.svg?height=80&width=80"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium px-4">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateQuantity(item.id, 0)}
                        className="ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Special Instructions */}
                    <div className="mt-4">
                      <Label htmlFor={`instructions-${item.id}`} className="text-sm">
                        Special Instructions
                      </Label>
                      <Textarea
                        id={`instructions-${item.id}`}
                        placeholder="Any special requests for this item..."
                        value={item.special_instructions || ""}
                        onChange={(e) => updateInstructions(item.id, e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dine_in" id="dine_in" />
                  <Label htmlFor="dine_in">Dine In</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="takeaway" id="takeaway" />
                  <Label htmlFor="takeaway">Takeaway</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Delivery</Label>
                </div>
              </RadioGroup>

              {orderType === "dine_in" && (
                <div className="mt-4">
                  <Label htmlFor="table">Table Number (Optional)</Label>
                  <input
                    id="table"
                    type="number"
                    placeholder="Table number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
              )}

              {orderType === "delivery" && (
                <div className="mt-4">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special requests or notes for your order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.5%)</span>
                  <span>${(state.total * 0.085).toFixed(2)}</span>
                </div>
                {orderType === "delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>$3.99</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(state.total * 1.085 + (orderType === "delivery" ? 3.99 : 0)).toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleCheckout}
                disabled={loading || (orderType === "delivery" && !deliveryAddress)}
              >
                {loading ? "Processing..." : "Place Order"}
              </Button>

              {!user && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  You'll need to sign in to complete your order
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
