import { db } from "@db";
import { eq } from "drizzle-orm";
import {
  users, tasks, emailCampaigns, smsCampaigns, socialPosts, popups, leads, analytics, subscriptions, emailTemplates,
  InsertUser, InsertTask, InsertEmailCampaign, InsertSmsCampaign, InsertSocialPost,
  InsertPopup, InsertLead, InsertAnalytics, InsertSubscription, InsertEmailTemplate
} from "@shared/schema";

class Storage {
  // User methods
  async getUserByUsername(username: string) {
    const result = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    return result;
  }

  async getUserById(id: number) {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id)
    });
    return result;
  }

  async createUser(userData: InsertUser) {
    const [newUser] = await db.insert(users).values(userData).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>) {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Task methods
  async getAllTasks() {
    const result = await db.query.tasks.findMany({
      orderBy: (tasks, { asc }) => [asc(tasks.dueDate)]
    });
    return result;
  }

  async getTaskById(id: number) {
    const result = await db.query.tasks.findFirst({
      where: eq(tasks.id, id)
    });
    return result;
  }

  async createTask(taskData: InsertTask) {
    const [newTask] = await db.insert(tasks).values(taskData).returning();
    return newTask;
  }

  async updateTask(id: number, taskData: Partial<InsertTask>) {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...taskData, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number) {
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    return deletedTask;
  }

  // Email Campaign methods
  async getAllEmailCampaigns() {
    const result = await db.query.emailCampaigns.findMany({
      orderBy: (emailCampaigns, { desc }) => [desc(emailCampaigns.createdAt)]
    });
    return result;
  }

  async getEmailCampaignById(id: number) {
    const result = await db.query.emailCampaigns.findFirst({
      where: eq(emailCampaigns.id, id)
    });
    return result;
  }

  async createEmailCampaign(campaignData: InsertEmailCampaign) {
    const [newCampaign] = await db.insert(emailCampaigns).values(campaignData).returning();
    return newCampaign;
  }

  async updateEmailCampaign(id: number, campaignData: Partial<InsertEmailCampaign>) {
    const [updatedCampaign] = await db
      .update(emailCampaigns)
      .set({ ...campaignData, updatedAt: new Date() })
      .where(eq(emailCampaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  // SMS Campaign methods
  async getAllSmsCampaigns() {
    const result = await db.query.smsCampaigns.findMany({
      orderBy: (smsCampaigns, { desc }) => [desc(smsCampaigns.createdAt)]
    });
    return result;
  }

  async getSmsCampaignById(id: number) {
    const result = await db.query.smsCampaigns.findFirst({
      where: eq(smsCampaigns.id, id)
    });
    return result;
  }

  async createSmsCampaign(campaignData: InsertSmsCampaign) {
    const [newCampaign] = await db.insert(smsCampaigns).values(campaignData).returning();
    return newCampaign;
  }

  async updateSmsCampaign(id: number, campaignData: Partial<InsertSmsCampaign>) {
    const [updatedCampaign] = await db
      .update(smsCampaigns)
      .set({ ...campaignData, updatedAt: new Date() })
      .where(eq(smsCampaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  // Social Post methods
  async getAllSocialPosts() {
    const result = await db.query.socialPosts.findMany({
      orderBy: (socialPosts, { desc }) => [desc(socialPosts.createdAt)]
    });
    return result;
  }

  async getSocialPostById(id: number) {
    const result = await db.query.socialPosts.findFirst({
      where: eq(socialPosts.id, id)
    });
    return result;
  }

  async createSocialPost(postData: InsertSocialPost) {
    const [newPost] = await db.insert(socialPosts).values(postData).returning();
    return newPost;
  }

  async updateSocialPost(id: number, postData: Partial<InsertSocialPost>) {
    const [updatedPost] = await db
      .update(socialPosts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(socialPosts.id, id))
      .returning();
    return updatedPost;
  }

  // Popup methods
  async getAllPopups() {
    const result = await db.query.popups.findMany({
      orderBy: (popups, { desc }) => [desc(popups.createdAt)]
    });
    return result;
  }

  async getPopupById(id: number) {
    const result = await db.query.popups.findFirst({
      where: eq(popups.id, id)
    });
    return result;
  }

  async createPopup(popupData: InsertPopup) {
    const [newPopup] = await db.insert(popups).values(popupData).returning();
    return newPopup;
  }

  async updatePopup(id: number, popupData: Partial<InsertPopup>) {
    const [updatedPopup] = await db
      .update(popups)
      .set({ ...popupData, updatedAt: new Date() })
      .where(eq(popups.id, id))
      .returning();
    return updatedPopup;
  }

  // Lead methods
  async getAllLeads() {
    const result = await db.query.leads.findMany({
      orderBy: (leads, { desc }) => [desc(leads.createdAt)]
    });
    return result;
  }

  async getLeadById(id: number) {
    const result = await db.query.leads.findFirst({
      where: eq(leads.id, id)
    });
    return result;
  }

  async createLead(leadData: InsertLead) {
    const [newLead] = await db.insert(leads).values(leadData).returning();
    return newLead;
  }

  async updateLead(id: number, leadData: Partial<InsertLead>) {
    const [updatedLead] = await db
      .update(leads)
      .set({ ...leadData, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updatedLead;
  }

  // Analytics methods
  async getAllAnalytics() {
    const result = await db.query.analytics.findMany({
      orderBy: (analytics, { desc }) => [desc(analytics.date)]
    });
    return result;
  }

  async createAnalyticsEntry(analyticsData: InsertAnalytics) {
    const [newEntry] = await db.insert(analytics).values(analyticsData).returning();
    return newEntry;
  }

  // Subscription methods
  async getSubscriptionByUserId(userId: number) {
    const result = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId)
    });
    return result;
  }

  async createSubscription(subscriptionData: InsertSubscription) {
    const [newSubscription] = await db.insert(subscriptions).values(subscriptionData).returning();
    return newSubscription;
  }

  async updateSubscription(id: number, subscriptionData: Partial<InsertSubscription>) {
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set({ ...subscriptionData, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return updatedSubscription;
  }

  // Email Template methods
  async getAllEmailTemplates() {
    const result = await db.query.emailTemplates.findMany({
      orderBy: (emailTemplates, { desc }) => [desc(emailTemplates.createdAt)]
    });
    return result;
  }

  async getEmailTemplateById(id: number) {
    const result = await db.query.emailTemplates.findFirst({
      where: eq(emailTemplates.id, id)
    });
    return result;
  }

  async getEmailTemplatesByCategory(category: string) {
    const result = await db.query.emailTemplates.findMany({
      where: eq(emailTemplates.category, category),
      orderBy: (emailTemplates, { desc }) => [desc(emailTemplates.createdAt)]
    });
    return result;
  }

  async getDefaultEmailTemplates() {
    const result = await db.query.emailTemplates.findMany({
      where: eq(emailTemplates.isDefault, true),
      orderBy: (emailTemplates, { desc }) => [desc(emailTemplates.createdAt)]
    });
    return result;
  }

  async createEmailTemplate(templateData: InsertEmailTemplate) {
    const [newTemplate] = await db.insert(emailTemplates).values(templateData).returning();
    return newTemplate;
  }

  async updateEmailTemplate(id: number, templateData: Partial<InsertEmailTemplate>) {
    const [updatedTemplate] = await db
      .update(emailTemplates)
      .set({ ...templateData, updatedAt: new Date() })
      .where(eq(emailTemplates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteEmailTemplate(id: number) {
    const [deletedTemplate] = await db
      .delete(emailTemplates)
      .where(eq(emailTemplates.id, id))
      .returning();
    return deletedTemplate;
  }
}

export const storage = new Storage();
