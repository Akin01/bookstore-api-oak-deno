import "@std/dotenv/load";

type Config = {
  PORT: number;
  BOOKS_KEY: string;
};

if (!Deno.env.get("PORT")) {
  throw new Error("PORT is required");
}

export const config = Deno.env.toObject() as unknown as Config;
