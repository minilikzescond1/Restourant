"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import MenuItemCard from "@/components/menu-item-card"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image_url?: string
  category_id: number
  is_available: boolean
  preparation_time: number
  allergens?: string
}

interface Category {
  id: number
  name: string
  description: string
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([fetch("/api/menu/items"), fetch("/api/menu/categories")])

      const items = await itemsRes.json()
      const cats = await categoriesRes.json()

      setMenuItems(items)
      setCategories(cats)
    } catch (error) {
      console.error("Failed to fetch menu data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category_id.toString() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getItemsByCategory = (categoryId: number) => {
    return filteredItems.filter((item) => item.category_id === categoryId)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our carefully crafted dishes made with the finest ingredients
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            All Items
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id.toString() ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id.toString())}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {selectedCategory === "all" ? (
        <Tabs defaultValue={categories[0]?.id.toString()} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id.toString()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id.toString()}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getItemsByCategory(category.id).map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
              {getItemsByCategory(category.id).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No items found in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found matching "{searchTerm}". Try a different search term.</p>
        </div>
      )}
    </div>
  )
}
