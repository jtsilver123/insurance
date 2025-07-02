Here's the fixed version with all missing closing brackets and tags added:

```jsx
import React, { useState } from 'react';
import { 
  X, Building, Mail, Phone, Globe, DollarSign, Target, Shield, FileText,
  ChevronRight, ChevronLeft, Save, CheckCircle, User, Users, Percent
} from 'lucide-react';

interface AddCarrierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (carrierData: any) => void;
}

const AddCarrierModal: React.FC<AddCarrierModalProps> = ({ isOpen, onClose, onSave }) => {
  // ... [previous code remains the same until the review section] ...

                              <span key={req} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {req}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
              
              <div>
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
                  >
                    <span>Continue</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Carrier</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarrierModal;
```