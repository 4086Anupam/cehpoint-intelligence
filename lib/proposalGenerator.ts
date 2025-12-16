import { ServiceRecommendation, ProjectBlueprint } from '@/types';

interface ProposalData {
  companyName: string;
  recommendations: ServiceRecommendation[];
  blueprint: ProjectBlueprint | null;
  generatedDate: string;
  salesNotes?: string;
}

export function generateProposalHTML(data: ProposalData): string {
  const { companyName, recommendations, blueprint, generatedDate, salesNotes } = data;
  
  const totalEstimate = recommendations.reduce((sum, rec) => {
    const price = typeof rec.estimatedCost === 'string' 
      ? parseInt(rec.estimatedCost.replace(/[^0-9]/g, '').split('(')[0] || '0') 
      : rec.estimatedCost;
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Technology Solutions Proposal - ${companyName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #ffffff;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: white;
      padding: 40px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 16px;
      opacity: 0.95;
    }
    .contact-banner {
      background: #1e40af;
      color: white;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 15px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .contact-item strong {
      font-weight: 600;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #2563eb;
    }
    .intro {
      background: #f0f9ff;
      padding: 25px;
      border-radius: 8px;
      border-left: 4px solid #2563eb;
      margin-bottom: 30px;
    }
    .intro h3 {
      font-size: 18px;
      margin-bottom: 10px;
      color: #1e40af;
    }
    .recommendation {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .recommendation h3 {
      font-size: 20px;
      color: #1f2937;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .rec-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .rec-meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-high { background: #fee2e2; color: #991b1b; }
    .badge-medium { background: #fef3c7; color: #92400e; }
    .badge-low { background: #d1fae5; color: #065f46; }
    .category {
      background: #dbeafe;
      color: #1e40af;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    .price {
      font-size: 22px;
      font-weight: 700;
      color: #059669;
    }
    .rec-description {
      margin-bottom: 15px;
      color: #4b5563;
      line-height: 1.7;
    }
    .rec-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
    }
    .detail-item strong {
      display: block;
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    .detail-item span {
      color: #1f2937;
      font-weight: 600;
    }
    .blueprint {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #3b82f6;
      border-radius: 10px;
      padding: 30px;
      margin-top: 30px;
    }
    .blueprint h3 {
      font-size: 22px;
      color: #1e40af;
      margin-bottom: 20px;
    }
    .phase {
      background: white;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }
    .phase h4 {
      font-size: 16px;
      color: #1f2937;
      margin-bottom: 8px;
    }
    .summary {
      background: #f0fdf4;
      border: 2px solid #22c55e;
      border-radius: 10px;
      padding: 30px;
      margin-top: 40px;
    }
    .summary h3 {
      font-size: 22px;
      color: #166534;
      margin-bottom: 20px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .summary-item {
      text-align: center;
    }
    .summary-item .label {
      font-size: 12px;
      color: #166534;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .summary-item .value {
      font-size: 28px;
      font-weight: 700;
      color: #15803d;
    }
    .cta-section {
      background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
      color: white;
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      margin-top: 40px;
    }
    .cta-section h3 {
      font-size: 26px;
      margin-bottom: 15px;
    }
    .cta-section p {
      font-size: 16px;
      margin-bottom: 25px;
      opacity: 0.95;
    }
    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
    }
    .cta-button {
      background: white;
      color: #1e40af;
      padding: 15px 30px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      display: inline-block;
    }
    .footer {
      background: #f9fafb;
      padding: 30px 40px;
      text-align: center;
      border-radius: 0 0 12px 12px;
      margin-top: 40px;
      border-top: 2px solid #e5e7eb;
    }
    .footer p {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    .footer strong {
      color: #1f2937;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Technology Solutions Proposal</h1>
      <p>Prepared for <strong>${companyName}</strong></p>
      <p style="margin-top: 10px; font-size: 14px;">Generated on ${new Date(generatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="contact-banner">
      <div class="contact-item">
        <strong>📞 Phone:</strong> +91 909 115 6095
      </div>
      <div class="contact-item">
        <strong>📧 Email:</strong> sales@cehpoint.co.in
      </div>
      <div class="contact-item">
        <strong>🌐 Website:</strong> cehpoint.co.in
      </div>
    </div>

    <div class="content">
      <div class="intro">
        <h3>${salesNotes ? 'Personal Message from Your Consultant' : 'About This Proposal'}</h3>
        <p>
          ${salesNotes || 'This comprehensive technology solutions proposal has been generated using AI-powered analysis of your business operations and requirements. Each recommendation is tailored to your specific needs and designed to deliver measurable ROI.'}
        </p>
      </div>

      <div class="section">
        <h2 class="section-title">Recommended Solutions (${recommendations.length})</h2>
        
        ${recommendations.map((rec, idx) => `
          <div class="recommendation">
            <div class="rec-header">
              <div>
                <h3>${idx + 1}. ${rec.title}</h3>
                <div class="rec-meta">
                  <span class="category">${rec.category}</span>
                  <span class="badge badge-${rec.priority.toLowerCase()}">${rec.priority} Priority</span>
                </div>
              </div>
              <div class="price">${rec.estimatedCost}</div>
            </div>
            
            <p class="rec-description">${rec.description}</p>
            
            <div class="rec-details">
              <div class="detail-item">
                <strong>Business Impact</strong>
                <span>${rec.businessImpact}</span>
              </div>
              <div class="detail-item">
                <strong>Expected ROI</strong>
                <span>${rec.expectedROI}</span>
              </div>
              <div class="detail-item">
                <strong>Timeline</strong>
                <span>${rec.estimatedTimeline}</span>
              </div>
              <div class="detail-item">
                <strong>Why Needed</strong>
                <span>${rec.whyNeeded}</span>
              </div>
              <div class="detail-item" style="grid-column: 1 / -1;">
                <strong>How It Helps</strong>
                <span>${rec.howItHelps}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${blueprint ? `
        <div class="section">
          <h2 class="section-title">Implementation Blueprint</h2>
          <div class="blueprint">
            <h3>📋 Project Implementation Plan</h3>
            <p style="margin-bottom: 20px; color: #1e40af;">Phased approach to delivering your technology solutions</p>
            
            ${blueprint.phases.map((phase, idx) => `
              <div class="phase">
                <h4>Phase ${idx + 1}: ${phase.name}</h4>
                <p style="color: #6b7280; margin-bottom: 10px;">${phase.description}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 14px;">
                  <span><strong>Duration:</strong> ${phase.duration}</span>
                </div>
              </div>
            `).join('')}
            
            ${blueprint.deliverables && blueprint.deliverables.length > 0 ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h4 style="font-size: 16px; margin-bottom: 10px; color: #1f2937;">Project Deliverables</h4>
                <div style="font-size: 14px; color: #4b5563; line-height: 1.8;">
                  ${blueprint.deliverables.map(d => `• ${d}`).join('<br>')}
                </div>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Total Project Cost</div>
              <div style="font-size: 32px; font-weight: 700; color: #15803d;">${blueprint.costBracket}</div>
              <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">Timeline: ${blueprint.timeline}</div>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="summary">
        <h3>📊 Proposal Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="label">Total Solutions</div>
            <div class="value">${recommendations.length}</div>
          </div>
          <div class="summary-item">
            <div class="label">High Priority</div>
            <div class="value">${recommendations.filter(r => r.priority === 'High').length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Estimated Investment</div>
            <div class="value" style="font-size: 22px;">₹${totalEstimate.toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-item">
            <div class="label">Avg. Timeline</div>
            <div class="value" style="font-size: 22px;">${blueprint ? blueprint.timeline : '8-12 weeks'}</div>
          </div>
        </div>
      </div>

      <div class="cta-section">
        <h3>Ready to Transform Your Business?</h3>
        <p>Let's discuss how these solutions can be tailored to your specific needs and budget.</p>
        <div class="cta-buttons">
          <a href="tel:+919091156095" class="cta-button">📞 Call: +91 909 115 6095</a>
          <a href="mailto:sales@cehpoint.co.in?subject=Proposal Discussion - ${companyName}" class="cta-button">📧 Email Us</a>
          <a href="https://wa.me/919091156095?text=Hi, I'd like to discuss the proposal for ${encodeURIComponent(companyName)}" class="cta-button">💬 WhatsApp Chat</a>
        </div>
        <p style="margin-top: 20px; font-size: 14px;">Visit us at <strong>cehpoint.co.in</strong></p>
      </div>
    </div>

    <div class="footer">
      <p><strong>Cehpoint Technology Consulting</strong></p>
      <p>Enterprise Technology Solutions for Growing Businesses Worldwide</p>
      <p style="margin-top: 15px;">
        📞 +91 909 115 6095 | 📧 sales@cehpoint.co.in | 🌐 cehpoint.co.in
      </p>
      <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Cehpoint Technology Consulting. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function downloadProposal(data: ProposalData): void {
  const html = generateProposalHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Cehpoint_Proposal_${data.companyName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function submitToCehpoint(companyName: string, recommendations: ServiceRecommendation[], salesNotes?: string): string {
  const highPriority = recommendations.filter(r => r.priority === 'High');
  const topRecommendations = highPriority.slice(0, 3).map(r => r.title).join(', ');
  
  let message = `Hi! Sharing the technology solutions proposal for ${companyName}.

Summary:
• Total Solutions: ${recommendations.length}
• High Priority: ${highPriority.length}
• Top Recommendations: ${topRecommendations || recommendations.slice(0, 2).map(r => r.title).join(', ')}`;

  if (salesNotes) {
    message += `\n\nPersonal Note:\n${salesNotes}`;
  }
  
  message += `\n\nI'd like to schedule a consultation to discuss implementation, timelines, and pricing.

Looking forward to connecting!`;

  return `https://wa.me/919091156095?text=${encodeURIComponent(message)}`;
}
