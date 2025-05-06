import { MailService, MailDataRequired } from '@sendgrid/mail';
import { log } from '../vite';
import { EmailTemplate } from '@shared/schema';

// Create a mail service instance
const mailService = new MailService();

// Interface for email parameters
export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Initialize the SendGrid mail service with API key
 * This should be called when the application starts
 */
export function initializeEmailService(): boolean {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      log('SendGrid API key is not set. Email functionality will be limited.', 'email-service');
      return false;
    }
    
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    log('SendGrid email service initialized', 'email-service');
    return true;
  } catch (error) {
    log(`Failed to initialize SendGrid email service: ${error}`, 'email-service');
    return false;
  }
}

/**
 * Send an email through SendGrid
 * @param params Email parameters including to, from, subject and content
 * @returns Promise resolving to success status
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      log('Cannot send email: SendGrid API key is not set', 'email-service');
      return false;
    }

    const mailData: MailDataRequired = {
      to: params.to,
      from: params.from, 
      subject: params.subject || '',
      text: params.text || '',
      html: params.html || '',
    };
    
    await mailService.send(mailData);
    
    log(`Email sent successfully to: ${params.to}`, 'email-service');
    return true;
  } catch (error) {
    log(`SendGrid email error: ${error}`, 'email-service');
    return false;
  }
}

/**
 * Check if email service is properly configured
 * @returns Boolean indicating if service is ready
 */
export function isEmailServiceConfigured(): boolean {
  return !!process.env.SENDGRID_API_KEY;
}

/**
 * Process email template by replacing template variables with actual values
 * @param template Email template object from database
 * @param variables Key-value pairs of variables to replace in template
 * @returns Processed template with variables replaced
 */
export function processTemplate(template: EmailTemplate, variables: Record<string, string>): { 
  subject: string, 
  html: string 
} {
  let subject = template.subject;
  let html = template.content;
  
  // Replace all variables in subject and content
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(placeholder, value);
    html = html.replace(placeholder, value);
  });
  
  return { subject, html };
}

/**
 * Send an email using a template
 * @param template Email template to use
 * @param to Recipient email address
 * @param from Sender email address
 * @param variables Variables to replace in the template
 * @returns Promise resolving to success status
 */
export async function sendTemplateEmail(
  template: EmailTemplate,
  to: string,
  from: string,
  variables: Record<string, string>
): Promise<boolean> {
  try {
    // Process the template
    const { subject, html } = processTemplate(template, variables);
    
    // Send the email
    return await sendEmail({
      to,
      from,
      subject,
      html
    });
  } catch (error) {
    log(`Template email error: ${error}`, 'email-service');
    return false;
  }
}