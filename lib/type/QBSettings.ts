// lib/type/QBSettings.ts
export type QBConnection = {
  url: string;
  port: number;
  username: string;
  password: string;
};

export type QBAddOptions = {
  pauseTorrent: boolean;
  label: string;
};

export type AddContext = "manual" | "scheduler";

export type QBSettings = {
  connection: QBConnection;
  add: Record<AddContext, QBAddOptions>;
};