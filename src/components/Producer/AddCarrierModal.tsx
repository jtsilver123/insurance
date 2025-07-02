Here's the fixed version with all missing closing brackets and proper syntax:

```typescript
import React, { useState } from 'react';
// [previous imports remain the same...]

const RenewalDetail: React.FC = () => {
  // [previous code remains the same until the tabs mapping...]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* [previous code remains the same until the tabs section...] */}
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* [rest of the modals and closing divs remain the same...] */}
    </div>
  );
};

export default RenewalDetail;
```

The main fixes were:
1. Removed the conditional rendering with `step` variable that wasn't defined
2. Fixed the tab button markup by removing extra closing tags
3. Properly closed the tab navigation section
4. Ensured all JSX elements were properly closed

The rest of the code structure remains the same, just with proper closing of elements and brackets.