import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const users = sqliteTable("clout_user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  role: text("role", { enum: ["free", "pro", "team"] }).default("free"),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
});

export const accounts = sqliteTable(
  "clout_account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

export const sessions = sqliteTable("clout_session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "clout_verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const niches = sqliteTable("clout_niche", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

export const userNiches = sqliteTable(
  "clout_user_niche",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    nicheId: text("nicheId")
      .notNull()
      .references(() => niches.id, { onDelete: "cascade" }),
  },
  (un) => ({
    compoundKey: primaryKey({ columns: [un.userId, un.nicheId] }),
  })
);

export const contentItems = sqliteTable("clout_content_item", {
  id: text("id").notNull().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  type: text("type", { enum: ["video", "post"] }).notNull(),
  hook: text("hook"),
  viralScore: integer("viralScore"), // 0-100
  nicheId: text("nicheId")
    .notNull()
    .references(() => niches.id),
  metadata: text("metadata"), // JSON string
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).defaultNow(),
});

export const userPicks = sqliteTable(
  "clout_user_pick",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contentItemId: text("contentItemId")
      .notNull()
      .references(() => contentItems.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["picked", "published"] }).default("picked"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).defaultNow(),
  },
  (up) => ({
    compoundKey: primaryKey({ columns: [up.userId, up.contentItemId] }),
  })
);
