"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReturnsExchangePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white break-words whitespace-normal">Returns / Exchange</h1>

      <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
        <CardContent className="pt-6">
          <div className="text-center space-y-6 py-8">
            <p className="text-xl text-white leading-relaxed">
              For any returns or exchanges, feel free to reach out. We're always here for you!
            </p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all duration-300 border-0">
                Contact Us
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
