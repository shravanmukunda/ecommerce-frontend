"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroScroll() {
  const router = useRouter();
  return (
    <div className="flex flex-col overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-white">
              Welcome to <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                AURA GAZE
              </span>
            </h1>
            <p className="text-xl md:text-2xl mt-4 text-gray-300 font-light">
              Where Street Meets Elegance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-semibold group"
                onClick={() => {
                  router.push("/shop");
                }}
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=720&fit=crop&q=80"
          alt="Sacred Mayhem Collection"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-center"
          draggable={false}
          priority
        />
      </ContainerScroll>
    </div>
  );
}

