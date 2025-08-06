"use client"

import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image_url?: string
  allergens?: string
  preparation_time: number
  is_available: boolean
}

interface MenuItemCardProps {
  item: MenuItem
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { state, dispatch } = useCart()
  const [quantity, setQuantity] = useState(1)

  const cartItem = state.items.find((cartItem) => cartItem.id === item.id)
  const cartQuantity = cartItem?.quantity || 0

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        quantity,
      },
    })
    setQuantity(1)
  }

  const updateCartQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: "REMOVE_ITEM", payload: item.id })
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: item.id, quantity: newQuantity },
      })
    }
  }

  if (!item.is_available) {
    return (
      <Card className="opacity-60">
        <CardHeader>
          <div className="relative">
            <Image
              src={item.image_url || "/placeholder.svg?height=200&width=300"}
              alt={item.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-md"
            />
            <Badge variant="secondary" className="absolute top-2 right-2">
              Unavailable
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <CardDescription className="mt-2">{item.description}</CardDescription>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
            <Badge variant="outline">{item.preparation_time} min</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={item.image_url || "/placeholder.svg?height=200&width=300"}
            alt={item.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          {item.allergens && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Allergens
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="mt-2 text-sm">{item.description}</CardDescription>
        {item.allergens && (
          <p className="text-xs text-muted-foreground mt-2">
            <strong>Allergens:</strong> {item.allergens}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
          <Badge variant="outline">{item.preparation_time} min</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {cartQuantity > 0 ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => updateCartQuantity(cartQuantity - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{cartQuantity}</span>
              <Button variant="outline" size="sm" onClick={() => updateCartQuantity(cartQuantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="destructive" size="sm" onClick={() => updateCartQuantity(0)}>
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={addToCart}>Add to Cart</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
