"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Sustainable Fashion",
    excerpt: "Exploring how luxury streetwear can lead the charge in environmental responsibility.",
    author: "Maya Rodriguez",
    date: "2024-01-15",
    category: "Sustainability",
    image: "/placeholder.svg?height=400&width=600&text=Sustainable+Fashion",
    featured: true,
  },
  {
    id: 2,
    title: "Street Style Evolution",
    excerpt: "From underground culture to mainstream luxury - the journey of streetwear.",
    author: "Alex Chen",
    date: "2024-01-10",
    category: "Culture",
    image: "/placeholder.svg?height=400&width=600&text=Street+Style",
    featured: false,
  },
  {
    id: 3,
    title: "Minimalism in Fashion",
    excerpt: "Why less is more in the world of luxury streetwear design.",
    author: "Jordan Kim",
    date: "2024-01-05",
    category: "Design",
    image: "/placeholder.svg?height=400&width=600&text=Minimalism",
    featured: false,
  },
  {
    id: 4,
    title: "Behind the Scenes: Our Creative Process",
    excerpt: "An inside look at how Sacred Mayhem pieces come to life from concept to creation.",
    author: "Maya Rodriguez",
    date: "2023-12-28",
    category: "Behind the Scenes",
    image: "/placeholder.svg?height=400&width=600&text=Creative+Process",
    featured: false,
  },
  {
    id: 5,
    title: "The Art of Monochrome",
    excerpt: "Mastering the power of black and white in contemporary fashion.",
    author: "Alex Chen",
    date: "2023-12-20",
    category: "Design",
    image: "/placeholder.svg?height=400&width=600&text=Monochrome+Art",
    featured: false,
  },
  {
    id: 6,
    title: "Global Street Culture",
    excerpt: "How different cities influence our design philosophy and aesthetic.",
    author: "Jordan Kim",
    date: "2023-12-15",
    category: "Culture",
    image: "/placeholder.svg?height=400&width=600&text=Global+Culture",
    featured: false,
  },
]

const categories = ["All", "Sustainability", "Culture", "Design", "Behind the Scenes"]

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  const filteredPosts =
    activeCategory === "All" ? blogPosts : blogPosts.filter((post) => post.category === activeCategory)

  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl animate-fade-in-up">
            The Journal
          </h1>
          <p className="text-lg uppercase tracking-wide md:text-xl animate-fade-in-up animation-delay-300">
            Insights from the underground
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-black uppercase tracking-wider md:text-3xl">Featured Article</h2>
            </div>

            <Link
              href={`/blog/${featuredPost.id}`}
              className="group block overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-500"
              onMouseEnter={() => setHoveredPost(featuredPost.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      hoveredPost === featuredPost.id ? "scale-110" : "scale-100"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h3 className="mb-4 text-2xl font-black uppercase tracking-wider md:text-3xl lg:text-4xl">
                    {featuredPost.title}
                  </h3>
                  <p className="mb-6 text-gray-600 leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div
                    className={`mt-6 flex items-center space-x-2 transition-all duration-300 ${
                      hoveredPost === featuredPost.id ? "translate-x-2" : ""
                    }`}
                  >
                    <span className="font-semibold uppercase tracking-wide">Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Category Filter */}
        <div className="mb-12 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={`transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-black text-white hover:bg-gray-800 scale-105"
                    : "border-black text-black hover:bg-black hover:text-white hover:scale-105"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group block overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    hoveredPost === post.id ? "scale-110" : "scale-100"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold uppercase tracking-wide line-clamp-2">{post.title}</h3>
                <p className="mb-4 text-gray-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div
                  className={`mt-4 flex items-center space-x-2 transition-all duration-300 ${
                    hoveredPost === post.id ? "translate-x-2" : ""
                  }`}
                >
                  <span className="text-sm font-semibold uppercase tracking-wide">Read More</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <section className="mt-24 bg-black p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl">Stay Updated</h2>
          <p className="mb-8 text-lg">Get the latest insights and stories delivered to your inbox.</p>
          <div className="mx-auto flex max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-black placeholder:text-gray-500 focus:outline-none"
            />
            <Button className="bg-white px-8 text-black hover:bg-gray-200">Subscribe</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
