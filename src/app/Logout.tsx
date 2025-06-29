"use client";
import React from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        localStorage.removeItem(
          `${process.env.NEXT_PUBLIC_TOKEN_PREFIX}_token`
        );
        Cookie.remove("user");
        router.push("/login");
      }}
      className="text-xs hover:underline text-gray-600"
    >
      logout
    </button>
  );
};

export default Logout;
