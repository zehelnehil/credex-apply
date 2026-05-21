import { Resend } from "resend";

const hasDatabaseUrl = !!process.env.DATABASE_URL;

async function getPrisma() {
  if (!hasDatabaseUrl) return null;
  try {
    const { prisma } = await import("@/lib/db");
    return prisma;
  } catch {
    return null;
  }
}

export async function captureLead(input: {
  auditId?: string;
  email: string;
  company?: string;
  role?: string;
  intent?: string;
}) {
  const prisma = await getPrisma();
  if (prisma) {
    try {
      await prisma.lead.create({
        data: {
          auditId: input.auditId,
          email: input.email,
          company: input.company,
          role: input.role,
          intent: input.intent
        }
      });
    } catch {
      // The product should still return value even if persistence is unavailable.
    }
  }

  if (!process.env.RESEND_API_KEY || !process.env.LEAD_NOTIFY_EMAIL) return;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Credex Auditor <audits@credex.example>",
      to: process.env.LEAD_NOTIFY_EMAIL,
      subject: `New audit lead: ${input.email}`,
      text: `Email: ${input.email}\nCompany: ${input.company ?? "Unknown"}\nRole: ${input.role ?? "Unknown"}\nIntent: ${input.intent ?? "Unknown"}`
    });
  } catch {
    // Email is operationally useful, not required for the user journey.
  }
}

