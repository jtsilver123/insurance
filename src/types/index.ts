interface User {
  id: string;
  email: string;
  name: string;
  role: 'producer' | 'smb';
  company?: string;
  phone?: string;
  createdAt: Date;
}

export interface Prospect {
  id: string;
  producerId: string;
  smbId?: string;
  businessName: string;
  contactEmail: string;
  contactName: string;
  naicsCode?: string;
  revenue?: number;
  status: 'docs' | 'form' | 'submitted' | 'quotes' | 'bound';
  portalLink: string;
  createdAt: Date;
  updatedAt: Date;
  renewalDate?: Date;
}

export interface Renewal {
  id: string;
  clientName: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  renewalDate: Date;
  expirationDate: Date;
  daysRemaining: number;
  clientTenure: number;
  currentPremium: number;
  estimatedRenewalPremium: number;
  changePercentage: number;
  currentCarrier: string;
  coverageType: string[];
  status: 'pending' | 'in_progress' | 'quoted' | 'bound' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recommendedAction: string;
  recommendedContactMethod: 'email' | 'call' | 'meeting' | 'video';
  notes?: string;
  lastContactDate?: Date;
  assignedTo: string;
}
interface Document {
  id: string;
  prospectId: string;
  type: 'policy' | 'loss_run' | 'supplement';
  name: string;
  url: string;
  extractedData?: any;
  uploadedAt: Date;
  processedAt?: Date;
}

interface FormData {
  id: string;
  prospectId: string;
  coverageType: string;
  data: Record<string, any>;
  completedAt?: Date;
  version: number;
}

export interface Quote {
  id: string;
  prospectId: string;
  carrierId: string;
  carrierName: string;
  premium: number;
  deductible: number;
  coverage: Record<string, any>;
  terms: string;
  receivedAt: Date;
  isRecommended?: boolean;
}

export interface Activity {
  id: string;
  prospectId: string;
  type: 'sms' | 'call' | 'document' | 'form' | 'quote';
  description: string;
  timestamp: Date;
  metadata?: any;
}

export interface Carrier {
  id: string;
  name: string;
  appetite: {
    naicsCodes: string[];
    revenueRange: [number, number];
    states: string[];
  };
  contact: {
    email: string;
    name: string;
  };
}