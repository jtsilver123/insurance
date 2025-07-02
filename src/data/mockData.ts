import { Prospect, Quote, Activity, Carrier } from '../types';

export const mockProspects: Prospect[] = [
  { id: '1', producerId: 'prod1', smbId: 'smb1', businessName: 'Tech Solutions Inc', contactEmail: 'john@techsolutions.com', 
    contactName: 'John Smith', naicsCode: '541511', revenue: 2500000, status: 'quotes', 
    portalLink: 'https://portal.insurancetech.com/p/abc123', createdAt: new Date('2024-01-15'), 
    updatedAt: new Date('2024-01-20'), renewalDate: new Date('2024-03-15') },
  { id: '2', producerId: 'prod1', businessName: 'Green Energy Co', contactEmail: 'sarah@greenenergy.com', 
    contactName: 'Sarah Johnson', naicsCode: '221118', revenue: 5000000, status: 'form', 
    portalLink: 'https://portal.insurancetech.com/p/def456', createdAt: new Date('2024-01-18'), 
    updatedAt: new Date('2024-01-22') },
  { id: '3', producerId: 'prod1', businessName: 'Downtown Restaurant', contactEmail: 'mike@downtown.com', 
    contactName: 'Mike Chen', status: 'docs', portalLink: 'https://portal.insurancetech.com/p/ghi789', 
    createdAt: new Date('2024-01-22'), updatedAt: new Date('2024-01-22') }
];

export const mockQuotes: Quote[] = [
  { id: '1', prospectId: '1', carrierId: 'carrier1', carrierName: 'Liberty Mutual', premium: 45000, deductible: 5000,
    coverage: { generalLiability: 2000000, propertyDamage: 1000000, workersComp: 'Included' },
    terms: '12 months', receivedAt: new Date('2024-01-19'), isRecommended: true },
  { id: '2', prospectId: '1', carrierId: 'carrier2', carrierName: 'Travelers', premium: 52000, deductible: 2500,
    coverage: { generalLiability: 2000000, propertyDamage: 1000000, workersComp: 'Included' },
    terms: '12 months', receivedAt: new Date('2024-01-20') }
];

export const mockActivities: Activity[] = [
  { id: '1', prospectId: '1', type: 'document', description: 'Documents uploaded and processed', 
    timestamp: new Date('2024-01-16T14:30:00') },
  { id: '2', prospectId: '1', type: 'form', description: 'Smart form completed', 
    timestamp: new Date('2024-01-17T09:15:00') },
  { id: '3', prospectId: '1', type: 'quote', description: 'Quote received from Liberty Mutual', 
    timestamp: new Date('2024-01-19T16:45:00') }
];

export const mockCarriers: Carrier[] = [
  { id: 'carrier1', name: 'Liberty Mutual', 
    appetite: { naicsCodes: ['541511', '541512'], revenueRange: [1000000, 10000000], states: ['CA', 'NY', 'TX', 'FL'] },
    contact: { email: 'underwriting@libertymutual.com', name: 'Jane Doe' } },
  { id: 'carrier2', name: 'Travelers', 
    appetite: { naicsCodes: ['541511', '221118'], revenueRange: [500000, 25000000], states: ['CA', 'NY', 'TX', 'FL', 'IL'] },
    contact: { email: 'submissions@travelers.com', name: 'Bob Wilson' } }
];