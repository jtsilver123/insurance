export const PROSPECT_STAGES = ['docs', 'form', 'submitted', 'quotes', 'bound'] as const;

export const STAGE_LABELS = {
  docs: 'Docs',
  form: 'Form',
  submitted: 'Submit',
  quotes: 'Quote',
  bound: 'BOUND'
} as const;

export const COVERAGE_TYPES = [
  'General Liability',
  'Professional Liability',
  'Cyber Liability',
  'Commercial Property',
  'Workers Compensation',
  'Commercial Auto',
  'Directors & Officers',
  'Employment Practices'
] as const;

export const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 
  'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'] as const;

export const DOCUMENT_TYPES = {
  policy: 'Current Policy',
  loss_run: 'Loss Run History',
  financial: 'Financial Statements',
  supplement: 'Supplemental Documents',
  other: 'Other Documents'
} as const;