"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

const sizeCharts = {
  tops: {
    unit: "cm",
    measurements: ["Size", "Chest", "Length", "Sleeve"],
    data: [
      ["XS", "86-91", "66", "60"],
      ["S", "92-97", "68", "62"],
      ["M", "98-103", "70", "64"],
      ["L", "104-109", "72", "66"],
      ["XL", "110-115", "74", "68"],
    ],
    image: "/placeholder.svg?height=400&width=400&text=Tops+Size+Guide",
  },
  bottoms: {
    unit: "cm",
    measurements: ["Size", "Waist", "Inseam", "Hip"],
    data: [
      ["XS", "70-75", "76", "90-95"],
      ["S", "76-81", "78", "96-101"],
      ["M", "82-87", "80", "102-107"],
      ["L", "88-93", "82", "108-113"],
      ["XL", "94-99", "84", "114-119"],
    ],
    image: "/placeholder.svg?height=400&width=400&text=Bottoms+Size+Guide",
  },
  outerwear: {
    unit: "cm",
    measurements: ["Size", "Chest", "Length", "Shoulder"],
    data: [
      ["S", "90-95", "70", "45"],
      ["M", "96-101", "72", "47"],
      ["L", "102-107", "74", "49"],
      ["XL", "108-113", "76", "51"],
    ],
    image: "/placeholder.svg?height=400&width=400&text=Outerwear+Size+Guide",
  },
}

export function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState("tops")
  const [unit, setUnit] = useState("cm") // 'cm' or 'inches'

  const currentChart = sizeCharts[activeCategory as keyof typeof sizeCharts]

  const convertValue = (value: string) => {
    if (value.includes("-")) {
      const [min, max] = value.split("-").map(Number)
      if (unit === "inches") {
        return `${(min / 2.54).toFixed(1)}-${(max / 2.54).toFixed(1)}`
      }
      return value
    }
    const numValue = Number(value)
    if (isNaN(numValue)) return value
    if (unit === "inches") {
      return (numValue / 2.54).toFixed(1)
    }
    return value
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl">Size Guide</h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg uppercase tracking-wide md:text-xl">Find your perfect fit</p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* How to Measure */}
        <section className="mb-16">
          <ScrollReveal direction="up">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-black uppercase tracking-wider">How to Measure</h2>
              <p className="text-lg text-gray-600">Follow these simple steps to get accurate measurements.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
            <ScrollReveal direction="left">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src="/placeholder.svg?height=600&width=800&text=Measuring+Guide"
                  alt="How to Measure"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-black mt-1" />
                  <div>
                    <h3 className="font-bold uppercase tracking-wide">Chest</h3>
                    <p className="text-gray-700">
                      Measure around the fullest part of your chest, keeping the tape horizontal.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-black mt-1" />
                  <div>
                    <h3 className="font-bold uppercase tracking-wide">Waist</h3>
                    <p className="text-gray-700">
                      Measure around the narrowest part of your waist, usually above the belly button.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-black mt-1" />
                  <div>
                    <h3 className="font-bold uppercase tracking-wide">Inseam</h3>
                    <p className="text-gray-700">Measure from the top of your inner thigh to your ankle bone.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Size Charts */}
        <section>
          <ScrollReveal direction="up">
            <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-wider">Our Size Charts</h2>
          </ScrollReveal>

          {/* Category Tabs */}
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-8 flex justify-center space-x-4">
              {Object.keys(sizeCharts).map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 font-semibold uppercase tracking-wide ${
                    activeCategory === category
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border-black text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollReveal>

          {/* Unit Toggle */}
          <ScrollReveal direction="up" delay={200}>
            <div className="mb-8 flex justify-center space-x-4">
              <Button
                variant={unit === "cm" ? "default" : "outline"}
                onClick={() => setUnit("cm")}
                className={`px-4 py-2 text-sm font-semibold ${
                  unit === "cm" ? "bg-black text-white" : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                CM
              </Button>
              <Button
                variant={unit === "inches" ? "default" : "outline"}
                onClick={() => setUnit("inches")}
                className={`px-4 py-2 text-sm font-semibold ${
                  unit === "inches" ? "bg-black text-white" : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                INCHES
              </Button>
            </div>
          </ScrollReveal>

          {/* Chart Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={currentChart.image || "/placeholder.svg"}
                  alt={`${activeCategory} size guide`}
                  fill
                  className="object-contain"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-black text-white uppercase text-sm font-bold tracking-wide">
                      {currentChart.measurements.map((m, i) => (
                        <th key={i} className="p-4 border border-gray-700">
                          {m} {m !== "Size" && `(${unit})`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChart.data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-4 border border-gray-200 text-gray-700">
                            {cellIndex === 0 ? cell : convertValue(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Need Help Section */}
        <section className="mt-24 bg-black p-12 text-center text-white">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl">Need Personalized Help?</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="mb-8 text-lg">Our stylists are available to help you find the perfect size and fit.</p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <Button
              size="lg"
              className="bg-white px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300"
            >
              Contact a Stylist
            </Button>
          </ScrollReveal>
        </section>
      </div>
    </div>
  )
}
