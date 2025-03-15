import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const spinWheels = pgTable("spin_wheels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  segments: jsonb("segments").$type<string[]>().notNull(),
  colors: jsonb("colors").$type<string[]>().notNull(),
});

export const insertWheelSchema = createInsertSchema(spinWheels).pick({
  name: true,
  segments: true,
  colors: true,
});

export type InsertWheel = z.infer<typeof insertWheelSchema>;
export type SpinWheel = typeof spinWheels.$inferSelect;
