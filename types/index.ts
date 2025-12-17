export interface User {
  id: string;
  email: string;
  companyName: string;
  createdAt: string;
}

export interface BusinessProfile {
  businessName: string;
  industry: string;
  businessModel: string;
  yearEstablished: string;
  teamSize: string;
  operatingRegions: string[];
  coreOperations: string;
  workflowChallenges: string;
  manualTasks: string;
  currentTools: string;
  hasWebsite: boolean;
  hasMobileApp: boolean;
  hasCRM: boolean;
  hasERP: boolean;
  hasCloudSetup: boolean;
  hasAdminTools: boolean;
  technologyStack: string;
  cybersecurityPractices: string;
  apiIntegrations: string;
  shortTermGoals: string;
  longTermGoals: string;
  upcomingLaunches: string;
  automationAreas: string;
  revenueChallenges: string;
  salesMarketingChallenges: string;
  techBottlenecks: string;
  customerSupportChallenges: string;
  complianceConcerns: string;
  targetCustomers: string;
  competitors: string;
  dataFormat: string;
  industrySpecificProcesses: string;
  budgetPreference: string;
  preferredSolutionType: string;
  deadline: string;
  hasDevTeam: boolean;
  resourceConstraints: string;
}

export interface ServiceRecommendation {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  whyNeeded: string;
  howItHelps: string;
  businessImpact: string;
  expectedROI: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedTimeline: string;
  estimatedCost: string;
}

export type ServiceCategory = 
  | 'Process Automation & Optimization'
  | 'Software Solutions'
  | 'Cybersecurity & Risk Reduction'
  | 'Technology Modernization'
  | 'AI & Intelligent Automation'
  | 'Industry-Specific Solutions';

export interface ProjectBlueprint {
  deliverables: string[];
  timeline: string;
  costBracket: string;
  phases: {
    name: string;
    duration: string;
    description: string;
  }[];
}

export interface ClientSession {
  userId: string;
  businessProfile?: BusinessProfile;
  recommendations?: ServiceRecommendation[];
  projectBlueprint?: ProjectBlueprint;
  uploadedFile?: {
    name: string;
    type: string;
    content: string;
  };
  pendingAnalysisId?: string;
  lastUpdated: string;
}

export type AnalysisStatus = 'pending' | 'completed' | 'failed';

export interface AnalysisHistoryItem {
  id: string;
  user_id: string;
  company_name: string;
  status: AnalysisStatus;
  parsed_data: BusinessProfile | null;
  business_profile: BusinessProfile | null;
  recommendations: ServiceRecommendation[] | null;
  project_blueprint: ProjectBlueprint | null;
  business_profile_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisHistoryListItem {
  id: string;
  company_name: string;
  status: AnalysisStatus;
  created_at: string;
  business_profile_pdf_url: string | null;
  error_message?: string | null;
}
