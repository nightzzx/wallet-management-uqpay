"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const LoginComponent = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ email: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: message,
        });
      }, 0);
    }
  }, [message, toast]);

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    const bodyContent = { email: data.email, legal_entity_type: "1000" };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyContent),
        }
      );

      const res = await response.json();

      if (res.code === 200) {
        const emailExist = res.data.email_exist;

        router.push(`/verify/${data.email}?email_exist=${emailExist}`);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during signin:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-10 bg-white shadow-lg rounded-xl w-full max-w-md border border-gray-200"
      >
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
          Wallet Management Application
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Manage your wallet address seamlessly. Enter your email to proceed.
        </p>
        <div className="mb-6">
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="testing@gmail.com"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg font-medium text-lg flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="w-5 h-5 mr-2 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <circle
                className="opacity-75"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="60"
                strokeDashoffset="20"
              />
            </svg>
          ) : (
            "Send OTP"
          )}
        </Button>
        <p className="mt-6 text-sm text-center text-gray-500">
          Check your email inbox / spam folder for the 6 digit OTP
        </p>
      </form>
    </div>
  );
};

export default LoginComponent;
