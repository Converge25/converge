import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getQueryFn, queryClient, apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { EmailTemplate } from "@shared/schema";
import { AlertCircle, Check, ChevronDown, MailCheck, Pencil, Plus, Send, Wand, Save, X, Copy, Code, FileText, Trash2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailTemplateVariables {
  [key: string]: string;
}

interface TemplatePreviewResponse {
  original: {
    subject: string;
    content: string;
  };
  processed: {
    subject: string;
    html: string;
  };
}

export default function EmailMarketing() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("templates");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<EmailTemplateVariables>({});
  const [testEmailTo, setTestEmailTo] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");
  const { toast } = useToast();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Fetch email service status
  interface EmailServiceStatus {
    configured: boolean;
    message: string;
  }
  
  const { data: emailServiceStatus } = useQuery<EmailServiceStatus>({
    queryKey: ['/api/email/status'],
    queryFn: getQueryFn({ on401: "returnNull" })
  });

  // Fetch email templates
  const { 
    data: templates, 
    isLoading: isLoadingTemplates,
    isError: isTemplatesError
  } = useQuery<EmailTemplate[]>({
    queryKey: ['/api/email-templates', selectedCategory],
    queryFn: getQueryFn({ on401: "returnNull" }),
    select: (data) => {
      if (selectedCategory === "all") {
        return data;
      } else {
        return data.filter(template => template.category === selectedCategory);
      }
    }
  });

  // Template preview mutation
  const previewMutation = useMutation<
    TemplatePreviewResponse, 
    Error, 
    { templateId: number, variables: EmailTemplateVariables }
  >({
    mutationFn: async ({ templateId, variables }) => {
      return apiRequest<TemplatePreviewResponse>(`/api/email-templates/${templateId}/preview`, {
        method: "POST",
        body: JSON.stringify({ variables }),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (data) => {
      setPreviewHtml(data.processed.html);
      setPreviewSubject(data.processed.subject);
      toast({
        title: "Preview generated",
        description: "Email preview has been updated with your variables."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Preview failed",
        description: "Failed to generate email preview. Please try again."
      });
    }
  });

  // Send test email mutation
  interface SendEmailResponse {
    success: boolean;
    message: string;
  }
  
  const sendTestEmailMutation = useMutation<
    SendEmailResponse,
    Error,
    { 
      templateId: number, 
      to: string, 
      variables: EmailTemplateVariables 
    }
  >({
    mutationFn: async ({ templateId, to, variables }) => {
      return apiRequest<SendEmailResponse>('/api/email/send-template', {
        method: "POST",
        body: JSON.stringify({ 
          templateId, 
          to, 
          from: "test@yourshopifyapp.com", // This would come from user settings in production
          variables 
        }),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      toast({
        title: "Email sent",
        description: "Test email has been sent successfully."
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: error.message || "Could not send test email. Please check your settings."
      });
    }
  });

  // Extract variables from template content when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const combinedContent = selectedTemplate.subject + selectedTemplate.content;
      const matches = combinedContent.match(/{{([^}]+)}}/g) || [];
      
      const variables: EmailTemplateVariables = {};
      matches.forEach(match => {
        const key = match.replace("{{", "").replace("}}", "");
        variables[key] = variables[key] || "";
      });
      
      setTemplateVariables(variables);
      
      // Reset preview
      setPreviewHtml("");
      setPreviewSubject("");
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTemplate(null);
  };

  const handleVariableChange = (key: string, value: string) => {
    setTemplateVariables(prev => ({ ...prev, [key]: value }));
  };

  const handleGeneratePreview = () => {
    if (selectedTemplate) {
      previewMutation.mutate({ 
        templateId: selectedTemplate.id, 
        variables: templateVariables 
      });
    }
  };

  const handleSendTestEmail = () => {
    if (!selectedTemplate || !testEmailTo) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a template and enter a valid email address."
      });
      return;
    }

    if (!emailServiceStatus?.configured) {
      toast({
        variant: "destructive",
        title: "Email service not configured",
        description: "Please add your SendGrid API key to send emails."
      });
      return;
    }

    sendTestEmailMutation.mutate({
      templateId: selectedTemplate.id,
      to: testEmailTo,
      variables: templateVariables
    });
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "onboarding": "Onboarding",
      "marketing": "Marketing",
      "transactional": "Transactional",
      "recovery": "Recovery",
      "general": "General"
    };
    return categoryMap[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const categoryColorMap: { [key: string]: string } = {
      "onboarding": "bg-green-100 text-green-800",
      "marketing": "bg-purple-100 text-purple-800",
      "transactional": "bg-blue-100 text-blue-800",
      "recovery": "bg-amber-100 text-amber-800",
      "general": "bg-gray-100 text-gray-800"
    };
    return categoryColorMap[category] || "bg-gray-100 text-gray-800";
  };

// Campaign List Component
function CampaignsList() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  // Fetch email campaigns
  const { data: campaigns, isLoading, isError } = useQuery<{
    id: number;
    name: string;
    subject: string;
    status: string;
    scheduledAt: string;
    sentAt: string | null;
    createdAt: string;
  }[]>({
    queryKey: ['/api/email-campaigns'],
    queryFn: getQueryFn({ on401: "returnNull" })
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'draft': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'sending': 'bg-orange-100 text-orange-800',
      'sent': 'bg-green-100 text-green-800',
      'error': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="divide-y">
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Campaign
        </Button>
      </div>
      
      {isLoading && (
        <div className="p-6 text-center">
          <p className="text-neutral-medium">Loading campaigns...</p>
        </div>
      )}
      
      {isError && (
        <div className="p-6 text-center">
          <p className="text-red-500">Error loading campaigns</p>
        </div>
      )}
      
      {campaigns && campaigns.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-neutral-medium">No campaigns created yet</p>
        </div>
      )}
      
      {campaigns && campaigns.map(campaign => (
        <div key={campaign.id} className="p-4 hover:bg-neutral-50 cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-neutral-darkest">{campaign.name}</h3>
            <Badge className={getStatusBadge(campaign.status)}>{campaign.status}</Badge>
          </div>
          <p className="text-sm text-neutral-medium mb-1">{campaign.subject}</p>
          <div className="flex justify-between items-center mt-2 text-xs text-neutral-medium">
            <span>Created: {formatDate(campaign.createdAt)}</span>
            {campaign.status === 'scheduled' && (
              <span>Scheduled for: {formatDate(campaign.scheduledAt)}</span>
            )}
            {campaign.status === 'sent' && (
              <span>Sent: {formatDate(campaign.sentAt)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Template Creator Component
function CreateTemplateForm() {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [templateCategory, setTemplateCategory] = useState('general');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [variablesDetected, setVariablesDetected] = useState<string[]>([]);
  
  // Extract variables on content change
  useEffect(() => {
    const combinedContent = templateSubject + templateContent;
    const matches = combinedContent.match(/{{([^}]+)}}/g) || [];
    const uniqueVariables = Array.from(new Set(
      matches.map(match => match.replace("{{", "").replace("}}", ""))
    ));
    setVariablesDetected(uniqueVariables);
  }, [templateContent, templateSubject]);
  
  // Template preview mutation
  const previewTemplateMutation = useMutation<
    TemplatePreviewResponse,
    Error,
    { content: string, subject: string, variables: EmailTemplateVariables }
  >({
    mutationFn: async ({ content, subject, variables }) => {
      return apiRequest<TemplatePreviewResponse>('/api/email-templates/preview-raw', {
        method: "POST",
        body: JSON.stringify({ 
          content,
          subject,
          variables
        }),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (data) => {
      setPreviewHtml(data.processed.html);
      setPreviewSubject(data.processed.subject);
      setIsPreviewOpen(true);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Preview failed",
        description: "Failed to generate template preview."
      });
    }
  });
  
  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return apiRequest('/api/email-templates', {
        method: 'POST',
        body: JSON.stringify(templateData),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      toast({
        title: 'Template created',
        description: 'Your email template has been created successfully.',
      });
      
      // Reset form
      setTemplateName('');
      setTemplateSubject('');
      setTemplateContent('');
      setTemplateDescription('');
      setTemplateCategory('general');
      
      // Invalidate templates query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/email-templates'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create template. Please try again.',
        variant: 'destructive'
      });
      console.error('Error creating template:', error);
    }
  });
  
  const handlePreviewTemplate = () => {
    if (!templateContent || !templateSubject) {
      toast({
        variant: "destructive",
        title: "Missing content",
        description: "Please provide both subject and content for the template."
      });
      return;
    }
    
    // Create sample data for variables
    const variables: EmailTemplateVariables = {};
    variablesDetected.forEach(variable => {
      // Provide sensible defaults based on variable names
      switch (variable) {
        case 'customer_name':
          variables[variable] = 'John Doe';
          break;
        case 'shop_name':
          variables[variable] = 'Sample Shop';
          break;
        case 'product_name':
          variables[variable] = 'Featured Product';
          break;
        case 'order_number':
          variables[variable] = '12345';
          break;
        case 'discount_code':
          variables[variable] = 'SAMPLE10';
          break;
        default:
          variables[variable] = `[${variable}]`;
      }
    });
    
    previewTemplateMutation.mutate({
      content: templateContent,
      subject: templateSubject,
      variables
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!templateName || !templateSubject || !templateContent) {
      toast({
        title: 'Missing fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    const templateData = {
      name: templateName,
      subject: templateSubject,
      content: templateContent,
      category: templateCategory,
      description: templateDescription,
      userId: 1 // Default user ID for now
    };
    
    createTemplateMutation.mutate(templateData);
  };
  
  // Sample template data for quick insertion
  const sampleTemplates = [
    {
      name: 'Welcome Email',
      subject: 'Welcome to {{shop_name}}!',
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Welcome to {{shop_name}}!</h2>
  <p>Hello {{customer_name}},</p>
  <p>Thank you for joining our community. We're excited to have you on board!</p>
  <p>Here are some things you might want to check out:</p>
  <ul>
    <li>Browse our latest collections</li>
    <li>Complete your profile</li>
    <li>Check out our loyalty program</li>
  </ul>
  <p>Use code <strong>{{discount_code}}</strong> for 10% off your first purchase.</p>
  <p>Best regards,<br>The {{shop_name}} Team</p>
</div>`
    },
    {
      name: 'Order Confirmation',
      subject: 'Your order #{{order_number}} has been confirmed',
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Order Confirmation</h2>
  <p>Hello {{customer_name}},</p>
  <p>Your order #{{order_number}} has been confirmed and is being processed.</p>
  <p>Thank you for shopping with {{shop_name}}!</p>
  <p>Best regards,<br>The {{shop_name}} Team</p>
</div>`
    }
  ];
  
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex gap-4 mb-5">
        <Button
          type="button" 
          variant="outline"
          className="flex-1"
          onClick={() => {
            const template = sampleTemplates[0];
            setTemplateName(template.name + ' (Custom)');
            setTemplateSubject(template.subject);
            setTemplateContent(template.content);
            setTemplateCategory('onboarding');
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          Welcome Template
        </Button>
        <Button
          type="button" 
          variant="outline"
          className="flex-1"
          onClick={() => {
            const template = sampleTemplates[1];
            setTemplateName(template.name + ' (Custom)');
            setTemplateSubject(template.subject);
            setTemplateContent(template.content);
            setTemplateCategory('transactional');
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          Order Template
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-name">Template Name *</Label>
        <Input 
          id="template-name" 
          placeholder="E.g., Welcome Email, Order Confirmation" 
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-subject">Email Subject Line *</Label>
        <Input 
          id="template-subject" 
          placeholder="E.g., Welcome to {{shop_name}}!" 
          value={templateSubject}
          onChange={(e) => setTemplateSubject(e.target.value)}
          required
        />
        <p className="text-xs text-neutral-medium">
          Use {{variable_name}} for dynamic content
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-category">Category *</Label>
        <Select value={templateCategory} onValueChange={setTemplateCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="onboarding">Onboarding</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="transactional">Transactional</SelectItem>
            <SelectItem value="recovery">Recovery</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-description">Description (Optional)</Label>
        <Textarea 
          id="template-description" 
          placeholder="Brief description of this template's purpose" 
          value={templateDescription}
          onChange={(e) => setTemplateDescription(e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="template-content">Email Content *</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-primary-500 hover:text-primary-600 h-6 py-0 px-1"
            onClick={() => {
              navigator.clipboard.writeText('{{variable_name}}');
              toast({
                title: 'Copied to clipboard',
                description: 'Variable placeholder copied. Paste it in your content.'
              });
            }}
          >
            <Code className="w-3 h-3 mr-1" />
            Copy variable format
          </Button>
        </div>
        <Textarea 
          id="template-content" 
          placeholder="<div><h1>Hello {{customer_name}}</h1><p>Welcome to our store!</p></div>" 
          value={templateContent}
          onChange={(e) => setTemplateContent(e.target.value)}
          className="font-mono text-sm"
          rows={12}
          required
        />
        <p className="text-xs text-neutral-medium">
          Use HTML for formatting. Variables like {{customer_name}} will be replaced with actual data.
        </p>
      </div>
      
      {variablesDetected.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Variables Detected:</h4>
          <div className="flex flex-wrap gap-2">
            {variablesDetected.map(variable => (
              <Badge key={variable} variant="outline" className="bg-white">
                {variable}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="pt-4 flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handlePreviewTemplate}
          disabled={previewTemplateMutation.isPending || !templateContent || !templateSubject}
          className="flex-1"
        >
          <Wand className="w-4 h-4 mr-2" />
          {previewTemplateMutation.isPending ? 'Generating...' : 'Preview Template'}
        </Button>
        
        <Button 
          type="submit" 
          disabled={createTemplateMutation.isPending}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {createTemplateMutation.isPending ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-neutral-50 border px-3 py-2 rounded mb-2">
            <p className="text-sm"><span className="font-medium">Subject:</span> {previewSubject}</p>
          </div>
          <ScrollArea className="flex-1 border rounded max-h-[60vh]">
            <div className="p-4">
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}

// Campaign Form Component
function CampaignForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [audience, setAudience] = useState('all_contacts');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [templatePreview, setTemplatePreview] = useState<{html: string, subject: string} | null>(null);
  
  // Fetch email templates for the dropdown
  const { data: templates } = useQuery<EmailTemplate[]>({
    queryKey: ['/api/email-templates'],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  // Get the selected template details
  const selectedTemplate = templates?.find(t => t.id.toString() === templateId);
  
  // Template preview mutation
  const templatePreviewMutation = useMutation<
    TemplatePreviewResponse,
    Error,
    { templateId: number }
  >({
    mutationFn: async ({ templateId }) => {
      return apiRequest<TemplatePreviewResponse>(`/api/email-templates/${templateId}/preview`, {
        method: "POST",
        body: JSON.stringify({ 
          variables: {
            customer_name: "Test Customer",
            shop_name: "Sample Shop",
            product_name: "Sample Product",
            order_number: "12345",
            discount_code: "SAMPLE10",
            // Add default values for common variables
          } 
        }),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (data) => {
      setTemplatePreview({
        html: data.processed.html,
        subject: data.processed.subject
      });
    },
    onError: () => {
      setTemplatePreview(null);
      toast({
        variant: "destructive",
        title: "Preview failed",
        description: "Failed to generate template preview."
      });
    }
  });
  
  // Fetch template preview when template is selected
  useEffect(() => {
    if (templateId) {
      templatePreviewMutation.mutate({ templateId: parseInt(templateId) });
    } else {
      setTemplatePreview(null);
    }
  }, [templateId]);
  
  // Mutation for creating a campaign
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      return apiRequest('/api/email-campaigns', {
        method: 'POST',
        body: JSON.stringify(campaignData),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      toast({
        title: 'Campaign created',
        description: 'Your email campaign has been created successfully.',
        variant: 'default'
      });
      
      // Reset form
      setCampaignName('');
      setSubject('');
      setTemplateId('');
      setScheduleDate('');
      setScheduleTime('');
      setAudience('all_contacts');
      setTemplatePreview(null);
      
      // Invalidate campaigns query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/email-campaigns'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'destructive'
      });
      console.error('Error creating campaign:', error);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignName || !subject || !templateId) {
      toast({
        title: 'Error',
        description: 'Please fill out all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    // Prepare scheduled date if provided
    let scheduledAt = null;
    if (scheduleDate && scheduleTime) {
      scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    }
    
    // Create campaign data
    const campaignData = {
      name: campaignName,
      subject,
      templateId: parseInt(templateId),
      audience,
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduledAt,
      userId: 1 // Default user ID for now
    };
    
    createCampaignMutation.mutate(campaignData);
  };
  
  // Template selection component
  const TemplateSelector = () => (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>Select a Template</CardTitle>
          <CardDescription>Choose an email template for your campaign</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates && templates.map(template => (
            <div 
              key={template.id}
              onClick={() => {
                setTemplateId(template.id.toString());
                if (subject === '') {
                  setSubject(template.subject);
                }
                setShowTemplateSelector(false);
              }}
              className={`border rounded-md p-4 cursor-pointer transition-all hover:shadow-md ${
                templateId === template.id.toString() ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-neutral-darkest">{template.name}</h3>
                <Badge className={getCategoryColor(template.category)}>{getCategoryLabel(template.category)}</Badge>
              </div>
              <p className="text-sm text-neutral-medium mt-1">{template.subject}</p>
              <p className="text-xs text-neutral-medium mt-2 mb-2">{template.description || 'No description'}</p>
              <div className="mt-3 border-t pt-2 flex justify-between items-center">
                <span className="text-xs text-neutral-medium">
                  {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'No date'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setTemplateId(template.id.toString());
                    setShowTemplateSelector(false);
                  }}
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t pt-3 flex justify-between">
          <Button variant="outline" onClick={() => setShowTemplateSelector(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => setShowTemplateSelector(false)}
            disabled={!templateId}
          >
            Confirm Selection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Campaign Name *</Label>
        <Input 
          id="campaign-name" 
          placeholder="Enter campaign name" 
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="campaign-subject">Subject Line *</Label>
        <Input 
          id="campaign-subject" 
          placeholder="Enter email subject line" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="campaign-template">Email Template *</Label>
          <Button 
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => setShowTemplateSelector(true)}
            className="text-primary-500 hover:text-primary-600 h-6 py-0 px-1"
          >
            Browse Templates
          </Button>
        </div>
        
        <div 
          className="border rounded-md p-3 cursor-pointer hover:border-primary-500 transition-colors"
          onClick={() => setShowTemplateSelector(true)}
        >
          {selectedTemplate ? (
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{selectedTemplate.name}</h3>
                <Badge className={getCategoryColor(selectedTemplate.category)}>
                  {getCategoryLabel(selectedTemplate.category)}
                </Badge>
              </div>
              <p className="text-sm text-neutral-medium mt-1">{selectedTemplate.subject}</p>
            </div>
          ) : (
            <div className="text-center py-2 text-neutral-medium">
              <Wand className="w-4 h-4 mx-auto mb-1" />
              <p>Click to select a template</p>
            </div>
          )}
        </div>
        
        {/* Template preview */}
        {templatePreview && (
          <div className="mt-3 border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Template Preview</h4>
              <Badge variant="outline" className="text-xs">Using sample data</Badge>
            </div>
            <div className="bg-neutral-50 px-3 py-2 rounded mb-2 border">
              <p className="text-sm"><span className="font-medium">Subject:</span> {templatePreview.subject}</p>
            </div>
            <div className="border rounded p-2 max-h-[200px] overflow-y-auto">
              <div 
                className="email-preview-mini"
                dangerouslySetInnerHTML={{ __html: templatePreview.html }} 
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="campaign-audience">Target Audience *</Label>
        <Select value={audience} onValueChange={setAudience}>
          <SelectTrigger>
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_contacts">All Contacts</SelectItem>
            <SelectItem value="new_customers">New Customers</SelectItem>
            <SelectItem value="returning_customers">Returning Customers</SelectItem>
            <SelectItem value="inactive_customers">Inactive Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="campaign-schedule">Schedule (Optional)</Label>
        <div className="flex items-center space-x-2">
          <Input 
            type="date" 
            className="w-full"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Min date is today
          />
          <Input 
            type="time" 
            className="w-full"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />
        </div>
        <p className="text-xs text-neutral-medium">
          Leave empty to save as draft. You can send or schedule later.
        </p>
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={createCampaignMutation.isPending}
        >
          {createCampaignMutation.isPending ? (
            <>Processing...</>
          ) : scheduleDate && scheduleTime ? (
            <>Schedule Campaign</>
          ) : (
            <>Save as Draft</>
          )}
        </Button>
      </div>
      
      {showTemplateSelector && <TemplateSelector />}
    </form>
  );
}

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Email Marketing" toggleMobileSidebar={toggleMobileSidebar} />
        
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-6 px-4 md:px-6 lg:px-8 bg-neutral-lightest">
          <div className="py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-darkest">Email Marketing</h2>
                <p className="mt-1 text-neutral-medium">Create and manage email marketing campaigns</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button 
                  onClick={() => {
                    setSelectedTab("campaigns");
                  }}
                >
                  Create Campaign
                </Button>
              </div>
            </div>

            {emailServiceStatus && !emailServiceStatus.configured && (
              <Alert className="mb-6 border-amber-300 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">SendGrid API Key Required</AlertTitle>
                <AlertDescription className="text-amber-600">
                  To send emails, you need to add your SendGrid API key in the settings. Email preview will still work without an API key.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="templates" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="templates">Email Templates</TabsTrigger>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates">
                <Tabs defaultValue="browse">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="browse">Browse Templates</TabsTrigger>
                    <TabsTrigger value="create">Create Template</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="browse">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Templates list panel */}
                      <div className="col-span-1">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Email Templates</CardTitle>
                        <CardDescription>Select a template to preview or test</CardDescription>
                        <div className="mt-3">
                          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="onboarding">Onboarding</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="transactional">Transactional</SelectItem>
                              <SelectItem value="recovery">Recovery</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent className="max-h-[500px] overflow-y-auto">
                        {isLoadingTemplates && <p>Loading templates...</p>}
                        {isTemplatesError && <p className="text-red-500">Error loading templates</p>}
                        {templates && templates.length === 0 && (
                          <p className="text-center text-neutral-medium py-4">No templates found</p>
                        )}
                        {templates && templates.map(template => (
                          <div 
                            key={template.id}
                            className={`p-3 mb-2 rounded-md cursor-pointer border hover:bg-neutral-50 transition-colors ${selectedTemplate?.id === template.id ? 'border-primary-300 bg-primary-50' : 'border-neutral-200'}`}
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-neutral-darkest">{template.name}</h3>
                              <Badge className={getCategoryColor(template.category)}>{getCategoryLabel(template.category)}</Badge>
                            </div>
                            <p className="text-sm text-neutral-medium mt-1">{template.subject}</p>
                            <p className="text-xs text-neutral-medium mt-2 truncate">{template.description || 'No description'}</p>
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            toast({
                              title: "Template Creation",
                              description: "Template creation feature coming soon!"
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Create New Template
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  {/* Template variables and preview panel */}
                  <div className="col-span-1 lg:col-span-2">
                    {selectedTemplate ? (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>{selectedTemplate.name}</CardTitle>
                            <CardDescription>{selectedTemplate.description || 'No description available'}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h3 className="font-medium text-sm">Template Variables</h3>
                                {Object.keys(templateVariables).length === 0 ? (
                                  <p className="text-neutral-medium text-sm">No variables found in this template</p>
                                ) : (
                                  Object.keys(templateVariables).map(key => (
                                    <div key={key} className="space-y-2">
                                      <Label htmlFor={`var-${key}`} className="text-xs uppercase">{key}</Label>
                                      <Input 
                                        id={`var-${key}`}
                                        value={templateVariables[key]}
                                        onChange={(e) => handleVariableChange(key, e.target.value)}
                                        placeholder={`Enter value for ${key}`}
                                      />
                                    </div>
                                  ))
                                )}
                                <div className="pt-4">
                                  <Button 
                                    onClick={handleGeneratePreview}
                                    disabled={previewMutation.isPending}
                                    className="w-full"
                                  >
                                    Generate Preview
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h3 className="font-medium text-sm">Test Email</h3>
                                <div className="space-y-2">
                                  <Label htmlFor="test-email">Recipient Email</Label>
                                  <Input 
                                    id="test-email"
                                    type="email"
                                    placeholder="Enter test email address"
                                    value={testEmailTo}
                                    onChange={(e) => setTestEmailTo(e.target.value)}
                                  />
                                </div>
                                <div className="pt-8">
                                  <Button 
                                    variant="secondary"
                                    onClick={handleSendTestEmail}
                                    disabled={sendTestEmailMutation.isPending || !testEmailTo || !emailServiceStatus?.configured}
                                    className="w-full"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Test Email
                                  </Button>
                                  {!emailServiceStatus?.configured && (
                                    <p className="text-xs text-neutral-medium mt-1 text-center">
                                      SendGrid API key required to send emails
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {previewHtml && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <MailCheck className="w-5 h-5 mr-2 text-primary-500" />
                                Email Preview
                              </CardTitle>
                              <div className="mt-2 px-3 py-2 bg-neutral-50 rounded border">
                                <p className="text-sm font-medium">Subject: {previewSubject}</p>
                              </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-6">
                              <div 
                                className="email-preview-container border rounded p-4 max-h-[500px] overflow-y-auto"
                                dangerouslySetInnerHTML={{ __html: previewHtml }} 
                              />
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <Card className="h-full flex flex-col justify-center items-center p-8">
                        <div className="text-center max-w-md">
                          <h3 className="text-xl font-medium mb-2">Select a Template</h3>
                          <p className="text-neutral-medium mb-4">
                            Choose an email template from the list to preview and customize it with your variables
                          </p>
                          <div className="flex justify-center">
                            <ChevronDown className="animate-bounce h-6 w-6 text-primary-500" />
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
                  </TabsContent>
                  
                  <TabsContent value="create">
                    <div className="grid grid-cols-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Create New Email Template</CardTitle>
                          <CardDescription>Design your own email templates with dynamic content</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <CreateTemplateForm />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="campaigns">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Campaigns list */}
                  <div className="col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Campaigns</CardTitle>
                        <CardDescription>Manage your email marketing campaigns</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                        {/* Campaign list */}
                        <CampaignsList />
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Campaign form */}
                  <div className="col-span-1 lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create New Campaign</CardTitle>
                        <CardDescription>Set up and send email campaigns to your customers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CampaignForm />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Open Rate</CardTitle>
                        <CardDescription>Average across all campaigns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">24.8%</span>
                          <div className="flex items-center text-green-600">
                            <span className="text-sm font-medium">+2.4%</span>
                            <ArrowRight className="h-4 w-4 ml-1 rotate-45" />
                          </div>
                        </div>
                        <div className="mt-4 h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{width: '24.8%'}}></div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Click Rate</CardTitle>
                        <CardDescription>Average across all campaigns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">12.3%</span>
                          <div className="flex items-center text-amber-600">
                            <span className="text-sm font-medium">-0.8%</span>
                            <ArrowRight className="h-4 w-4 ml-1 rotate-[135deg]" />
                          </div>
                        </div>
                        <div className="mt-4 h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{width: '12.3%'}}></div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Conversion Rate</CardTitle>
                        <CardDescription>Average across all campaigns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">3.6%</span>
                          <div className="flex items-center text-green-600">
                            <span className="text-sm font-medium">+0.5%</span>
                            <ArrowRight className="h-4 w-4 ml-1 rotate-45" />
                          </div>
                        </div>
                        <div className="mt-4 h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{width: '3.6%'}}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Performance</CardTitle>
                      <CardDescription>Detailed analytics for your email campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Campaign</TableHead>
                              <TableHead>Sent</TableHead>
                              <TableHead>Delivered</TableHead>
                              <TableHead>Opens</TableHead>
                              <TableHead>Clicks</TableHead>
                              <TableHead>Conversions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Summer Sale Announcement</TableCell>
                              <TableCell>1,248</TableCell>
                              <TableCell>1,240 (99.4%)</TableCell>
                              <TableCell>372 (30.0%)</TableCell>
                              <TableCell>186 (14.9%)</TableCell>
                              <TableCell>62 (5.0%)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">New Products Launch</TableCell>
                              <TableCell>965</TableCell>
                              <TableCell>958 (99.3%)</TableCell>
                              <TableCell>249 (25.8%)</TableCell>
                              <TableCell>112 (11.6%)</TableCell>
                              <TableCell>41 (4.2%)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Welcome Email Sequence</TableCell>
                              <TableCell>524</TableCell>
                              <TableCell>524 (100%)</TableCell>
                              <TableCell>387 (73.9%)</TableCell>
                              <TableCell>195 (37.2%)</TableCell>
                              <TableCell>28 (5.3%)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Holiday Promotions</TableCell>
                              <TableCell>1,852</TableCell>
                              <TableCell>1,848 (99.8%)</TableCell>
                              <TableCell>425 (23.0%)</TableCell>
                              <TableCell>187 (10.1%)</TableCell>
                              <TableCell>76 (4.1%)</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Performance by Day</CardTitle>
                        <CardDescription>Open rates by day of the week</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] flex items-end justify-between px-2">
                          {[
                            { day: 'Mon', value: 22.5 },
                            { day: 'Tue', value: 24.8 },
                            { day: 'Wed', value: 28.3 },
                            { day: 'Thu', value: 25.1 },
                            { day: 'Fri', value: 26.7 },
                            { day: 'Sat', value: 18.4 },
                            { day: 'Sun', value: 15.9 }
                          ].map(item => (
                            <div key={item.day} className="flex flex-col items-center w-full">
                              <div 
                                className="w-full max-w-[50px] bg-primary-100 rounded-t-sm relative flex justify-center"
                                style={{ height: `${item.value * 8}px` }}
                              >
                                <div className="absolute -top-8 text-xs font-medium">
                                  {item.value}%
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-neutral-medium">
                                {item.day}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Device Breakdown</CardTitle>
                        <CardDescription>Email opens by device type</CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <div className="space-y-8 w-full max-w-md">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Mobile</span>
                              <span>68%</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-full" style={{width: '68%'}}></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Desktop</span>
                              <span>26%</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                              <div className="bg-purple-500 h-full rounded-full" style={{width: '26%'}}></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Tablet</span>
                              <span>6%</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full rounded-full" style={{width: '6%'}}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}