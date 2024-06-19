import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(), //username or email, identtifier is a better prod word
  password: z.string(),
});
