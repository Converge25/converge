import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  dueDate: timestamp("due_date").notNull(),
  priority: text("priority").notNull().default("medium"),
  completed: boolean("completed").notNull().default(false),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  dueDate: true,
  priority: true,
  completed: true,
  userId: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Email Campaigns table
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).pick({
  name: true,
  subject: true,
  content: true,
  status: true,
  scheduledAt: true,
  userId: true,
});

export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;

// SMS Campaigns table
export const smsCampaigns = pgTable("sms_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSmsCampaignSchema = createInsertSchema(smsCampaigns).pick({
  name: true,
  message: true,
  status: true,
  scheduledAt: true,
  userId: true,
});

export type InsertSmsCampaign = z.infer<typeof insertSmsCampaignSchema>;
export type SmsCampaign = typeof smsCampaigns.$inferSelect;

// Social Media Posts table
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).pick({
  name: true,
  content: true,
  platform: true,
  status: true,
  scheduledAt: true,
  userId: true,
});

export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;

// Popups table
export const popups = pgTable("popups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  style: jsonb("style").notNull(),
  triggers: jsonb("triggers").notNull(),
  targeting: jsonb("targeting").notNull(),
  status: text("status").notNull().default("draft"),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPopupSchema = createInsertSchema(popups).pick({
  name: true,
  content: true,
  style: true,
  triggers: true,
  targeting: true,
  status: true,
  userId: true,
});

export type InsertPopup = z.infer<typeof insertPopupSchema>;
export type Popup = typeof popups.$inferSelect;

// Leads table
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  source: text("source").notNull(),
  subscribed: boolean("subscribed").notNull().default(true),
  metadata: jsonb("metadata"),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  email: true,
  name: true,
  phone: true,
  source: true,
  subscribed: true,
  metadata: true,
  userId: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Analytics table
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  data: jsonb("data").notNull(),
  date: timestamp("date").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  type: true,
  data: true,
  date: true,
  userId: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique().notNull(),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("active"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  shopifyChargeId: text("shopify_charge_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  plan: true,
  status: true,
  startDate: true,
  endDate: true,
  shopifyChargeId: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Email Templates table
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  description: text("description"),
  category: text("category").notNull().default("general"),
  isDefault: boolean("is_default").notNull().default(false),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).pick({
  name: true,
  subject: true,
  content: true,
  description: true,
  category: true,
  isDefault: true,
  userId: true,
});

export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  emailCampaigns: many(emailCampaigns),
  smsCampaigns: many(smsCampaigns),
  socialPosts: many(socialPosts),
  popups: many(popups),
  leads: many(leads),
  analytics: many(analytics),
  subscription: many(subscriptions),
  emailTemplates: many(emailTemplates),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));

export const emailCampaignsRelations = relations(emailCampaigns, ({ one }) => ({
  user: one(users, { fields: [emailCampaigns.userId], references: [users.id] }),
}));

export const smsCampaignsRelations = relations(smsCampaigns, ({ one }) => ({
  user: one(users, { fields: [smsCampaigns.userId], references: [users.id] }),
}));

export const socialPostsRelations = relations(socialPosts, ({ one }) => ({
  user: one(users, { fields: [socialPosts.userId], references: [users.id] }),
}));

export const popupsRelations = relations(popups, ({ one }) => ({
  user: one(users, { fields: [popups.userId], references: [users.id] }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  user: one(users, { fields: [leads.userId], references: [users.id] }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  user: one(users, { fields: [analytics.userId], references: [users.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const emailTemplatesRelations = relations(emailTemplates, ({ one }) => ({
  user: one(users, { fields: [emailTemplates.userId], references: [users.id] }),
}));
