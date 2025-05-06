import { db } from "./index";
import * as schema from "@shared/schema";
import { z } from "zod";

async function seed() {
  try {
    // Check if users already exist to prevent duplicates
    const existingUsers = await db.query.users.findMany();
    
    // Check if email templates exist
    const existingTemplates = await db.query.emailTemplates.findMany();
    
    if (existingUsers.length === 0) {
      // Create demo user
      const demoUser = {
        username: "janesmith",
        password: "password123", // In a real app, this would be hashed
        email: "jane@examplestore.com",
        name: "Jane Smith",
        role: "admin"
      };
      
      const [user] = await db.insert(schema.users).values(demoUser).returning();
      console.log("Created demo user:", user.name);
      
      // Create tasks for demo user
      const tasks = [
        {
          title: "Schedule summer campaign",
          dueDate: new Date("2023-06-25"),
          priority: "primary",
          completed: false,
          userId: user.id
        },
        {
          title: "Design new pop-up template",
          dueDate: new Date("2023-06-26"),
          priority: "secondary",
          completed: false,
          userId: user.id
        },
        {
          title: "Review campaign analytics",
          dueDate: new Date("2023-06-28"),
          priority: "accent",
          completed: false,
          userId: user.id
        },
        {
          title: "Plan holiday promotion strategy",
          dueDate: new Date("2023-06-30"),
          priority: "warning",
          completed: false,
          userId: user.id
        }
      ];
      
      await db.insert(schema.tasks).values(tasks);
      console.log("Created demo tasks");
      
      // Create sample email campaigns
      const emailCampaigns = [
        {
          name: "Summer Sale Announcement",
          subject: "Summer Sale is Here! Up to 50% off",
          content: "<p>Check out our amazing summer deals!</p>",
          status: "completed",
          scheduledAt: new Date("2023-06-12"),
          sentAt: new Date("2023-06-12"),
          userId: user.id
        },
        {
          name: "Weekly Newsletter",
          subject: "This week's top products and news",
          content: "<p>Here's what's happening this week...</p>",
          status: "draft",
          userId: user.id
        }
      ];
      
      await db.insert(schema.emailCampaigns).values(emailCampaigns);
      console.log("Created sample email campaigns");
      
      // Create sample SMS campaigns
      const smsCampaigns = [
        {
          name: "Flash Sale Reminder",
          message: "48-hour flash sale! Use code FLASH30 for 30% off your purchase. Shop now!",
          status: "completed",
          scheduledAt: new Date("2023-06-18"),
          sentAt: new Date("2023-06-18"),
          userId: user.id
        },
        {
          name: "Abandoned Cart Reminder",
          message: "You left items in your cart! Complete your purchase now to secure your items.",
          status: "active",
          userId: user.id
        }
      ];
      
      await db.insert(schema.smsCampaigns).values(smsCampaigns);
      console.log("Created sample SMS campaigns");
      
      // Create sample social posts
      const socialPosts = [
        {
          name: "New Collection Post",
          content: "Our new summer collection has arrived! Check out our fresh styles for the season. #summerfashion #newcollection",
          platform: "instagram",
          status: "active",
          scheduledAt: new Date("2023-06-20"),
          publishedAt: new Date("2023-06-20"),
          userId: user.id
        },
        {
          name: "Product Highlight",
          content: "Our bestselling product is back in stock! Shop now before it's gone again.",
          platform: "facebook",
          status: "scheduled",
          scheduledAt: new Date("2023-06-25"),
          userId: user.id
        }
      ];
      
      await db.insert(schema.socialPosts).values(socialPosts);
      console.log("Created sample social posts");
      
      // Create sample popups
      const popups = [
        {
          name: "Newsletter Signup",
          content: "<h3>Join our newsletter</h3><p>Get 10% off your first order!</p>",
          style: {
            backgroundColor: "#ffffff",
            textColor: "#000000",
            width: "400px",
            height: "300px"
          },
          triggers: {
            timing: "exit_intent",
            delay: 5
          },
          targeting: {
            newVisitors: true,
            allPages: true
          },
          status: "scheduled",
          userId: user.id
        },
        {
          name: "Limited Time Offer",
          content: "<h3>Limited Time Offer!</h3><p>Use code SUMMER20 for 20% off</p>",
          style: {
            backgroundColor: "#f8e8d4",
            textColor: "#333333",
            width: "350px",
            height: "250px"
          },
          triggers: {
            timing: "timed",
            delay: 10
          },
          targeting: {
            newVisitors: false,
            pageUrls: ["/products", "/collections"]
          },
          status: "active",
          userId: user.id
        }
      ];
      
      await db.insert(schema.popups).values(popups);
      console.log("Created sample popups");
      
      // Create sample leads
      const leads = [
        {
          email: "customer1@example.com",
          name: "John Doe",
          phone: "555-123-4567",
          source: "popup",
          subscribed: true,
          metadata: {
            location: "New York",
            interests: ["clothing", "accessories"]
          },
          userId: user.id
        },
        {
          email: "customer2@example.com",
          name: "Sarah Jones",
          phone: "555-987-6543",
          source: "email",
          subscribed: true,
          metadata: {
            location: "Los Angeles",
            interests: ["home decor", "kitchen"]
          },
          userId: user.id
        },
        {
          email: "customer3@example.com",
          source: "website",
          subscribed: true,
          userId: user.id
        }
      ];
      
      await db.insert(schema.leads).values(leads);
      console.log("Created sample leads");
      
      // Create sample subscription
      const subscription = {
        userId: user.id,
        plan: "pro",
        status: "active",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-12-31"),
        shopifyChargeId: "ch_123456789"
      };
      
      await db.insert(schema.subscriptions).values(subscription);
      console.log("Created demo subscription");
      
      // Create sample email templates
      const emailTemplates = [
        {
          name: "Welcome Email",
          subject: "Welcome to {{store_name}}!",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to {{store_name}}!</h2>
            <p>Hi {{customer_name}},</p>
            <p>Thank you for signing up! We're excited to have you as part of our community.</p>
            <p>Here are a few things you can do:</p>
            <ul>
              <li>Browse our latest products</li>
              <li>Check out our current promotions</li>
              <li>Update your profile preferences</li>
            </ul>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Best regards,<br>The {{store_name}} Team</p>
          </div>`,
          description: "Sent to new customers when they create an account",
          category: "onboarding",
          isDefault: true,
          userId: user.id
        },
        {
          name: "Abandoned Cart Reminder",
          subject: "You left something in your cart",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your cart is waiting!</h2>
            <p>Hi {{customer_name}},</p>
            <p>We noticed you left some items in your shopping cart.</p>
            <p>Your cart includes:</p>
            <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px;">
              {{cart_items}}
            </div>
            <p><a href="{{cart_url}}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Complete your purchase</a></p>
            <p>If you have any questions, our customer service team is here to help.</p>
            <p>Best regards,<br>The {{store_name}} Team</p>
          </div>`,
          description: "Sent to customers who abandoned their carts",
          category: "recovery",
          isDefault: true,
          userId: user.id
        },
        {
          name: "Order Confirmation",
          subject: "Your order #{{order_number}} has been confirmed",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Order Confirmation</h2>
            <p>Hi {{customer_name}},</p>
            <p>Thank you for your order! We've received your payment and are processing your items.</p>
            <div style="padding: 15px; background-color: #f8f8f8; border-radius: 5px; margin: 15px 0;">
              <p><strong>Order Number:</strong> {{order_number}}</p>
              <p><strong>Order Date:</strong> {{order_date}}</p>
              <p><strong>Shipping Address:</strong> {{shipping_address}}</p>
              <p><strong>Payment Method:</strong> {{payment_method}}</p>
            </div>
            <div>
              <h3>Order Summary</h3>
              {{order_items}}
              <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px;">
                <p><strong>Subtotal:</strong> {{subtotal}}</p>
                <p><strong>Shipping:</strong> {{shipping_cost}}</p>
                <p><strong>Tax:</strong> {{tax}}</p>
                <p style="font-size: 18px;"><strong>Total:</strong> {{total}}</p>
              </div>
            </div>
            <p>We'll send you another email when your order ships. You can also check your order status <a href="{{order_status_url}}">here</a>.</p>
            <p>Thank you for shopping with us!</p>
            <p>Best regards,<br>The {{store_name}} Team</p>
          </div>`,
          description: "Sent when a customer places an order",
          category: "transactional",
          isDefault: true,
          userId: user.id
        },
        {
          name: "New Product Announcement",
          subject: "Just Launched: {{product_name}}",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Introducing: {{product_name}}</h2>
            <p>Hi {{customer_name}},</p>
            <p>We're excited to announce our newest product!</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="{{product_image}}" alt="{{product_name}}" style="max-width: 100%; height: auto; border-radius: 5px;">
              <h3>{{product_name}}</h3>
              <p>{{product_description}}</p>
              <p><strong>Price:</strong> {{product_price}}</p>
              <a href="{{product_url}}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Shop Now</a>
            </div>
            <p>Be quick! Our new products tend to sell out fast.</p>
            <p>Best regards,<br>The {{store_name}} Team</p>
          </div>`,
          description: "Used to announce new products to customers",
          category: "marketing",
          isDefault: true,
          userId: user.id
        },
        {
          name: "Sale Announcement",
          subject: "{{sale_name}} - Up to {{discount_percentage}}% Off!",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f44336; color: white; padding: 20px; text-align: center;">
              <h1>{{sale_name}}</h1>
              <h2>Save up to {{discount_percentage}}% Off!</h2>
              <p>Sale ends: {{sale_end_date}}</p>
            </div>
            <div style="padding: 20px;">
              <p>Hi {{customer_name}},</p>
              <p>We're having a massive sale, and we wanted to make sure you didn't miss out!</p>
              <p>For a limited time, enjoy discounts on hundreds of products across our store.</p>
              <div style="margin: 20px 0; text-align: center;">
                <a href="{{sale_url}}" style="display: inline-block; background-color: #f44336; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">Shop the Sale</a>
              </div>
              <div>
                <h3>Featured Sale Items</h3>
                {{featured_items}}
              </div>
              <p>Don't miss out on these incredible deals!</p>
              <p><strong>Use code:</strong> {{coupon_code}} at checkout for an additional {{extra_discount}}% off!</p>
              <p>Best regards,<br>The {{store_name}} Team</p>
            </div>
          </div>`,
          description: "Used to announce sales and promotions",
          category: "marketing",
          isDefault: true,
          userId: user.id
        }
      ];
      
      await db.insert(schema.emailTemplates).values(emailTemplates);
      console.log("Created sample email templates");
      
      console.log("Database seeding completed successfully");
    } else if (existingTemplates.length === 0 && existingUsers.length > 0) {
      // If we have users but no email templates, add the templates
      console.log("Adding email templates to existing database...");
      
      // Get the first user to associate templates with
      const user = existingUsers[0];
      
      // Create sample email templates
      const emailTemplates = [
        {
          name: "Welcome Email",
          subject: "Welcome to {{store_name}}!",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to {{store_name}}!</h2>
            <p>Hi {{customer_name}},</p>
            <p>Thank you for signing up! We're excited to have you as part of our community.</p>
            <p>Here are a few things you can do:</p>
            <ul>
              <li>Browse our latest products</li>
              <li>Check out our current promotions</li>
              <li>Update your profile preferences</li>
            </ul>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Best regards,<br>The {{store_name}} Team</p>
          </div>`,
          description: "Sent to new customers when they create an account",
          category: "onboarding",
          isDefault: true,
          userId: user.id
        },
        {
          name: "Abandoned Cart Reminder",
          subject: "You left something in your cart",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your cart is waiting!</h2>
            <p>Hi {{customer_name}},</p>
            <p>We noticed you left some items in your shopping cart.</p>
            <p>Your cart includes:</p>
            <div style="padding: 10px; background-color: #f8f8f8; border-radius: 5px;">
              {{cart_items}}
            </div>
            <p><a href="{{cart_url}}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Complete your purchase</a></p>
            <p>If you have any questions, our customer service team is here to help.</p>
            <p>Best regards,<br>The {{store_name}} Team</p>
          </div>`,
          description: "Sent to customers who abandoned their carts",
          category: "recovery",
          isDefault: true,
          userId: user.id
        },
        {
          name: "Order Confirmation",
          subject: "Your order #{{order_number}} has been confirmed",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Order Confirmation</h2>
            <p>Hi {{customer_name}},</p>
            <p>Thank you for your order! We've received your payment and are processing your items.</p>
            <div style="padding: 15px; background-color: #f8f8f8; border-radius: 5px; margin: 15px 0;">
              <p><strong>Order Number:</strong> {{order_number}}</p>
              <p><strong>Order Date:</strong> {{order_date}}</p>
              <p><strong>Shipping Address:</strong> {{shipping_address}}</p>
              <p><strong>Payment Method:</strong> {{payment_method}}</p>
            </div>
            <div>
              <h3>Order Summary</h3>
              {{order_items}}
              <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px;">
                <p><strong>Subtotal:</strong> {{subtotal}}</p>
                <p><strong>Shipping:</strong> {{shipping_cost}}</p>
                <p><strong>Tax:</strong> {{tax}}</p>
                <p style="font-size: 18px;"><strong>Total:</strong> {{total}}</p>
              </div>
            </div>
            <p>We'll send you another email when your order ships. You can also check your order status <a href="{{order_status_url}}">here</a>.</p>
            <p>Thank you for shopping with us!</p>
            <p>Best regards,<br>The {{store_name}} Team</p>
          </div>`,
          description: "Sent when a customer places an order",
          category: "transactional",
          isDefault: true,
          userId: user.id
        },
        {
          name: "New Product Announcement",
          subject: "Just Launched: {{product_name}}",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Introducing: {{product_name}}</h2>
            <p>Hi {{customer_name}},</p>
            <p>We're excited to announce our newest product!</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="{{product_image}}" alt="{{product_name}}" style="max-width: 100%; height: auto; border-radius: 5px;">
              <h3>{{product_name}}</h3>
              <p>{{product_description}}</p>
              <p><strong>Price:</strong> {{product_price}}</p>
              <a href="{{product_url}}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Shop Now</a>
            </div>
            <p>Be quick! Our new products tend to sell out fast.</p>
            <p>Best regards,<br>The {{store_name}} Team</p>
          </div>`,
          description: "Used to announce new products to customers",
          category: "marketing",
          isDefault: true,
          userId: user.id
        },
        {
          name: "Sale Announcement",
          subject: "{{sale_name}} - Up to {{discount_percentage}}% Off!",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f44336; color: white; padding: 20px; text-align: center;">
              <h1>{{sale_name}}</h1>
              <h2>Save up to {{discount_percentage}}% Off!</h2>
              <p>Sale ends: {{sale_end_date}}</p>
            </div>
            <div style="padding: 20px;">
              <p>Hi {{customer_name}},</p>
              <p>We're having a massive sale, and we wanted to make sure you didn't miss out!</p>
              <p>For a limited time, enjoy discounts on hundreds of products across our store.</p>
              <div style="margin: 20px 0; text-align: center;">
                <a href="{{sale_url}}" style="display: inline-block; background-color: #f44336; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">Shop the Sale</a>
              </div>
              <div>
                <h3>Featured Sale Items</h3>
                {{featured_items}}
              </div>
              <p>Don't miss out on these incredible deals!</p>
              <p><strong>Use code:</strong> {{coupon_code}} at checkout for an additional {{extra_discount}}% off!</p>
              <p>Best regards,<br>The {{store_name}} Team</p>
            </div>
          </div>`,
          description: "Used to announce sales and promotions",
          category: "marketing",
          isDefault: true,
          userId: user.id
        }
      ];
      
      await db.insert(schema.emailTemplates).values(emailTemplates);
      console.log("Created sample email templates");
      
    } else {
      console.log("Database already has users and email templates, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
