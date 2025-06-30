import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Eye, 
  Download,
  Camera,
  Smartphone,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  category: string;
  extractedData?: any;
  processingProgress?: number;
}

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  examples: string[];
  status: 'pending' | 'uploaded' | 'completed';
  acceptedFormats: string[];
  maxSize: string;
}

const DocumentUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const documentCategories: DocumentCategory[] = [
    {
      id: 'current-policy',
      name: 'Current Insurance Policy',
      description: 'Your existing business insurance policy documents',
      required: true,
      examples: ['Policy declarations page', 'Full policy document', 'Certificate of insurance'],
      status: 'completed',
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: '10MB'
    },
    {
      id: 'loss-runs',
      name: 'Loss Run History',
      description: '5-year claims history from your current carrier',
      required: true,
      examples: ['Loss run report', 'Claims summary', 'Letter of no claims'],
      status: 'completed',
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: '10MB'
    },
    {
      id: 'financial',
      name: 'Financial Statements',
      description: 'Recent financial information about your business',
      required: true,
      examples: ['Tax returns', 'Profit & loss statements', 'Balance sheets'],
      status: 'pending',
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: '10MB'
    },
    {
      id: 'additional',
      name: 'Additional Documents',
      description: 'Any other relevant business documents',
      required: false,
      examples: ['Business licenses', 'Contracts', 'Safety manuals'],
      status: 'pending',
      acceptedFormats: ['PDF', 'JPG', 'PNG', 'DOC', 'DOCX'],
      maxSize: '10MB'
    }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!selectedCategory) {
      alert('Please select a document category first');
      return;
    }

    acceptedFiles.forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        status: 'uploading',
        category: selectedCategory,
        processingProgress: 0
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload and processing
      simulateUpload(newFile.id);
    });
  }, [selectedCategory]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !selectedCategory
  });

  const simulateUpload = (fileId: string) => {
    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        
        // Update to processing
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'processing', processingProgress: 0 }
            : file
        ));

        // Simulate OCR processing
        simulateProcessing(fileId);
      }
      
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, processingProgress: progress }
          : file
      ));
    }, 200);
  };

  const simulateProcessing = (fileId: string) => {
    let progress = 0;
    const processingInterval = setInterval(() => {
      progress += Math.random() * 25;
      if (progress >= 100) {
        progress = 100;
        clearInterval(processingInterval);
        
        // Update to completed with extracted data
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { 
                ...file, 
                status: 'completed', 
                processingProgress: 100,
                extractedData: {
                  documentType: 'Insurance Policy',
                  carrier: 'Previous Insurance Co.',
                  policyNumber: 'POL-123456789',
                  effectiveDate: '2023-01-01',
                  expirationDate: '2024-01-01'
                }
              }
            : file
        ));
      } else {
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, processingProgress: progress }
            : file
        ));
      }
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryStatus = (categoryId: string) => {
    const filesInCategory = uploadedFiles.filter(file => file.category === categoryId);
    if (filesInCategory.length === 0) return 'pending';
    if (filesInCategory.some(file => file.status === 'completed')) return 'completed';
    return 'uploaded';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'uploaded': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Upload</h1>
            <p className="text-gray-600 mt-1">Upload your business documents for insurance review</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Documents Uploaded</p>
            <p className="text-2xl font-bold text-blue-600">
              {documentCategories.filter(cat => getCategoryStatus(cat.id) === 'completed').length}/
              {documentCategories.filter(cat => cat.required).length}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Upload className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h2 className="font-semibold text-blue-900 mb-2">How to Upload Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-800 text-sm">
              <div className="flex items-start space-x-2">
                <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p className="font-medium">Select Category</p>
                  <p>Choose the type of document you're uploading</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p className="font-medium">Upload Files</p>
                  <p>Drag & drop or click to select files</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p className="font-medium">Auto-Processing</p>
                  <p>We'll extract key information automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Document Categories</h2>
              <p className="text-sm text-gray-600 mt-1">Select a category to upload documents</p>
            </div>
            
            <div className="p-6 space-y-4">
              {documentCategories.map((category) => {
                const status = getCategoryStatus(category.id);
                return (
                  <div
                    key={category.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <div className="flex items-center space-x-2">
                        {category.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Required
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                          {status === 'completed' ? 'Complete' : 
                           status === 'uploaded' ? 'Uploaded' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="text-xs text-gray-500">
                      <p>Examples: {category.examples.slice(0, 2).join(', ')}</p>
                      <p>Formats: {category.acceptedFormats.join(', ')} • Max: {category.maxSize}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upload Area and Files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedCategory 
                ? `Upload ${documentCategories.find(c => c.id === selectedCategory)?.name}`
                : 'Select a Category First'
              }
            </h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : selectedCategory
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-gray-200 bg-gray-50'
              } ${!selectedCategory ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <input {...getInputProps()} />
              
              {selectedCategory ? (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-gray-600 mb-4">
                    or click to browse your computer
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>PDF, JPG, PNG up to 10MB</span>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-500 mb-2">
                    Please select a document category first
                  </p>
                  <p className="text-gray-400">
                    Choose from the categories on the left to start uploading
                  </p>
                </>
              )}
            </div>

            {/* Mobile Upload Options */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Camera className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Take Photo</p>
                  <p className="text-sm text-gray-600">Use your device camera</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Mobile Upload</p>
                  <p className="text-sm text-gray-600">Upload from phone gallery</p>
                </div>
              </button>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Uploaded Files</h2>
                <p className="text-sm text-gray-600 mt-1">{uploadedFiles.length} files uploaded</p>
              </div>
              
              <div className="p-6 space-y-4">
                {uploadedFiles.map((file) => {
                  const IconComponent = getFileIcon(file.type);
                  return (
                    <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        file.status === 'completed' ? 'bg-green-100' :
                        file.status === 'error' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          file.status === 'completed' ? 'text-green-600' :
                          file.status === 'error' ? 'text-red-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              file.status === 'completed' ? 'bg-green-100 text-green-800' :
                              file.status === 'error' ? 'bg-red-100 text-red-800' :
                              file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {file.status === 'uploading' ? 'Uploading' :
                               file.status === 'processing' ? 'Processing' :
                               file.status === 'completed' ? 'Complete' :
                               'Error'}
                            </span>
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{documentCategories.find(c => c.id === file.category)?.name}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleTimeString()}</span>
                        </div>

                        {/* Progress Bar */}
                        {(file.status === 'uploading' || file.status === 'processing') && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  file.status === 'uploading' ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${file.processingProgress || 0}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {file.status === 'uploading' ? 'Uploading...' : 'Processing with AI...'}
                            </p>
                          </div>
                        )}

                        {/* Extracted Data */}
                        {file.status === 'completed' && file.extractedData && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="h-4 w-4 text-green-600" />
                              <p className="text-sm font-medium text-green-900">Information Extracted</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(file.extractedData).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                  <span className="ml-1 font-medium text-gray-900">{value as string}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {file.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {documentCategories.filter(cat => cat.required && getCategoryStatus(cat.id) === 'completed').length === documentCategories.filter(cat => cat.required).length && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">All Required Documents Uploaded!</h3>
                  <p className="text-green-800 mb-4">
                    Great job! We have all the documents we need to process your insurance application. 
                    Our team will review everything and get back to you within 24 hours.
                  </p>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                    <span>Continue to Application</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;