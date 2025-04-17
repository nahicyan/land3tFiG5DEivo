"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchArea({ query, setQuery, placeholder }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // The filtering is handled by the parent component in real time.
    console.log("SearchArea query:", query);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 sm:mt-8">
      <div className="relative p-2 sm:border sm:border-[#324c48] group sm:rounded-xl sm:focus-within:ring-1 sm:focus-within:ring-[#D4A017] sm:focus-within:border-[#D4A017]">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full px-4 py-4 text-[#030001] placeholder-[#576756] bg-transparent border border-[#324c48] outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-xl sm:border-none sm:focus:ring-0 sm:focus:border-transparent"
          required
        />
        <div className="mt-4 sm:mt-0 sm:absolute sm:inset-y-0 sm:right-0 sm:flex sm:items-center sm:pr-2">
          <Button
            type="submit"
            className="bg-[#324c48] hover:bg-[#3f4f24] text-white px-6 py-3 text-lg font-semibold rounded-lg transition"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
