"use client"
import { Briefcase, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

const jobOpenings = [
  {
    id: 1,
    title: "Senior Fashion Designer",
    location: "Paris, France",
    department: "Design",
    description: "Lead the creative direction for upcoming collections, from concept to production.",
  },
  {
    id: 2,
    title: "E-commerce Marketing Specialist",
    location: "Remote",
    department: "Marketing",
    description: "Develop and execute digital marketing strategies to drive online sales and brand awareness.",
  },
  {
    id: 3,
    title: "Sustainability Analyst",
    location: "London, UK",
    department: "Operations",
    description: "Research and implement sustainable practices across our supply chain and product lifecycle.",
  },
  {
    id: 4,
    title: "Customer Experience Associate",
    location: "New York, USA",
    department: "Customer Service",
    description: "Provide exceptional support to our global customer base, ensuring a seamless shopping experience.",
  },
]

export function CareersPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl">Careers</h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg uppercase tracking-wide md:text-xl">Join the Sacred Mayhem family</p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <ScrollReveal direction="up">
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-black uppercase tracking-wider">Shape the Future of Luxury</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              At Sacred Mayhem, we're more than just a fashion brand; we're a movement. We're looking for passionate,
              innovative, and driven individuals to join our growing team and help us redefine luxury streetwear.
            </p>
          </div>
        </ScrollReveal>

        {/* Why Join Us */}
        <section className="mb-16">
          <ScrollReveal direction="up">
            <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-wider">Why Work With Us?</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center p-8 bg-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide">Innovation</h3>
                <p className="text-gray-700">Be at the forefront of fashion and technology.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <div className="text-center p-8 bg-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide">Impact</h3>
                <p className="text-gray-700">Contribute to a sustainable and ethical future.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <div className="text-center p-8 bg-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide">Culture</h3>
                <p className="text-gray-700">Join a diverse, creative, and supportive team.</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Job Openings */}
        <section>
          <ScrollReveal direction="up">
            <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-wider">Current Openings</h2>
          </ScrollReveal>
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <ScrollReveal key={job.id} direction="up" delay={index * 100}>
                <div className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h3 className="mb-2 text-xl font-bold uppercase tracking-wide">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 text-sm">{job.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 md:mt-0 border-black text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-24 bg-black p-12 text-center text-white">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl">Can't Find Your Role?</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="mb-8 text-lg">
              We're always looking for exceptional talent. Send us your resume and tell us how you can contribute.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <Button
              size="lg"
              className="bg-white px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300"
            >
              Submit Your Resume
            </Button>
          </ScrollReveal>
        </section>
      </div>
    </div>
  )
}
