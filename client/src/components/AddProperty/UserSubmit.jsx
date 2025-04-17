"use client";

import React, { useContext } from "react";
import { UserContext } from "../../utils/UserContext";

export default function UserSubmit() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="bg-[#f0f0f0] p-4 rounded-[12px] border border-[rgba(200,200,200,0.6)]">
      <p className="text-base font-semibold text-[#333]">
        You are uploading as:{" "}
        {currentUser ? (
          <span className="font-bold text-[#000]">{currentUser.email}</span>
        ) : (
          <span className="text-red-600">Not logged in</span>
        )}
      </p>
      {currentUser && (
        <input type="hidden" name="userEmail" value={currentUser.email} />
      )}
    </div>
  );
}