import { supabaseClient } from "./../supabaseClient.ts";
import { json } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { AbandonCheckoutDto } from "../dto/abandon-checkout.dto.ts";
import { addNotificationToQueue } from "./notification.ts";
import { addMinutes } from "../utils/date.ts";
export async function handleAbandonCheckoutRequest(request: Request) {
  if (!request.body) {
    return json({ error: "No body" }, { status: 400 });
  }

  let dto: AbandonCheckoutDto | undefined;

  try {
    dto = (await request.json()) as AbandonCheckoutDto | undefined;

    // check for valid DTO.
    if (!dto) {
      return json({ message: "No payload" }, { status: 400 });
    }
  } catch (_) {
    return json({ error: "Invalid body" }, { status: 400 });
  }

  const { data, error } = await supabaseClient.from("abandoned_checkouts")
    .insert({
      recovery_url: dto.abandoned_checkout_url,
      email: dto.email,
      token: dto.token,
      updated_at: dto.updated_at,
      raw_data: dto,
    }).single();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  await addNotificationToQueue({
    abandoned_checkout_id: data.id,
    email: data.email,
    time_to_send: addMinutes(new Date(Date.parse(dto.updated_at)), 30),
    retry_count: 0,
  });

  return json({ message: "Success" });
}

export async function markCheckoutRecovered(
  abandonedCheckoutId: string,
  recoveredAt: Date,
) {
  await supabaseClient.from("abandoned_checkouts")
    .update({
      recovered_at: recoveredAt,
    })
    .eq("id", abandonedCheckoutId);
}
