import { serve, json } from "https://deno.land/x/sift@0.5.0/mod.ts";

serve({
    "/": () => json({ message: "hello world" }),
    "/api/create": (req) => {

        if (req.method !== 'POST') {
            return json({ message: "Only POST requests are allowed" }, { status: 405 });
        }

        return json({ message: "created" }, { status: 201 })
    },
  });