import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "recipe-add-access";
const maxAge = 60 * 60 * 24 * 30;

export function getRecipeAddCode() {
  const code = process.env.RECIPE_ADD_CODE;
  return code && code.length >= 16 ? code : undefined;
}

export function matchesCode(input: string, code: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(input), digest(code));
}

function sign(expires: string, code: string) {
  return createHmac("sha256", code).update(`recipe-add:${expires}`).digest("hex");
}

export async function hasRecipeAddAccess() {
  const code = getRecipeAddCode();
  const value = (await cookies()).get(cookieName)?.value;
  if (!code || !value || !/^\d{10}\.[a-f0-9]{64}$/.test(value)) return false;
  const [expires, signature] = value.split(".");
  return Number(expires) > Date.now() / 1000 && timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(sign(expires, code), "hex"),
  );
}

export async function grantRecipeAddAccess(code: string) {
  const expires = String(Math.floor(Date.now() / 1000) + maxAge);
  (await cookies()).set(cookieName, `${expires}.${sign(expires, code)}`, {
    path: "/recipes/new",
    maxAge,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}
