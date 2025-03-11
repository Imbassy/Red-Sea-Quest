import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// In a real app, this would come from your CMS or database
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Red Sea Diving Spots You Can't Miss",
    excerpt:
      "Discover the most breathtaking diving locations in the Red Sea, from vibrant coral reefs to historic shipwrecks.",
    image: "/placeholder.svg?height=300&width=600",
    date: "2024-03-01",
    author: "Sarah Johnson",
    category: "Diving",
  },
  {
    id: 2,
    title: "A Complete Guide to Desert Safari Adventures",
    excerpt:
      "Everything you need to know about planning your desert safari experience, from what to pack to the best time to visit.",
    image: "/placeholder.svg?height=300&width=600",
    date: "2024-02-28",
    author: "Mohammed Ahmed",
    category: "Desert",
  },
  // Add more blog posts...
]

export default function BlogPage() {
  return (
    <div className="container px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Travel Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover travel tips, local insights, and inspiring stories from our community of travelers
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-12">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-[16/9] md:aspect-auto">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Featured blog post"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="space-y-4">
                <Button variant="outline" className="pointer-events-none">
                  Featured
                </Button>
                <h2 className="text-2xl font-bold">The Ultimate Guide to Exploring Egypt's Red Sea Coast</h2>
                <p className="text-muted-foreground">
                  From pristine beaches to world-class diving spots, discover why the Red Sea coast is a must-visit
                  destination for every traveler.
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-muted-foreground">March 5, 2024</p>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/blog/ultimate-guide">Read More</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="aspect-[16/9] relative">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <Button variant="outline" className="pointer-events-none mb-4">
                {post.category}
              </Button>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
              <Button variant="outline" asChild className="w-full">
                <Link href={`/blog/${post.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <Card className="mt-12 bg-muted/50">
        <CardContent className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest travel tips, destination guides, and exclusive offers delivered straight to your inbox.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

