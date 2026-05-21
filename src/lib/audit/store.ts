import { nanoid } from "nanoid";
import type { AuditInput, AuditResult } from "./types";

type StoredAudit = {
  slug: string;
  input: AuditInput;
  result: AuditResult;
  summary: string;
  createdAt: string;
};

// Attach to globalThis so the store survives HMR and module reloads in dev
const globalStore = globalThis as unknown as { __auditMemoryStore?: Map<string, StoredAudit> };
if (!globalStore.__auditMemoryStore) {
  globalStore.__auditMemoryStore = new Map<string, StoredAudit>();
}
const memoryStore = globalStore.__auditMemoryStore;

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

export async function saveAudit(input: AuditInput, result: AuditResult, summary: string) {
  const slug = nanoid(10);
  const payload: StoredAudit = {
    slug,
    input,
    result: { ...result, summary },
    summary,
    createdAt: new Date().toISOString()
  };

  const prisma = await getPrisma();
  if (prisma) {
    try {
      await prisma.audit.create({
        data: {
          slug,
          teamSize: input.teamSize,
          primaryUseCase: input.primaryUseCase,
          tools: input.tools,
          result: payload.result,
          summary,
          email: input.email || null,
          company: input.company || null
        }
      });
      return payload;
    } catch {
      // DB write failed, fall through to memory
    }
  }

  memoryStore.set(slug, payload);
  return payload;
}

export async function getAudit(slug: string) {
  const prisma = await getPrisma();
  if (prisma) {
    try {
      const audit = await prisma.audit.findUnique({ where: { slug } });
      if (audit) {
        return {
          slug: audit.slug,
          input: {
            teamSize: audit.teamSize,
            primaryUseCase: audit.primaryUseCase,
            tools: audit.tools,
            email: audit.email ?? "",
            company: audit.company ?? ""
          } as AuditInput,
          result: audit.result as AuditResult,
          summary: audit.summary,
          createdAt: audit.createdAt.toISOString()
        };
      }
    } catch {
      // DB read failed, fall through to memory
    }
  }

  return memoryStore.get(slug) ?? null;
}

