import { createServerFn } from "@tanstack/react-start";
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  markCheckedIn,
  getRegistrationStats,
  type Registration,
} from "./storage";
import { sendConfirmationEmail } from "./email";

export const submitRegistration = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as Omit<Registration, "id" | "uniqueId" | "checkedIn" | "checkedInAt" | "createdAt">,
  )
  .handler(async ({ data }) => {
    const reg = await createRegistration(data);
    sendConfirmationEmail(reg).catch((err) => console.error("Confirmation email failed:", err));
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

export const checkInAttendee = createServerFn({ method: "POST" })
  .validator((id: unknown) => id as string)
  .handler(async ({ data: id }) => {
    return markCheckedIn(id);
  });

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  return getRegistrationStats();
});
