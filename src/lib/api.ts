import { createServerFn } from "@tanstack/react-start";
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  markCheckedIn,
  markAsPaid,
  getRegistrationStats,
  type Registration,
} from "./storage";
import { sendConfirmationEmail } from "./email";

export const submitRegistration = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as Omit<
        Registration,
        "id" | "uniqueId" | "paymentStatus" | "paypalTransactionId" | "checkedIn" | "checkedInAt" | "createdAt"
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
