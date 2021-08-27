export type Notification = {
  display?: any;
  data?: NotificationData;
};

export type NotificationData = {
  eventId?: string;
  eventName: string;
  eventVersion?: number;
  eventDate: Date;
  eventPayload?: string;
};
