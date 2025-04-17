import React from "react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden text-white">
      {/* 1) Dark background color or gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0D3B66] to-[#142F43]" />

      {/* 2) Blurred spheres */}
      {/* Large pink sphere near top-left */}
      <div className="
        absolute
        -top-32
        -left-32
        h-[500px]
        w-[500px]
        rounded-full
        bg-[#D4A017]
        opacity-30
        blur-3xl
      " />

      {/* Teal sphere near bottom-right */}
      <div className="
        absolute
        bottom-0
        -right-40
        h-[400px]
        w-[400px]
        rounded-full
        bg-teal-400
        opacity-20
        blur-2xl
      " />

      {/* 3) Content Container */}
      <div className="my-14 mx-auto max-w-screen-xl px-4 py-16 text-center">
        <p className="mb-2 text-sm uppercase tracking-wide text-white/70">
        We Are Landivo</p>
        <h1 className="mb-4 text-5xl font-medium leading-tight text-white sm:text-6xl">
          About Us
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-white/80 sm:text-lg">
        Your Gateway to Off-Market Land</p>
      </div>
    </section>
  );
}
