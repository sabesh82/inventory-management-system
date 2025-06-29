"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoCube } from "react-icons/io5";
import { AxiosError } from "axios";
import useLogin from "@/app/apiHooks/auth/useLogin";
import { LoginInput, LoginSchema } from "@/app/api/auth/UserSchema";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    mode: "onTouched",
    resolver: zodResolver(LoginSchema),
  });

  const {
    mutateAsync: login,
    isPending: isLoginLoading,
    error: loginError,
  } = useLogin();

  useEffect(() => {
    if (loginError) {
      const err = loginError as AxiosError;
      const message = (err.response?.data ?? { error: "" }) as {
        error: string;
      };

      if (message) {
        console.log({ message });
        setError("email", {
          message: message.error,
        });
        setError("password", {
          message: message.error,
        });
      }
    }
  }, [loginError, setError]);

  return (
    <section className="w-full h-dvh flex items-center justify-center">
      <div className="w-full max-w-xs flex flex-col items-center justify-start">
        {/* logo */}
        <div className="flex items-center justify-start gap-2">
          <div className="p-3 bg-skin-primary rounded-xl flex items-center justify-center text-white">
            <IoCube className="size-5" />
          </div>
          <div className="">
            <p className="text-xl font-semibold text-gray-800">
              Inventory Management
            </p>
            
          </div>
        </div>
        {/* logo */}

        {/* form */}
        <form
          className="w-full mt-10"
          onSubmit={handleSubmit((values) => {
            login(values);
          })}
        >
          <div className="w-full space-y-3">
            <Input
              Label={"Email"}
              placeholder="Enter your email"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              type="password"
              Label={"Password"}
              placeholder="Enter your password"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" wrapperClass="w-full mt-5" className={"w-full"}>
            {isLoginLoading ? "Loading..." : "Continue"}
          </Button>

          <p className="mt-3 max-w-xl pb-10 text-center text-xs text-gray-500">
            By clicking Continue you agree to Inventory Management&apos;s{" "}
            <a href="#" className="text-skin-primary hover:underline">
              Privacy policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-skin-primary hover:underline">
              Terms of Use
            </a>
          </p>
        </form>
        {/* form */}
      </div>
    </section>
  );
};

export default Page;
