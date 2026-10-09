import { createServerFn } from "@tanstack/react-start";
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  markCheckedIn,
  markAsPaid,
  getRegistrationStats,
  getRegistrationsForQrEmail,
  markQrEmailsSent,
  getQrEmailStatus as getQrEmailStatusData,
  type Registration,
} from "./storage";
import { sendConfirmationEmail, sendQrEmail } from "./email";

export const submitRegistration = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as Omit<
        Registration,
        | "id"
        | "uniqueId"
        | "paymentStatus"
        | "paypalTransactionId"
        | "checkedIn"
        | "checkedInAt"
        | "createdAt"
      >,
  )
  .handler(async ({ data }) => {
    const reg = await createRegistration(data);
    return reg;
  });

export const listRegistrations = createServerFn({ method: "GET" }).handler(async () => {
  return getAllRegistrations();
});

export const getRegistration = createServerFn({ method: "GET" })
  .validator((id: unknown) => id as string)
  .handler(async ({ data: id }) => {
    return getRegistrationById(id) ?? null;
  });

export const markPaid = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string; transactionId?: string })
  .handler(async ({ data }) => {
    const reg = await markAsPaid(data.id, data.transactionId);
    if (!reg) throw new Error("Registration not found");
    sendConfirmationEmail(reg).catch((err) => console.error("Confirmation email failed:", err));
    return reg;
  });

export const checkInAttendee = createServerFn({ method: "POST" })
  .validator((id: unknown) => id as string)
  .handler(async ({ data: id }) => {
    return markCheckedIn(id);
  });

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  return getRegistrationStats();
});

export const getQrEmailStatus = createServerFn({ method: "GET" }).handler(async () => {
  return getQrEmailStatusData();
});

export const sendQrEmailBatch = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { force?: boolean; limit?: number; offset?: number })
  .handler(async ({ data }) => {
    const force = data.force ?? false;
    const limit = Math.min(Math.max(data.limit ?? 10, 1), 25);
    const offset = data.offset ?? 0;

    const regs = await getRegistrationsForQrEmail(force, limit, offset);

    const sent: string[] = [];
    const failed: { uniqueId: string; email: string; error: string }[] = [];

    for (const reg of regs) {
      try {
        await sendQrEmail(reg);
        sent.push(reg.uniqueId);
      } catch (err) {
        console.error(`QR email failed for ${reg.email}:`, err);
        failed.push({
          uniqueId: reg.uniqueId,
          email: reg.email,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 550));
    }

    if (!force) {
      await markQrEmailsSent(sent);
    }

    const remaining = force ? 0 : (await getQrEmailStatusData()).pending;

    return { sent: sent.length, failed, remaining, processed: regs.length };
  });

export const resendQrEmail = createServerFn({ method: "POST" })
  .validator((id: unknown) => id as string)
  .handler(async ({ data: id }) => {
    const reg = await getRegistrationById(id);
    if (!reg) throw new Error("Registration not found");
    if (!reg.email) throw new Error("This registration has no email address");
    await sendQrEmail(reg);
    await markQrEmailsSent([reg.uniqueId]);
    return { uniqueId: reg.uniqueId, email: reg.email };
  });
