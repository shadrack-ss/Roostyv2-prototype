import { prisma } from "@/lib/db";
import type { CollectionDef } from "./collections";

/**
 * A deliberately narrow view of a Prisma model delegate, so the generic
 * collection actions can work on any list model by name. Prisma's own
 * delegate types are not mutually compatible (each has its own argument
 * types), which is why this goes through `unknown` once, here, instead of in
 * every caller.
 */

export type Row = Record<string, unknown> & { id: string };

type Delegate = {
  findMany(args?: object): Promise<Row[]>;
  findUnique(args: { where: { id: string } }): Promise<Row | null>;
  create(args: { data: object }): Promise<Row>;
  update(args: { where: { id: string }; data: object }): Promise<Row>;
  delete(args: { where: { id: string } }): Promise<Row>;
  aggregate(args: { _max: { sortOrder: true } }): Promise<{ _max: { sortOrder: number | null } }>;
};

export function delegateFor(model: CollectionDef["model"]): Delegate {
  return prisma[model] as unknown as Delegate;
}

export function listOrder(def: CollectionDef) {
  return def.orderBy === "date"
    ? [{ date: "desc" as const }, { createdAt: "desc" as const }]
    : [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];
}
