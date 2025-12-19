"use client"

import React from 'react';

import { motion } from 'framer-motion';

import { LucideIcon } from 'lucide-react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

import { HeroImage } from './hero-image';

// Define the props interface for type safety and reusability

interface MinimalistHeroProps {

  logoText: string;

  navLinks: { label: string; href: string }[];

  mainText: string;


  imageSrc: string;

  imageAlt: string;

  overlayText: {

    part1: string;

    part2: string;

  };

  socialLinks: { icon: LucideIcon; href: string }[];

  locationText: string;

  className?: string;

}

// Helper component for navigation links

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (

  <Link

    href={href}

    className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"

  >

    {children}

  </Link>

);

// Helper component for social media icons

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (

  <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/60 transition-colors hover:text-foreground">

    <Icon className="h-5 w-5" />

  </a>

);

// The main reusable Hero Section component

export const MinimalistHero = ({

  logoText,

  navLinks,

  mainText,


  imageSrc,

  imageAlt,

  overlayText,

  socialLinks,

  locationText,

  className,

}: MinimalistHeroProps) => {

  return (

    <div

      className={cn(

        'relative flex h-screen w-full flex-col items-center justify-between overflow-hidden p-6 font-sans md:p-10 lg:p-12 xl:p-16 2xl:p-20',

        className

      )}

      style={{

        background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, #f5f5f5 20%, #808080 50%, #2a2a2a 90%, #1e1e1e 100%)'

      }}

    >

      {/* Header */}

      <header className="z-30 flex w-full max-w-7xl items-center justify-between">

        <motion.div

          initial={{ opacity: 0, x: -20 }}

          animate={{ opacity: 1, x: 0 }}

          transition={{ duration: 0.5 }}

          className="text-xl font-bold tracking-wider"

        >

          {logoText}

        </motion.div>

        <div className="hidden items-center space-x-8 md:flex">

          {navLinks.map((link) => (

            <NavLink key={link.label} href={link.href}>

              {link.label}

            </NavLink>

          ))}

        </div>

        <motion.button

          initial={{ opacity: 0, x: 20 }}

          animate={{ opacity: 1, x: 0 }}

          transition={{ duration: 0.5 }}

          className="flex flex-col space-y-1.5 md:hidden"

          aria-label="Open menu"

        >

          <span className="block h-0.5 w-6 bg-foreground"></span>

          <span className="block h-0.5 w-6 bg-foreground"></span>

          <span className="block h-0.5 w-5 bg-foreground"></span>

        </motion.button>

      </header>

      {/* Main Content Area */}

      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center md:grid-cols-3">

        {/* Left Text Content */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.6, delay: 1 }}

          className="z-20 order-2 md:order-1 text-center md:text-left"

        >

          <p className="mx-auto max-w-xs text-sm leading-relaxed text-foreground/80 md:mx-0 md:max-w-sm md:text-sm lg:text-base lg:max-w-md xl:text-lg xl:max-w-lg 2xl:text-xl 2xl:max-w-xl">{mainText}</p>

        </motion.div>

        {/* Center Image with Circle */}

        <div className="relative order-1 md:order-2 flex justify-center items-center h-full">

            <motion.div

                initial={{ scale: 0.8, opacity: 0 }}

                animate={{ scale: 1, opacity: 1 }}

                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}

                className="absolute z-0 h-[280px] w-[280px] rounded-full bg-white-400/90 md:h-[350px] md:w-[350px] lg:h-[420px] lg:w-[420px] xl:h-[550px] xl:w-[550px] 2xl:h-[650px] 2xl:w-[650px]"

            ></motion.div>

            <HeroImage

                src={imageSrc}

                alt={imageAlt}

                className="h-auto w-56 object-contain md:w-72 lg:w-80 xl:w-96 2xl:w-[28rem]"

            />

        </div>

        {/* Right Text */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.6, delay: 1.2 }}

          className="z-20 order-3 flex items-center justify-center text-center md:justify-start"

        >

          <h1 className="text-6xl font-extrabold text-foreground md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem]">

            {overlayText.part1}

            <br />

            {overlayText.part2}

          </h1>

        </motion.div>

      </div>

      {/* Footer Elements */}

      <footer className="z-30 flex w-full max-w-7xl items-center justify-between">

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5, delay: 1.2 }}

          className="flex items-center space-x-4"

        >

          {socialLinks.map((link, index) => (

            <SocialIcon key={index} href={link.href} icon={link.icon} />

          ))}

        </motion.div>

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5, delay: 1.3 }}

          className="text-sm font-medium text-foreground/80"

        >

          {locationText}

        </motion.div>

      </footer>

    </div>

  );

};

