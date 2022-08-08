import { NotificationDto } from "./../dto/notification.dto.ts";
import { supabaseClient } from "./../supabaseClient.ts";
export async function addNotificationToQueue(dto: NotificationDto) {
  await supabaseClient.from("notifications")
    .insert({
      ...dto,
    });
}

export async function removeNotificationToQueue(abandonedCheckoutId: string) {
  // delete notification from notifications table
  await supabaseClient.from("notifications")
    .delete()
    .eq("abandoned_checkout_id", abandonedCheckoutId);
}
