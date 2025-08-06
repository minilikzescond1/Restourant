import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Star, Users, Utensils } from "lucide-react"

export default function HomePage() {
  const featuredItems = [
    {
      id: 1,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon herb butter",
      price: 24.99,
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Ribeye Steak",
      description: "Premium 12oz ribeye steak cooked to perfection",
      price: 32.99,
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Chicken Parmesan",
      description: "Breaded chicken breast with marinara and mozzarella",
      price: 19.99,
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to Bella Vista</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Experience authentic Italian cuisine in the heart of the city
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-black hover:bg-gray-100">
              <Link href="/menu">View Menu</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <Link href="/reservations">Make Reservation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Bella Vista?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We pride ourselves on delivering exceptional dining experiences with fresh ingredients and outstanding
              service.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
              <p className="text-muted-foreground">
                We source the finest ingredients daily to ensure every dish is fresh and flavorful.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Service</h3>
              <p className="text-muted-foreground">Quick preparation times without compromising on quality or taste.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Family Friendly</h3>
              <p className="text-muted-foreground">
                A warm, welcoming atmosphere perfect for families and special occasions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5-Star Rated</h3>
              <p className="text-muted-foreground">Consistently rated as one of the top restaurants in the city.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Dishes</h2>
            <p className="text-lg text-muted-foreground">Discover our most popular and chef-recommended dishes</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="mb-4">{item.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${item.price}</span>
                    <Button asChild>
                      <Link href="/menu">Order Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Dine With Us?</h2>
          <p className="text-xl mb-8 opacity-90">Book your table now or order online for pickup and delivery</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/reservations">Make Reservation</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
            >
              <Link href="/menu">Order Online</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
