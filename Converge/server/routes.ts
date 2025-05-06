import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { eq } from "drizzle-orm";
import { 
  users, tasks, emailCampaigns, smsCampaigns, 
  socialPosts, popups, leads, analytics, emailTemplates
} from "@shared/schema";
import { 
  initializeEmailService, 
  sendEmail, 
  isEmailServiceConfigured,
  processTemplate,
  sendTemplateEmail
} from "./services/email.service";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiPrefix = "/api";

  // User authentication routes
  app.post(`${apiPrefix}/auth/login`, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd verify the password hash here
      
      // For now, just return user data
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard data route
  app.get(`${apiPrefix}/dashboard`, async (req, res) => {
    try {
      const dateRange = req.query.dateRange || "7days";
      
      // This would typically fetch real data based on the date range
      const dashboardData = {
        metrics: {
          revenue: {
            value: 24780,
            change: 12.5,
            isPositive: true
          },
          leads: {
            value: 384,
            change: 8.2,
            isPositive: true
          },
          emailOpenRate: {
            value: 23.5,
            change: 2.1,
            isPositive: false
          },
          conversionRate: {
            value: 3.8,
            change: 0.7,
            isPositive: true
          }
        },
        channelPerformance: [
          { name: "Email", percentage: 42 },
          { name: "SMS", percentage: 28 },
          { name: "Social Media", percentage: 18 },
          { name: "Pop-ups", percentage: 12 }
        ],
        revenueChart: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [3200, 2800, 3500, 4200, 3800, 4500, 5100]
        }
      };
      
      return res.status(200).json(dashboardData);
    } catch (error) {
      console.error("Dashboard data error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Tasks routes
  app.get(`${apiPrefix}/tasks`, async (req, res) => {
    try {
      const allTasks = await storage.getAllTasks();
      return res.status(200).json(allTasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/tasks`, async (req, res) => {
    try {
      const newTask = req.body;
      const createdTask = await storage.createTask(newTask);
      return res.status(201).json(createdTask);
    } catch (error) {
      console.error("Create task error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(`${apiPrefix}/tasks/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const taskData = req.body;
      const updatedTask = await storage.updateTask(parseInt(id), taskData);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Update task error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Email Campaigns routes
  app.get(`${apiPrefix}/email-campaigns`, async (req, res) => {
    try {
      const campaigns = await storage.getAllEmailCampaigns();
      return res.status(200).json(campaigns);
    } catch (error) {
      console.error("Get email campaigns error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/email-campaigns`, async (req, res) => {
    try {
      const campaignData = req.body;
      const newCampaign = await storage.createEmailCampaign(campaignData);
      return res.status(201).json(newCampaign);
    } catch (error) {
      console.error("Create email campaign error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // SMS Campaigns routes
  app.get(`${apiPrefix}/sms-campaigns`, async (req, res) => {
    try {
      const campaigns = await storage.getAllSmsCampaigns();
      return res.status(200).json(campaigns);
    } catch (error) {
      console.error("Get SMS campaigns error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/sms-campaigns`, async (req, res) => {
    try {
      const campaignData = req.body;
      const newCampaign = await storage.createSmsCampaign(campaignData);
      return res.status(201).json(newCampaign);
    } catch (error) {
      console.error("Create SMS campaign error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Social Media Posts routes
  app.get(`${apiPrefix}/social-posts`, async (req, res) => {
    try {
      const posts = await storage.getAllSocialPosts();
      return res.status(200).json(posts);
    } catch (error) {
      console.error("Get social posts error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/social-posts`, async (req, res) => {
    try {
      const postData = req.body;
      const newPost = await storage.createSocialPost(postData);
      return res.status(201).json(newPost);
    } catch (error) {
      console.error("Create social post error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Pop-ups routes
  app.get(`${apiPrefix}/popups`, async (req, res) => {
    try {
      const popupsList = await storage.getAllPopups();
      return res.status(200).json(popupsList);
    } catch (error) {
      console.error("Get popups error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/popups`, async (req, res) => {
    try {
      const popupData = req.body;
      const newPopup = await storage.createPopup(popupData);
      return res.status(201).json(newPopup);
    } catch (error) {
      console.error("Create popup error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Leads routes
  app.get(`${apiPrefix}/leads`, async (req, res) => {
    try {
      const leadsList = await storage.getAllLeads();
      return res.status(200).json(leadsList);
    } catch (error) {
      console.error("Get leads error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/leads`, async (req, res) => {
    try {
      const leadData = req.body;
      const newLead = await storage.createLead(leadData);
      return res.status(201).json(newLead);
    } catch (error) {
      console.error("Create lead error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics routes
  app.get(`${apiPrefix}/analytics`, async (req, res) => {
    try {
      const analyticsList = await storage.getAllAnalytics();
      return res.status(200).json(analyticsList);
    } catch (error) {
      console.error("Get analytics error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Email Templates routes
  app.get(`${apiPrefix}/email-templates`, async (req, res) => {
    try {
      const { category } = req.query;
      let templates;
      
      if (category) {
        templates = await storage.getEmailTemplatesByCategory(category as string);
      } else {
        templates = await storage.getAllEmailTemplates();
      }
      
      return res.status(200).json(templates);
    } catch (error) {
      console.error("Get email templates error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/email-templates/default`, async (req, res) => {
    try {
      const templates = await storage.getDefaultEmailTemplates();
      return res.status(200).json(templates);
    } catch (error) {
      console.error("Get default templates error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/email-templates/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getEmailTemplateById(parseInt(id));
      
      if (!template) {
        return res.status(404).json({ message: "Email template not found" });
      }
      
      return res.status(200).json(template);
    } catch (error) {
      console.error("Get email template error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Preview email template with variables
  app.post(`${apiPrefix}/email-templates/:id/preview`, async (req, res) => {
    try {
      const { id } = req.params;
      const { variables } = req.body;
      
      if (!variables) {
        return res.status(400).json({ message: "Variables are required for template preview" });
      }
      
      // Get the template
      const template = await storage.getEmailTemplateById(parseInt(id));
      
      if (!template) {
        return res.status(404).json({ message: "Email template not found" });
      }
      
      // Process the template with variables
      const processed = processTemplate(template, variables);
      
      return res.status(200).json({
        original: {
          subject: template.subject,
          content: template.content
        },
        processed: {
          subject: processed.subject,
          html: processed.html
        }
      });
    } catch (error) {
      console.error("Template preview error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/email-templates`, async (req, res) => {
    try {
      const templateData = req.body;
      const newTemplate = await storage.createEmailTemplate(templateData);
      return res.status(201).json(newTemplate);
    } catch (error) {
      console.error("Create email template error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(`${apiPrefix}/email-templates/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const templateData = req.body;
      const updatedTemplate = await storage.updateEmailTemplate(parseInt(id), templateData);
      
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Email template not found" });
      }
      
      return res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error("Update email template error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(`${apiPrefix}/email-templates/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTemplate = await storage.deleteEmailTemplate(parseInt(id));
      
      if (!deletedTemplate) {
        return res.status(404).json({ message: "Email template not found" });
      }
      
      return res.status(200).json({ message: "Email template deleted successfully" });
    } catch (error) {
      console.error("Delete email template error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Email Sending routes
  app.post(`${apiPrefix}/email/send`, async (req, res) => {
    try {
      // Initialize email service if not already initialized
      initializeEmailService();
      
      const { to, from, subject, text, html } = req.body;
      
      if (!to || !from || !subject) {
        return res.status(400).json({ 
          message: "Missing required fields: to, from, and subject are required" 
        });
      }
      
      if (!isEmailServiceConfigured()) {
        return res.status(503).json({ 
          message: "Email service is not configured. Please add a SendGrid API key." 
        });
      }
      
      const success = await sendEmail({
        to,
        from,
        subject,
        text,
        html
      });
      
      if (success) {
        return res.status(200).json({ message: "Email sent successfully" });
      } else {
        return res.status(500).json({ message: "Failed to send email" });
      }
    } catch (error) {
      console.error("Send email error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Email template sending endpoint
  app.post(`${apiPrefix}/email/send-template`, async (req, res) => {
    try {
      // Initialize email service if not already initialized
      initializeEmailService();
      
      const { templateId, to, from, variables } = req.body;
      
      if (!templateId || !to || !from || !variables) {
        return res.status(400).json({ 
          message: "Missing required fields: templateId, to, from, and variables are required" 
        });
      }
      
      if (!isEmailServiceConfigured()) {
        return res.status(503).json({ 
          message: "Email service is not configured. Please add a SendGrid API key." 
        });
      }
      
      // Get the email template
      const template = await storage.getEmailTemplateById(parseInt(templateId));
      
      if (!template) {
        return res.status(404).json({ message: "Email template not found" });
      }
      
      // Send the template email
      const success = await sendTemplateEmail(
        template,
        to,
        from,
        variables
      );
      
      if (success) {
        return res.status(200).json({ message: "Email sent successfully" });
      } else {
        return res.status(500).json({ message: "Failed to send email" });
      }
    } catch (error) {
      console.error("Send template email error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Email Service Status route
  app.get(`${apiPrefix}/email/status`, async (req, res) => {
    try {
      const configured = isEmailServiceConfigured();
      return res.status(200).json({ 
        configured,
        message: configured 
          ? "Email service is properly configured" 
          : "Email service is not configured. Please add a SendGrid API key."
      });
    } catch (error) {
      console.error("Email status error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
