"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export function HeroScroll() {
  const router = useRouter();
  const { user } = useUser();
  
  return (
    <div className="flex flex-col overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black relative">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Top-left: AuraGaze text */}
        <Link href="/" className="text-lg md:text-xl font-bold uppercase tracking-wider text-white hover:text-gray-300 transition-colors">
          AuraGaze
        </Link>

        {/* Top-right: Shop button and User profile */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/shop")}
            className="text-white hover:text-gray-300 hover:bg-white/10 border-0 font-medium uppercase tracking-wide text-sm md:text-base transition-all duration-300"
          >
            Shop
          </Button>
          {user ? (
            <Link href="/dashboard" className="group">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00bfff] to-[#0099ff] p-[2px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.firstName || "User"}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00bfff] to-[#0099ff] p-[2px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 cursor-pointer">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            </SignInButton>
          )}
        </div>
      </div>

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
                className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-semibold group shadow-lg hover:shadow-xl transition-all duration-300"
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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
        >
          <source src="/shopping.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </ContainerScroll>
    </div>
  );
}
