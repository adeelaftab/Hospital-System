export interface IChatUser {
  name: string;
  lastSeen: string;
  avatar?: string;
}

export interface IChatMessage {
  date: string;
  content: string;
  my: boolean;
}
