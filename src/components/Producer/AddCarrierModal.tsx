import React, { useState } from 'react';
import { X, Building, Plus, Users } from 'lucide-react';

interface AddCarrierModalProps {
  isOpen: boolean;
  onClose: () => void;
  renewalId: string;
}

const AddCarrierModal: React.FC<AddCarrierModalProps> = ({ isOpen, onClose, renewalId }) => {
  const [formData, setFormData] = useState({
    carrierName: '',
    underwriterEmail: '',
    submissionNotes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Adding carrier:', formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">Add Market Option</h2>
                <p className="text-blue-800">Add a carrier to shop this renewal</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-blue-600" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carrier Name *
                  </label>
                  <select
                    name="carrierName"
                    value={formData.carrierName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a carrier</option>
                    <option value="travelers">Travelers</option>
                    <option value="chubb">Chubb</option>
                    <option value="hartford">The Hartford</option>
                    <option value="cna">CNA</option>
                    <option value="nationwide">Nationwide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Underwriter Email *
                  </label>
                  <input
                    type="email"
                    name="underwriterEmail"
                    value={formData.underwriterEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="underwriter@carrier.com"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Notes
                  </label>
                  <textarea
                    name="submissionNotes"
                    value={formData.submissionNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific notes for this carrier submission..."
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <Plus className="h-4 w-4" />
              <span>Add Carrier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarrierModal;