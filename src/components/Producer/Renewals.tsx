import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, Search, Filter, Calendar, Clock, Mail, Phone, Video, Users, 
  AlertTriangle, CheckCircle, Download, MoreVertical, ChevronDown, ChevronUp, 
  Building, TrendingUp, TrendingDown, MessageSquare, Plus, X
} from 'lucide-react';
import { mockRenewals } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface RenewalFilters {
  status: string;
  assignedTo: string;
  timeframe: string;
  search: string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface RenewalNote {
  id: string;
  renewalId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

const Renewals: React.FC = () => {
  const [filters, setFilters] = useState<RenewalFilters>({
    status: 'all',
    assignedTo: 'all',
    timeframe: 'all',
    search: ''
  });
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'daysRemaining',
    direction: 'asc'
  });
  
  const [selectedRenewals, setSelectedRenewals] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<string | null>(null);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  // Mock renewal notes
  const [renewalNotes, setRenewalNotes] = useState<RenewalNote[]>([
    {
      id: '1',
      renewalId: '2',
      content: 'Client mentioned they\'re expanding operations and may need additional coverage for new equipment.',
      createdBy: 'John Doe',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      renewalId: '2',
      content: 'Requested loss runs from current carrier. Awaiting response.',
      createdBy: 'John Doe',
      createdAt: new Date('2024-01-18')
    },
    {
      id: '3',
      renewalId: '3',
      content: 'Client is concerned about premium increase. Need to prepare options with different deductibles.',
      createdBy: 'John Doe',
      createdAt: new Date('2024-01-22')
    }
  ]);

  // Filter and sort renewals
  const filteredRenewals = useMemo(() => {
    return mockRenewals.filter(renewal => {
      // Apply status filter
      if (filters.status !== 'all' && renewal.status !== filters.status) return false;
            
      // Apply assigned to filter
      if (filters.assignedTo !== 'all' && renewal.assignedTo !== filters.assignedTo) return false;
      
      // Apply timeframe filter
      if (filters.timeframe !== 'all') {
        if (filters.timeframe === 'overdue' && renewal.daysRemaining >= 0) return false;
        if (filters.timeframe === '30days' && (renewal.daysRemaining < 0 || renewal.daysRemaining > 30)) return false;
        if (filters.timeframe === '60days' && (renewal.daysRemaining < 0 || renewal.daysRemaining > 60)) return false;
        if (filters.timeframe === '90days' && (renewal.daysRemaining < 0 || renewal.daysRemaining > 90)) return false;
      }
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          renewal.clientName.toLowerCase().includes(searchLower) ||
          renewal.businessName.toLowerCase().includes(searchLower) ||
          renewal.contactEmail.toLowerCase().includes(searchLower) ||
          renewal.currentCarrier.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [filters, mockRenewals]);
  
  // Apply sorting
  const sortedRenewals = useMemo(() => {
    const sorted = [...filteredRenewals].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof typeof a];
      let bValue: any = b[sortConfig.key as keyof typeof b];
      
      // Special handling for dates
      if (sortConfig.key === 'renewalDate' || sortConfig.key === 'lastContactDate') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sorted;
  }, [filteredRenewals, sortConfig]);
  
  // Pagination
  const paginatedRenewals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRenewals.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedRenewals, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(sortedRenewals.length / itemsPerPage);
  
  // Handle sort change
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle filter change
  const handleFilterChange = (filterKey: keyof RenewalFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle renewal selection
  const handleSelectRenewal = (renewalId: string, selected: boolean) => {
    if (selected) {
      setSelectedRenewals(prev => [...prev, renewalId]);
    } else {
      setSelectedRenewals(prev => prev.filter(id => id !== renewalId));
    }
  };
  
  // Handle select all renewals
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRenewals(paginatedRenewals.map(renewal => renewal.id));
    } else {
      setSelectedRenewals([]);
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedRenewals.length === 0) {
      toast.error('Please select at least one renewal');
      return;
    }
    
    // Implement bulk actions
    switch (action) {
      case 'email':
        toast.success(`Email prepared for ${selectedRenewals.length} clients`);
        break;
      case 'export':
        toast.success(`Exported ${selectedRenewals.length} renewals`);
        break;
      case 'assign':
        toast.success(`Assignment modal would open for ${selectedRenewals.length} renewals`);
        break;
      default:
        toast.error('Action not implemented');
    }
    
    setShowBulkActionMenu(false);
  };
  
  // Handle renewal click
  const handleRenewalClick = (renewalId: string) => {
    setSelectedRenewal(renewalId);
    setShowDetailPanel(true);
  };
  
  // Get the selected renewal
  const getSelectedRenewal = () => {
    return mockRenewals.find(renewal => renewal.id === selectedRenewal);
  };
  
  // Get renewal notes
  const getRenewalNotes = (renewalId: string) => {
    return renewalNotes.filter(note => note.renewalId === renewalId);
  };
  
  // Add a new note
  const handleAddNote = () => {
    if (!selectedRenewal || !newNote.trim()) return;
    
    const newNoteObj: RenewalNote = {
      id: Date.now().toString(),
      renewalId: selectedRenewal,
      content: newNote,
      createdBy: 'John Doe',
      createdAt: new Date()
    };
    
    setRenewalNotes(prev => [...prev, newNoteObj]);
    setNewNote('');
    setShowAddNoteModal(false);
    toast.success('Note added successfully');
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bound':
        return 'text-green-600 bg-green-100';
      case 'quoted':
        return 'text-blue-600 bg-blue-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'lost':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  // Get contact method icon
  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  
  // Get days remaining color
  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return 'text-red-600';
    if (days <= 15) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
    if (days <= 60) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Format days remaining
  const formatDaysRemaining = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days`;
  };
  
  // Get renewal date badge
  const getRenewalDateBadge = (days: number) => {
    if (days < 0) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Overdue</span>;
    if (days <= 15) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Urgent</span>;
    if (days <= 30) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Soon</span>;
    if (days <= 60) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Upcoming</span>;
    return null;
  };
  
  // Get percentage change color
  const getPercentageChangeColor = (percentage: number) => {
    if (percentage > 10) return 'text-red-600 bg-red-50';
    if (percentage > 5) return 'text-orange-600 bg-orange-50';
    if (percentage > 0) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };
  
  // Render the detail panel
  const renderDetailPanel = () => {
    const renewal = getSelectedRenewal();
    if (!renewal) return null;
    
    const notes = getRenewalNotes(renewal.id);
    
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-10 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{renewal.businessName}</h3>
            <p className="text-sm text-gray-600">Renewal Details</p>
          </div>
          <button 
            onClick={() => setShowDetailPanel(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Details */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-900">Renewal Summary</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(renewal.status)}`}>
                {renewal.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-blue-700">Renewal Date</p>
                <p className="font-medium text-blue-900">{renewal.renewalDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-blue-700">Days Remaining</p>
                <p className={`font-medium ${getDaysRemainingColor(renewal.daysRemaining)}`}>
                  {formatDaysRemaining(renewal.daysRemaining)}
                </p>
              </div>
              <div>
                <p className="text-blue-700">Current Premium</p>
                <p className="font-medium text-blue-900">{formatCurrency(renewal.currentPremium)}</p>
              </div>
              <div>
                <p className="text-blue-700">Est. Renewal</p>
                <p className="font-medium text-blue-900">{formatCurrency(renewal.estimatedRenewalPremium)}</p>
              </div>
            </div>
          </div>
          
          {/* Client Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Contact Name:</span>
                <span className="font-medium text-gray-900">{renewal.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{renewal.contactEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">{renewal.contactPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Client Tenure:</span>
                <span className="font-medium text-gray-900">{renewal.clientTenure} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Carrier:</span>
                <span className="font-medium text-gray-900">{renewal.currentCarrier}</span>
              </div>
            </div>
          </div>
          
          {/* Coverage Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Coverage Information</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-600 mb-2">Coverage Types:</p>
                <div className="flex flex-wrap gap-1">
                  {renewal.coverageType.map((type, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Premium Change:</span>
                <span className={`font-medium ${renewal.changePercentage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {renewal.changePercentage > 0 ? '+' : ''}{renewal.changePercentage}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Recommended Actions */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Recommended Actions</h4>
            <p className="text-sm text-yellow-800 mb-3">{renewal.recommendedAction}</p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-yellow-700">Contact via:</span>
              <div className="flex items-center space-x-1">
                {getContactMethodIcon(renewal.recommendedContactMethod)}
                <span className="font-medium text-yellow-900 capitalize">{renewal.recommendedContactMethod}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Notes & Activity</h4>
              <button 
                onClick={() => setShowAddNoteModal(true)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-3 w-3" />
                <span>Add Note</span>
              </button>
            </div>
            
            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map(note => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-800 mb-2">{note.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{note.createdBy}</span>
                      <span>{note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notes yet</p>
                <button 
                  onClick={() => setShowAddNoteModal(true)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Add the first note
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Phone className="h-4 w-4" />
              <span>Call Client</span>
            </button>
            <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors col-span-2">
              <Calendar className="h-4 w-4" />
              <span>Schedule Meeting</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the add note modal
  const renderAddNoteModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Note</h3>
            <button 
              onClick={() => setShowAddNoteModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddNoteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Renewals
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Manage upcoming policy renewals and client retention</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
            <Plus className="h-4 w-4" />
            <span>Add Renewal</span>
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgent Renewals</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockRenewals.filter(r => r.daysRemaining <= 15 && r.status !== 'bound').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">30-Day Renewals</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockRenewals.filter(r => r.daysRemaining > 15 && r.daysRemaining <= 30 && r.status !== 'bound').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockRenewals.filter(r => r.status === 'bound').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Increase</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(mockRenewals.reduce((sum, r) => sum + r.changePercentage, 0) / mockRenewals.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search clients, businesses, or carriers..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="quoted">Quoted</option>
              <option value="bound">Bound</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <select
              value={filters.timeframe}
              onChange={(e) => handleFilterChange('timeframe', e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Timeframes</option>
              <option value="overdue">Overdue</option>
              <option value="30days">Next 30 Days</option>
              <option value="60days">Next 60 Days</option>
              <option value="90days">Next 90 Days</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedRenewals.length > 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">{selectedRenewals.length} renewals selected</p>
                <p className="text-sm text-blue-700">Select an action to perform on these renewals</p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowBulkActionMenu(!showBulkActionMenu)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Bulk Actions</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showBulkActionMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => handleBulkAction('email')}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                    >
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>Send Email</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                    >
                      <Download className="h-4 w-4 text-gray-400" />
                      <span>Export Selected</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('assign')}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                    >
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>Assign To</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Renewals Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectedRenewals.length === paginatedRenewals.length && paginatedRenewals.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('businessName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Client</span>
                    {sortConfig.key === 'businessName' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('renewalDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Renewal Date</span>
                    {sortConfig.key === 'renewalDate' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('currentPremium')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Current Premium</span>
                    {sortConfig.key === 'currentPremium' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('changePercentage')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Change</span>
                    {sortConfig.key === 'changePercentage' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRenewals.map((renewal) => (
                <tr 
                  key={renewal.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRenewalClick(renewal.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRenewals.includes(renewal.id)}
                      onChange={(e) => handleSelectRenewal(renewal.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{renewal.businessName.charAt(0)}{renewal.clientName.split(' ')[1].charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{renewal.businessName}</div>
                        <div className="text-xs text-gray-500">{renewal.clientName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{renewal.renewalDate.toLocaleDateString()}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {getRenewalDateBadge(renewal.daysRemaining)}
                      <span className={`text-xs ${getDaysRemainingColor(renewal.daysRemaining)}`}>
                        {formatDaysRemaining(renewal.daysRemaining)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(renewal.currentPremium)}</div>
                    <div className="text-xs text-gray-500">Annual</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`px-3 py-2 rounded-lg ${getPercentageChangeColor(renewal.changePercentage)}`}>
                        <div className="flex items-center">
                          {renewal.changePercentage > 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-sm font-medium">
                            {renewal.changePercentage > 0 ? '+' : ''}{renewal.changePercentage}%
                          </span>
                        </div>
                        <div className="text-xs mt-1">
                          Est. {formatCurrency(renewal.estimatedRenewalPremium)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 rounded hover:bg-green-50">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedRenewals.length)}</span> of <span className="font-medium">{sortedRenewals.length}</span> renewals
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Detail Panel */}
      {showDetailPanel && renderDetailPanel()}
      
      {/* Add Note Modal */}
      {showAddNoteModal && renderAddNoteModal()}
    </div>
  );
};

export default Renewals;