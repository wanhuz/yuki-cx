// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ActionResult<T extends object = object> =
  | ({ ok: true } & T)
  | {
      ok: false;
      error: string;
      code?: "DUPLICATE" | "INVALID" | "REJECTED" | "UNKNOWN";
    };