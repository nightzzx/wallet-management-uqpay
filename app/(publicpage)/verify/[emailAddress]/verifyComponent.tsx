"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginFunction } from "../../../../lib";

const VerifyComponent = ({
  data,
  emailExist,
}: {
  data: string;
  emailExist: string;
}) => {
  const { register, handleSubmit, setValue } = useForm<{ token: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const emailAddress = data;

  const onSubmit = async (data: { token: string }) => {
    setIsLoading(true);
    const token = Object.values(data.token).join("");

    const bodycontent = {
      email: emailAddress,
      authorize_code: token,
      ...(emailExist === "false" && { legal_entity_type: "1000" }),
    };
    const apiUrl =
      emailExist === "true"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/signin_verify`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/signup_verify`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodycontent),
    });

    const res = await response.json();

    if (res.code == 200) {
      const authToken = res.data.auth_token;
      const refreshToken = res.data.refresh_token;
      const expired_at = res.data.expired_at;
      localStorage.setItem("authToken", JSON.stringify(authToken));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
      localStorage.setItem("userEmail", JSON.stringify(emailAddress));
      loginFunction(emailAddress, expired_at, authToken);
    } else {
      alert(res.message);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      setValue(`token.${index}`, value);
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (value && nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-10 bg-white shadow-lg rounded-xl w-full max-w-md border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Verify OTP
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter the 6-digit OTP sent to your email to verify your account.
        </p>
        <div className="mb-6">
          <div className="flex space-x-2 justify-center">
            {[...Array(6)].map((_, index) => (
              <Input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                {...register(`token.${index}`, { required: true })}
                className="w-12 h-12 text-center text-xl font-medium border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handleOtpChange(index, e.target.value)}
              />
            ))}
          </div>
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
            "Confirm"
          )}
        </Button>
      </form>
    </div>
  );
};

export default VerifyComponent;
