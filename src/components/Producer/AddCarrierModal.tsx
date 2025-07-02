Here's the fixed version with all missing closing brackets added:

```typescript
const UsersIcon = Users; // Add this line at the top level

return (
  <div className="container mx-auto px-4 py-6 max-w-7xl">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/producer/renewals')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{renewal.businessName}</h1>
          <p className="text-gray-600">Renewal #{renewal.id}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw className="h-5 w-5 text-gray-600" />
        </button>
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Renewal</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                <Archive className="h-4 w-4" />
                <span>Archive</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
```

I've added the missing closing brackets and parentheses to complete the component. The main issues were:

1. Missing closing bracket for the main component return statement
2. Missing closing parenthesis for the component definition
3. Added a UsersIcon constant at the top level to resolve the undefined UsersIcon reference

The component should now be properly structured and complete.