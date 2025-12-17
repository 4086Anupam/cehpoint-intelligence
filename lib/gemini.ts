// import { GoogleGenAI } from "@google/genai";
// import { BusinessProfile, ServiceRecommendation, ProjectBlueprint } from "@/types";
// import { GeminiAnalysisResponseSchema, BusinessProfileSchema, normalizeBusinessProfile } from "./validation";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// export async function analyzeBusinessProfile(profile: BusinessProfile): Promise<{
//   recommendations: ServiceRecommendation[];
//   projectBlueprint: ProjectBlueprint;
// }> {
//   const prompt = `You are an expert IT and cybersecurity consultant analyzing a client's business to provide highly specific, actionable, and valuable service recommendations.

// CLIENT BUSINESS PROFILE:
// Business Name: ${profile.businessName}
// Industry: ${profile.industry}
// Business Model: ${profile.businessModel}
// Year Established: ${profile.yearEstablished}
// Team Size: ${profile.teamSize}
// Operating Regions: ${Array.isArray(profile.operatingRegions) ? profile.operatingRegions.join(', ') : profile.operatingRegions}

// CURRENT OPERATIONS:
// Core Operations: ${profile.coreOperations}
// Workflow Challenges: ${profile.workflowChallenges}
// Manual Tasks to Automate: ${profile.manualTasks}
// Current Tools/Software: ${profile.currentTools}

// TECHNOLOGY STATUS:
// Has Website: ${profile.hasWebsite ? 'Yes' : 'No'}
// Has Mobile App: ${profile.hasMobileApp ? 'Yes' : 'No'}
// Has CRM: ${profile.hasCRM ? 'Yes' : 'No'}
// Has ERP: ${profile.hasERP ? 'Yes' : 'No'}
// Has Cloud Setup: ${profile.hasCloudSetup ? 'Yes' : 'No'}
// Has Admin Tools: ${profile.hasAdminTools ? 'Yes' : 'No'}
// Technology Stack: ${profile.technologyStack}
// Cybersecurity Practices: ${profile.cybersecurityPractices}
// API/Integrations: ${profile.apiIntegrations}

// BUSINESS GOALS:
// Short-term Goals (6 months): ${profile.shortTermGoals}
// Long-term Goals (1-3 years): ${profile.longTermGoals}
// Upcoming Launches/Expansions: ${profile.upcomingLaunches}
// Desired Automation Areas: ${profile.automationAreas}

// CHALLENGES & BLOCKERS:
// Revenue Challenges: ${profile.revenueChallenges}
// Sales/Marketing Challenges: ${profile.salesMarketingChallenges}
// Tech/Infrastructure Bottlenecks: ${profile.techBottlenecks}
// Customer Support Challenges: ${profile.customerSupportChallenges}
// Compliance/Regulatory Concerns: ${profile.complianceConcerns}

// INDUSTRY-SPECIFIC DATA:
// Target Customers: ${profile.targetCustomers}
// Competitors: ${profile.competitors}
// Data Format: ${profile.dataFormat}
// Industry-Specific Processes: ${profile.industrySpecificProcesses}

// PREFERENCES & CONSTRAINTS:
// Budget Preference: ${profile.budgetPreference}
// Preferred Solution Type: ${profile.preferredSolutionType}
// Deadline/Urgency: ${profile.deadline}
// Has Developer Team: ${profile.hasDevTeam ? 'Yes' : 'No'}
// Resource Constraints: ${profile.resourceConstraints}

// TASK:
// Analyze this business deeply and generate 6-12 highly specific, personalized service recommendations across these categories:
// 1. Process Automation & Optimization
// 2. Software Solutions
// 3. Cybersecurity & Risk Reduction
// 4. Technology Modernization
// 5. AI & Intelligent Automation
// 6. Industry-Specific Solutions

// For EACH recommendation, provide:
// - title: Clear, specific title
// - category: One of the 6 categories above
// - description: Detailed 2-3 sentence description
// - whyNeeded: Why this client specifically needs this (based on their data)
// - howItHelps: Concrete benefits and outcomes
// - businessImpact: Measurable business impact
// - expectedROI: Expected return on investment or value
// - priority: High, Medium, or Low based on urgency and impact
// - estimatedTimeline: Realistic timeline (e.g., "2-3 months", "4-6 weeks")
// - estimatedCost: MUST be in the range ₹10,000 to ₹95,000 with USD in brackets. Format examples: "₹15,000 ($180)", "₹45,000 ($540)", "₹85,000 ($1,020)"

// Also create a high-level PROJECT BLUEPRINT with:
// - deliverables: Array of 4-6 key deliverables
// - timeline: Overall timeline (e.g., "3-6 months")
// - costBracket: Total project cost in range ₹10,000 to ₹95,000 with USD in brackets (e.g., "₹65,000 ($780)")
// - phases: Array of 3-5 project phases with name, duration, and description

// IMPORTANT PRICING GUIDELINES:
// - All recommendations MUST have estimatedCost between ₹10,000 and ₹95,000
// - ALWAYS include USD equivalent in brackets (convert at ~₹83 = $1)
// - Format: "₹[amount] ($[usd_amount])" - e.g., "₹25,000 ($300)", "₹70,000 ($840)"
// - Project blueprint costBracket should be the sum of top priority recommendations, also in ₹10,000-₹95,000 range

// Make recommendations unique, specific to their industry, challenges, and goals. Avoid generic advice. Focus on high-value, hard-to-ignore solutions.

// Return ONLY valid JSON in this exact format:
// {
//   "recommendations": [
//     {
//       "id": "rec-1",
//       "title": "...",
//       "category": "...",
//       "description": "...",
//       "whyNeeded": "...",
//       "howItHelps": "...",
//       "businessImpact": "...",
//       "expectedROI": "...",
//       "priority": "High|Medium|Low",
//       "estimatedTimeline": "...",
//       "estimatedCost": "..."
//     }
//   ],
//   "projectBlueprint": {
//     "deliverables": ["...", "..."],
//     "timeline": "...",
//     "costBracket": "...",
//     "phases": [
//       {
//         "name": "...",
//         "duration": "...",
//         "description": "..."
//       }
//     ]
//   }
// }`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash-exp",
//       config: {
//         responseMimeType: "application/json",
//       },
//       contents: prompt,
//     });

//     if (!response.text) {
//       console.error("Gemini returned empty response");
//       throw new Error("AI analysis did not return results. Please try again.");
//     }

//     let parsed;
//     try {
//       parsed = JSON.parse(response.text);
//     } catch (parseError) {
//       console.error("Failed to parse Gemini response as JSON:", response.text);
//       throw new Error("AI response format error. Please try again.");
//     }
    
//     const validationResult = GeminiAnalysisResponseSchema.safeParse(parsed);
    
//     if (!validationResult.success) {
//       console.error("Gemini response validation failed:", validationResult.error);
//       throw new Error("Invalid AI response format. Please try again.");
//     }
    
//     return validationResult.data;
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     if (error instanceof Error && (
//       error.message.includes("Invalid AI response") ||
//       error.message.includes("AI response format") ||
//       error.message.includes("AI analysis did not")
//     )) {
//       throw error;
//     }
//     throw new Error("Failed to analyze business profile with Gemini");
//   }
// }

// export async function analyzeUploadedDocument(content: string, fileName: string): Promise<BusinessProfile> {
//   const prompt = `You are an expert business analyst extracting information from a business profile document. Your goal is to create the most complete and accurate business profile possible.

// DOCUMENT NAME: ${fileName}

// DOCUMENT CONTENT:
// ${content}

// CRITICAL INSTRUCTIONS:
// 1. Extract ALL explicitly stated information from the document
// 2. For missing critical fields (businessName, industry, businessModel, yearEstablished, teamSize, operatingRegions):
//    - Make INTELLIGENT PREDICTIONS based on context clues in the document
//    - Use industry knowledge and document context to infer reasonable values
//    - Example: If document mentions "since 2015" but no explicit "yearEstablished", use "2015"
//    - Example: If document describes e-commerce operations but doesn't state "industry", infer "E-commerce & Retail"
// 3. For non-critical fields not found in the document:
//    - For text fields: Use "Not specified in document - please provide details"
//    - For boolean fields: Default to false
//    - For challenges/goals: Make educated guesses based on industry and business type mentioned
// 4. Be thorough - analyze the entire document for scattered information
// 5. If the business name is not explicitly stated, try to infer it from:
//    - Document headers, footers, or metadata
//    - Company references in the text
//    - Email domains or contact information
   
// Return ONLY valid JSON in this exact format:
// {
//   "businessName": "...",
//   "industry": "...",
//   "businessModel": "...",
//   "yearEstablished": "...",
//   "teamSize": "...",
//   "operatingRegions": ["region1", "region2"],
//   "coreOperations": "...",
//   "workflowChallenges": "...",
//   "manualTasks": "...",
//   "currentTools": "...",
//   "hasWebsite": true/false,
//   "hasMobileApp": true/false,
//   "hasCRM": true/false,
//   "hasERP": true/false,
//   "hasCloudSetup": true/false,
//   "hasAdminTools": true/false,
//   "technologyStack": "...",
//   "cybersecurityPractices": "...",
//   "apiIntegrations": "...",
//   "shortTermGoals": "...",
//   "longTermGoals": "...",
//   "upcomingLaunches": "...",
//   "automationAreas": "...",
//   "revenueChallenges": "...",
//   "salesMarketingChallenges": "...",
//   "techBottlenecks": "...",
//   "customerSupportChallenges": "...",
//   "complianceConcerns": "...",
//   "targetCustomers": "...",
//   "competitors": "...",
//   "dataFormat": "...",
//   "industrySpecificProcesses": "...",
//   "budgetPreference": "...",
//   "preferredSolutionType": "...",
//   "deadline": "...",
//   "hasDevTeam": true/false,
//   "resourceConstraints": "..."
// }`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash-exp",
//       config: {
//         responseMimeType: "application/json",
//       },
//       contents: prompt,
//     });

//     if (!response.text) {
//       console.error("Gemini returned empty document analysis response");
//       throw new Error("Document analysis did not return results. Please try again.");
//     }

//     let parsed;
//     try {
//       parsed = JSON.parse(response.text);
//     } catch (parseError) {
//       console.error("Failed to parse document analysis response as JSON:", response.text);
//       throw new Error("Document analysis format error. Please try again.");
//     }
    
//     const normalized = normalizeBusinessProfile(parsed);
    
//     const validationResult = BusinessProfileSchema.safeParse(normalized);
    
//     if (!validationResult.success) {
//       console.error("Document analysis validation failed:", validationResult.error);
//       throw new Error("Invalid document analysis format. Please check the document and try again.");
//     }
    
//     return validationResult.data;
//   } catch (error) {
//     console.error("Gemini document analysis error:", error);
//     if (error instanceof Error && (
//       error.message.includes("Invalid document") ||
//       error.message.includes("Document analysis")
//     )) {
//       throw error;
//     }
//     throw new Error("Failed to analyze uploaded document");
//   }
// }


import { GoogleGenAI } from "@google/genai";
import { BusinessProfile, ServiceRecommendation, ProjectBlueprint } from "@/types";
import { GeminiAnalysisResponseSchema, BusinessProfileSchema, normalizeBusinessProfile } from "./validation";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeBusinessProfile(profile: BusinessProfile): Promise<{
  recommendations: ServiceRecommendation[];
  projectBlueprint: ProjectBlueprint;
}> {
  const prompt = `You are an expert IT and cybersecurity consultant analyzing a client's business to provide highly specific, actionable, and valuable service recommendations.

CLIENT BUSINESS PROFILE:
Business Name: ${profile.businessName}
Industry: ${profile.industry}
Business Model: ${profile.businessModel}
Year Established: ${profile.yearEstablished}
Team Size: ${profile.teamSize}
Operating Regions: ${Array.isArray(profile.operatingRegions) ? profile.operatingRegions.join(', ') : profile.operatingRegions}

CURRENT OPERATIONS:
Core Operations: ${profile.coreOperations}
Workflow Challenges: ${profile.workflowChallenges}
Manual Tasks to Automate: ${profile.manualTasks}
Current Tools/Software: ${profile.currentTools}

TECHNOLOGY STATUS:
Has Website: ${profile.hasWebsite ? 'Yes' : 'No'}
Has Mobile App: ${profile.hasMobileApp ? 'Yes' : 'No'}
Has CRM: ${profile.hasCRM ? 'Yes' : 'No'}
Has ERP: ${profile.hasERP ? 'Yes' : 'No'}
Has Cloud Setup: ${profile.hasCloudSetup ? 'Yes' : 'No'}
Has Admin Tools: ${profile.hasAdminTools ? 'Yes' : 'No'}
Technology Stack: ${profile.technologyStack}
Cybersecurity Practices: ${profile.cybersecurityPractices}
API/Integrations: ${profile.apiIntegrations}

BUSINESS GOALS:
Short-term Goals (6 months): ${profile.shortTermGoals}
Long-term Goals (1-3 years): ${profile.longTermGoals}
Upcoming Launches/Expansions: ${profile.upcomingLaunches}
Desired Automation Areas: ${profile.automationAreas}

CHALLENGES & BLOCKERS:
Revenue Challenges: ${profile.revenueChallenges}
Sales/Marketing Challenges: ${profile.salesMarketingChallenges}
Tech/Infrastructure Bottlenecks: ${profile.techBottlenecks}
Customer Support Challenges: ${profile.customerSupportChallenges}
Compliance/Regulatory Concerns: ${profile.complianceConcerns}

INDUSTRY-SPECIFIC DATA:
Target Customers: ${profile.targetCustomers}
Competitors: ${profile.competitors}
Data Format: ${profile.dataFormat}
Industry-Specific Processes: ${profile.industrySpecificProcesses}

PREFERENCES & CONSTRAINTS:
Budget Preference: ${profile.budgetPreference}
Preferred Solution Type: ${profile.preferredSolutionType}
Deadline/Urgency: ${profile.deadline}
Has Developer Team: ${profile.hasDevTeam ? 'Yes' : 'No'}
Resource Constraints: ${profile.resourceConstraints}

TASK:
Analyze this business deeply and generate 6-12 highly specific, personalized service recommendations across these categories:
1. Process Automation & Optimization
2. Software Solutions
3. Cybersecurity & Risk Reduction
4. Technology Modernization
5. AI & Intelligent Automation
6. Industry-Specific Solutions

For EACH recommendation, provide:
- title: Clear, specific title
- category: One of the 6 categories above
- description: Detailed 2-3 sentence description
- whyNeeded: Why this client specifically needs this (based on their data)
- howItHelps: Concrete benefits and outcomes
- businessImpact: Measurable business impact
- expectedROI: Expected return on investment or value
- priority: High, Medium, or Low based on urgency and impact
- estimatedTimeline: Realistic timeline (e.g., "2-3 months", "4-6 weeks")
- estimatedCost: MUST be in the range ₹10,000 to ₹95,000 with USD in brackets. Format examples: "₹15,000 ($180)", "₹45,000 ($540)", "₹85,000 ($1,020)"

Also create a high-level PROJECT BLUEPRINT with:
- deliverables: Array of 4-6 key deliverables
- timeline: Overall timeline (e.g., "3-6 months")
- costBracket: Total project cost in range ₹10,000 to ₹95,000 with USD in brackets (e.g., "₹65,000 ($780)")
- phases: Array of 3-5 project phases with name, duration, and description

IMPORTANT PRICING GUIDELINES:
- All recommendations MUST have estimatedCost between ₹10,000 and ₹95,000
- ALWAYS include USD equivalent in brackets (convert at ~₹83 = $1)
- Format: "₹[amount] ($[usd_amount])" - e.g., "₹25,000 ($300)", "₹70,000 ($840)"
- Project blueprint costBracket should be the sum of top priority recommendations, also in ₹10,000-₹95,000 range

Make recommendations unique, specific to their industry, challenges, and goals. Avoid generic advice. Focus on high-value, hard-to-ignore solutions.

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "id": "rec-1",
      "title": "...",
      "category": "...",
      "description": "...",
      "whyNeeded": "...",
      "howItHelps": "...",
      "businessImpact": "...",
      "expectedROI": "...",
      "priority": "High|Medium|Low",
      "estimatedTimeline": "...",
      "estimatedCost": "..."
    }
  ],
  "projectBlueprint": {
    "deliverables": ["...", "..."],
    "timeline": "...",
    "costBracket": "...",
    "phases": [
      {
        "name": "...",
        "duration": "...",
        "description": "..."
      }
    ]
  }
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    if (!response.text) {
      console.error("Gemini returned empty response");
      throw new Error("AI analysis did not return results. Please try again.");
    }

    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", response.text);
      throw new Error("AI response format error. Please try again.");
    }
    
    const validationResult = GeminiAnalysisResponseSchema.safeParse(parsed);
    
    if (!validationResult.success) {
      console.error("Gemini response validation failed:", validationResult.error);
      throw new Error("Invalid AI response format. Please try again.");
    }
    
    return validationResult.data;
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error instanceof Error && (
      error.message.includes("Invalid AI response") ||
      error.message.includes("AI response format") ||
      error.message.includes("AI analysis did not")
    )) {
      throw error;
    }
    throw new Error("Failed to analyze business profile with Gemini");
  }
}

export async function analyzeUploadedDocument(content: string, fileName: string): Promise<BusinessProfile> {
  const prompt = `You are an expert business analyst extracting information from a business profile document. Your goal is to create the most complete and accurate business profile possible.

DOCUMENT NAME: ${fileName}

DOCUMENT CONTENT:
${content}

CRITICAL INSTRUCTIONS:
1. Extract ALL explicitly stated information from the document
2. For missing critical fields (businessName, industry, businessModel, yearEstablished, teamSize, operatingRegions):
   - Make INTELLIGENT PREDICTIONS based on context clues in the document
   - Use industry knowledge and document context to infer reasonable values
   - Example: If document mentions "since 2015" but no explicit "yearEstablished", use "2015"
   - Example: If document describes e-commerce operations but doesn't state "industry", infer "E-commerce & Retail"
3. For non-critical fields not found in the document:
   - For text fields: Use "Not specified in document - please provide details"
   - For boolean fields: Default to false
   - For challenges/goals: Make educated guesses based on industry and business type mentioned
4. Be thorough - analyze the entire document for scattered information
5. If the business name is not explicitly stated, try to infer it from:
   - Document headers, footers, or metadata
   - Company references in the text
   - Email domains or contact information
   
Return ONLY valid JSON in this exact format:
{
  "businessName": "...",
  "industry": "...",
  "businessModel": "...",
  "yearEstablished": "...",
  "teamSize": "...",
  "operatingRegions": ["region1", "region2"],
  "coreOperations": "...",
  "workflowChallenges": "...",
  "manualTasks": "...",
  "currentTools": "...",
  "hasWebsite": true/false,
  "hasMobileApp": true/false,
  "hasCRM": true/false,
  "hasERP": true/false,
  "hasCloudSetup": true/false,
  "hasAdminTools": true/false,
  "technologyStack": "...",
  "cybersecurityPractices": "...",
  "apiIntegrations": "...",
  "shortTermGoals": "...",
  "longTermGoals": "...",
  "upcomingLaunches": "...",
  "automationAreas": "...",
  "revenueChallenges": "...",
  "salesMarketingChallenges": "...",
  "techBottlenecks": "...",
  "customerSupportChallenges": "...",
  "complianceConcerns": "...",
  "targetCustomers": "...",
  "competitors": "...",
  "dataFormat": "...",
  "industrySpecificProcesses": "...",
  "budgetPreference": "...",
  "preferredSolutionType": "...",
  "deadline": "...",
  "hasDevTeam": true/false,
  "resourceConstraints": "..."
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    if (!response.text) {
      console.error("Gemini returned empty document analysis response");
      throw new Error("Document analysis did not return results. Please try again.");
    }

    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch (parseError) {
      console.error("Failed to parse document analysis response as JSON:", response.text);
      throw new Error("Document analysis format error. Please try again.");
    }
    
    const normalized = normalizeBusinessProfile(parsed);
    
    const validationResult = BusinessProfileSchema.safeParse(normalized);
    
    if (!validationResult.success) {
      console.error("Document analysis validation failed:", validationResult.error);
      throw new Error("Invalid document analysis format. Please check the document and try again.");
    }
    
    return validationResult.data;
  } catch (error) {
    console.error("Gemini document analysis error:", error);
    if (error instanceof Error && (
      error.message.includes("Invalid document") ||
      error.message.includes("Document analysis")
    )) {
      throw error;
    }
    throw new Error("Failed to analyze uploaded document");
  }
}

