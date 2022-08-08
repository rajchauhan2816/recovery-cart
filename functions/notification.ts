import { NotificationDto } from "./../dto/notification.dto.ts";
import { supabaseClient } from "./../supabaseClient.ts";
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
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

const sendNotification = async (notification: any) => {
  const { data, error } = await supabaseClient
    .from(
      "abandoned_checkouts",
    )
    .select("*")
    .eq("id", notification.abandoned_checkout_id)
    .single();
  if (error) {
    console.log(error);
    return;
  }

  // send notification to user
  console.log("Email Sent Successfully", notification.email);
  console.log("notification", notification);
  console.log("abandoned_checkouts", data);
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
      // send notification
      sendNotification(notification);
      // update retry_count
      await supabaseClient.from("notifications")
        .update({
          retry_count: notification.retry_count + 1,
        })
        .eq("id", notification.id);

      if (notification.retry_count === 2) {
        // remove notification from notifications table
        await removeNotificationToQueue(notification.abandoned_checkout_id);
      }
    }
    // remove notification from queue
    await removeNotificationToQueue(notification.abandoned_checkout_id);
  });
};

// Run Job in every 5 seconds
cron("5 * * * * *", () => {
  console.log("Notification Worker is Working", new Date());
  notificationWorker();
});
