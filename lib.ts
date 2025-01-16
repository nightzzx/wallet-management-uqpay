"use server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any, expired_at: number) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expired_at)
    .sign(key);
}

export async function loginFunction(
  emailAddress: string,
  expired_at: number,
  authToken: string
) {
  // console.log(authToken, "authToken from lib.ts");

  const session = await encrypt({ emailAddress }, expired_at);

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const maxAge = expired_at - currentTimestamp;

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    maxAge,
    sameSite: "Strict",
    path: "/",
  });

  console.log("Session saved in cookies");

  redirect("/dashboard");
}
