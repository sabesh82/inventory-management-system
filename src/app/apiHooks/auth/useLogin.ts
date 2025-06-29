"use client";
import fetcher from "@/utilities/fetcher";
import { useMutation } from "@tanstack/react-query";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { LoginInput } from "../../api/auth/UserSchema";

const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["use-login"],
    mutationFn: async (user: LoginInput) => {
      const { data } = await fetcher().post("/auth/login", user);

      if (data.token) {
        Cookie.set("user", data.token);
        localStorage.setItem(
          `${process.env.NEXT_PUBLIC_TOKEN_PREFIX}_token`,
          data.token
        );
      }

      router.push("/");
      return data;
    },
  });
};

export default useLogin;
