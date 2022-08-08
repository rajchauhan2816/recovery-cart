import { supabaseClient } from "./../supabaseClient.ts";
import { json } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { OrderDto } from "./../dto/order.dto.ts";
import { removeNotificationToQueue } from "./notification.ts";
import { markCheckoutRecovered } from "./abandoned-checkout.ts";
export async function handleOrderRequest(request: Request) {
  if (!request.body) {
    return json({ error: "No body" }, { status: 400 });
  }

  let dto: OrderDto | undefined;

  try {
    dto = (await request.json()) as OrderDto | undefined;

    // check for valid DTO.
    if (!dto) {
      return json({ message: "No payload" }, { status: 400 });
    }
  } catch (_) {
    return json({ error: "Invalid body" }, { status: 400 });
  }

  // get abandoned_checkout_id from abandoned_checkouts table
  const { data: checkoutData, error: checkoutError } = await supabaseClient
    .from(
      "abandoned_checkouts",
    )
    .select("id")
    .eq("token", dto.order.token)
    .single();

  if (checkoutError) {
    return json({ error: checkoutError?.message }, { status: 500 });
  }
  const { error } = await supabaseClient.from("orders")
    .insert({
      token: dto.order.token,
      raw_data: dto,
      abandoned_checkout_id: checkoutData?.id,
    });

  if (error) {
    return json({ error: error?.message }, { status: 500 });
  }

  //Remove Notification from Queue
  await removeNotificationToQueue(checkoutData?.id);

  //Set Checkout As Recovered
  await markCheckoutRecovered(
    checkoutData?.id,
    new Date(Date.parse(dto.order.created_at)),
  );

  return json({ message: "Success" });
}
