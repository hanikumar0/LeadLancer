export const calculateScores = (auditData: any, leadData: any) => {
  let seoScore = 100;
  let uiScore = 100;
  let performanceScore = 100;
  let trustScore = 100;
  
  const issues: string[] = [];
  const opportunities: string[] = [];

  // SEO
  if (!auditData.hasTitle) { seoScore -= 30; issues.push('Missing Title Tag'); }
  if (!auditData.hasH1) { seoScore -= 20; issues.push('Missing H1 Tag'); }
  if (!auditData.hasMetaDescription) { seoScore -= 20; issues.push('Missing Meta Description'); }
  
  // UI & Conversion
  if (!auditData.isMobileResponsive) { uiScore -= 40; issues.push('Not mobile responsive'); opportunities.push('Mobile Redesign'); }
  if (!auditData.hasContactForm) { uiScore -= 30; issues.push('No contact form'); opportunities.push('Add Conversion Funnel'); }
  if (!auditData.hasCTA) { uiScore -= 20; issues.push('Weak Call-to-Actions'); }
  if (auditData.brokenImages > 0) { uiScore -= 10; issues.push('Broken images detected'); }

  // Trust
  if (!auditData.isHttps) { trustScore -= 50; issues.push('Not secure (No HTTPS)'); opportunities.push('SSL Installation'); }
  if (!auditData.hasSocialLinks) { trustScore -= 20; issues.push('Missing social proof links'); }

  // Performance (Mock fallback if PageSpeed not used)
  if (auditData.loadTimeMs > 3000) { performanceScore -= 30; issues.push('Slow loading speed (>3s)'); opportunities.push('Performance Optimization'); }
  
  // Bound scores 0-100
  seoScore = Math.max(0, seoScore);
  uiScore = Math.max(0, uiScore);
  performanceScore = Math.max(0, performanceScore);
  trustScore = Math.max(0, trustScore);

  const websiteHealthScore = Math.round((seoScore + uiScore + performanceScore + trustScore) / 4);

  // Buy Intent Calculation
  let buyIntentScore = 0;
  
  // Positive Signals
  if (leadData.phone || leadData.email) buyIntentScore += 15; // Contactable
  if (websiteHealthScore > 0 && websiteHealthScore < 50) buyIntentScore += 40; // High pain point
  if (websiteHealthScore >= 50 && websiteHealthScore < 70) buyIntentScore += 20; // Needs improvement
  if (!leadData.website) buyIntentScore += 50; // Needs website!
  if (issues.length > 3) buyIntentScore += 15;
  
  buyIntentScore = Math.min(100, buyIntentScore);

  // Total Score (Weighted: 70% Buy Intent, 30% inverted website health if website exists)
  let totalLeadScore = 0;
  if (!leadData.website) {
    totalLeadScore = buyIntentScore; // Pure intent
  } else {
    const healthFactor = 100 - websiteHealthScore; // The worse the website, the better the lead for redesign
    totalLeadScore = Math.round((buyIntentScore * 0.7) + (healthFactor * 0.3));
  }

  // Generate Insights
  let recommendedPitch = '';
  let bestServiceToSell = '';
  let auditSummary = '';

  if (!leadData.website) {
    bestServiceToSell = 'Web Development';
    recommendedPitch = 'Pitch a modern, fast website to establish their digital presence and capture local search traffic.';
    auditSummary = `${leadData.businessName} currently has no website, presenting a strong opportunity for a complete Web Development package.`;
  } else if (!auditData.isMobileResponsive || uiScore < 50) {
    bestServiceToSell = 'Website Redesign';
    recommendedPitch = 'Focus on the poor mobile experience and outdated design. Show them a modern mockup.';
    auditSummary = `The website suffers from poor UX and mobile responsiveness. Urgent redesign needed to prevent losing customers.`;
  } else if (seoScore < 60) {
    bestServiceToSell = 'SEO Services';
    recommendedPitch = 'Highlight missing fundamental SEO tags. They are bleeding organic traffic to competitors.';
    auditSummary = `Website looks okay but fails basic technical SEO checks. Huge opportunity for SEO optimization.`;
  } else {
    bestServiceToSell = 'Marketing Funnels';
    recommendedPitch = 'Website is healthy. Pitch lead generation, paid ads, or advanced marketing funnels.';
    auditSummary = `Website is relatively healthy. Focus sales efforts on growth, ads, and conversion rate optimization (CRO).`;
  }

  return {
    seoScore,
    uiScore,
    performanceScore,
    trustScore,
    websiteHealthScore,
    buyIntentScore,
    totalLeadScore,
    issues: [...new Set(issues)],
    opportunities: [...new Set(opportunities)],
    auditSummary,
    recommendedPitch,
    bestServiceToSell
  };
};
