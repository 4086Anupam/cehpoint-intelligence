import { z } from 'zod';

export const ServiceCategorySchema = z.enum([
  'Process Automation & Optimization',
  'Software Solutions',
  'Cybersecurity & Risk Reduction',
  'Technology Modernization',
  'AI & Intelligent Automation',
  'Industry-Specific Solutions',
]);

export const ServiceRecommendationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  category: ServiceCategorySchema,
  description: z.string().min(1, 'Description is required'),
  whyNeeded: z.string().min(1, 'Why needed is required'),
  howItHelps: z.string().min(1, 'How it helps is required'),
  businessImpact: z.string().min(1, 'Business impact is required'),
  expectedROI: z.string().min(1, 'Expected ROI is required'),
  priority: z.enum(['High', 'Medium', 'Low']),
  estimatedTimeline: z.string().min(1, 'Timeline is required'),
  estimatedCost: z.string().min(1, 'Cost is required'),
}).transform(data => ({
  ...data,
  id: data.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
}));

export const ProjectBlueprintSchema = z.object({
  deliverables: z.array(z.string()).min(1, 'At least one deliverable required'),
  timeline: z.string().min(1, 'Timeline is required'),
  costBracket: z.string().min(1, 'Cost bracket is required'),
  phases: z.array(
    z.object({
      name: z.string().min(1, 'Phase name is required'),
      duration: z.string().min(1, 'Duration is required'),
      description: z.string().min(1, 'Description is required'),
    })
  ).min(1, 'At least one phase required'),
});

export const GeminiAnalysisResponseSchema = z.object({
  recommendations: z.array(ServiceRecommendationSchema)
    .min(1, 'At least one recommendation required')
    .max(15, 'Too many recommendations'),
  projectBlueprint: ProjectBlueprintSchema,
});

export const BusinessProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  industry: z.string().min(1, 'Industry is required'),
  businessModel: z.string().min(1, 'Business model is required'),
  yearEstablished: z.string().min(1, 'Year established is required'),
  teamSize: z.string().min(1, 'Team size is required'),
  operatingRegions: z.array(z.string()).min(1, 'At least one operating region required'),
  coreOperations: z.string(),
  workflowChallenges: z.string(),
  manualTasks: z.string(),
  currentTools: z.string(),
  hasWebsite: z.boolean(),
  hasMobileApp: z.boolean(),
  hasCRM: z.boolean(),
  hasERP: z.boolean(),
  hasCloudSetup: z.boolean(),
  hasAdminTools: z.boolean(),
  technologyStack: z.string(),
  cybersecurityPractices: z.string(),
  apiIntegrations: z.string(),
  shortTermGoals: z.string(),
  longTermGoals: z.string(),
  upcomingLaunches: z.string(),
  automationAreas: z.string(),
  revenueChallenges: z.string(),
  salesMarketingChallenges: z.string(),
  techBottlenecks: z.string(),
  customerSupportChallenges: z.string(),
  complianceConcerns: z.string(),
  targetCustomers: z.string(),
  competitors: z.string(),
  dataFormat: z.string(),
  industrySpecificProcesses: z.string(),
  budgetPreference: z.string(),
  preferredSolutionType: z.string(),
  deadline: z.string(),
  hasDevTeam: z.boolean(),
  resourceConstraints: z.string(),
});

function coerceBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === '1';
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
}

export function normalizeBusinessProfile(data: any): any {
  const normalized = { ...data };
  
  if (normalized.operatingRegions) {
    if (typeof normalized.operatingRegions === 'string') {
      normalized.operatingRegions = normalized.operatingRegions
        .split(',')
        .map((region: string) => region.trim())
        .filter((region: string) => region.length > 0);
    } else if (!Array.isArray(normalized.operatingRegions)) {
      normalized.operatingRegions = [String(normalized.operatingRegions)];
    }
  } else {
    normalized.operatingRegions = [];
  }
  
  const booleanFields = [
    'hasWebsite',
    'hasMobileApp',
    'hasCRM',
    'hasERP',
    'hasCloudSetup',
    'hasAdminTools',
    'hasDevTeam',
  ];
  
  booleanFields.forEach(field => {
    if (field in normalized) {
      normalized[field] = coerceBoolean(normalized[field]);
    }
  });
  
  return normalized;
}
