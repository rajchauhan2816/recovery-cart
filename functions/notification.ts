import { NotificationDto } from "./../dto/notification.dto.ts";
import { supabaseClient } from "./../supabaseClient.ts";
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import { addDays } from "../utils/date.ts";
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

const sendNotification = (notification: any, abandonedCheckout: any) => {
  // send notification to user
  console.log("Email Sent Successfully", notification.email);
  console.log("notification", notification);
  console.log("abandoned_checkouts", abandonedCheckout);
};

const getAbandonedCheckout = async (abandonedCheckoutId: string) => {
  const { data, error } = await supabaseClient
    .from(
      "abandoned_checkouts",
    )
    .select("*")
    .eq("id", abandonedCheckoutId)
    .single();
  if (error) {
    console.log(error);
    return;
  }
  return data;
};
const notificationWorker = async () => {
  // get notication from notifications table
  // get current date in utc
  const now_utc = new Date().toUTCString();
  const { data, error } = await supabaseClient.from("notifications")
    .select("*")
    .lte("time_to_send", now_utc);
  if (error) {
    console.log(error);
    return;
  }
  data?.forEach(async (notification) => {
    if (notification.retry_count < 3) {
      const abandonedCheckout = await getAbandonedCheckout(
        notification.abandoned_checkout_id,
      );
      // send notification
      sendNotification(notification, abandonedCheckout);

      let time_to_send;
      // 0 means 30 minutes notification is sent.
      if (notification.retry_count == 0) {
        time_to_send = addDays(new Date(abandonedCheckout.updated_at), 1);
      } else if (notification.retry_count == 1) {
        // 1 means 1 day notification is sent.
        time_to_send = addDays(new Date(abandonedCheckout.updated_at), 3);
      } else if (notification.retry_count === 2) {
        // 2 means 3 day notification is sent.
        // remove notification from notifications table
        return await removeNotificationToQueue(
          notification.abandoned_checkout_id,
        );
      }
      // update retry_count
      await supabaseClient.from("notifications")
        .update({
          retry_count: notification.retry_count + 1,
          time_to_send,
        })
        .eq("id", notification.id);
    } else {
      // remove notification from notifications table
      await removeNotificationToQueue(notification.abandoned_checkout_id);
    }
  });
};

// Run Job in every 5 seconds
cron("*/5 * * * * *", () => {
  console.info("Notification Worker is Working", new Date());
  notificationWorker();
});
