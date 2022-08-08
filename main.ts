import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { handleAbandonCheckoutRequest } from "./functions/abandoned-checkout.ts";
import { handleOrderRequest } from "./functions/order.ts";
import { pagehandler } from "./functions/page.jsx";

serve({
  "/abandoncheckout": handleAbandonCheckoutRequest,
  "/order": handleOrderRequest,
  "/": pagehandler,
});
