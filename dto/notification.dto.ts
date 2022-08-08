export interface NotificationDto {
  time_to_send: Date;
  email: string;
  abandoned_checkout_id: string;
  retry_count: number;
}
