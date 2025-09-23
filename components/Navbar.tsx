import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                PDF Analysis
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              Home
            </Button>
            <Button variant="ghost">
              Features
            </Button>
            <Button variant="ghost">
              About
            </Button>
            <Button>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
