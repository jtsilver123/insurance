import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Shield } from 'lucide-react';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Layout Components
import Sidebar from './components/Layout/Sidebar';

// Producer Components
import TodayView from './components/Producer/TodayView';
import ProspectList from './components/Producer/ProspectList';
import ProspectDetail from './components/Producer/ProspectDetail';
import NewProspect from './components/Producer/NewProspect';
import Analytics from './components/Producer/Analytics';
import Settings from './components/Producer/Settings';
import AIChat from './components/Producer/AIChat';

// Client Components
import ClientDashboard from './components/Client/Dashboard';
import SmartForm from './components/Client/SmartForm';
import DocumentUpload from './components/Client/DocumentUpload';
import PolicyAcceptance from './components/Client/PolicyAcceptance';

// Layout wrapper for Producer portal
const ProducerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Sidebar role="producer" />
    <div className="ml-72">
      {children}
    </div>
  </div>
);

// Layout wrapper for Client portal
const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Sidebar role="smb" />
    <div className="ml-72">
      {children}
    </div>
  </div>
);

// Portal Selection Page
const PortalSelection: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div className="max-w-4xl w-full">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Welcome to InsureTech
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Streamline your commercial insurance process with our intelligent platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Producer Portal */}
        <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
              Producer Portal
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              For insurance agents and brokers to manage prospects, submissions, and quotes
            </p>
            <ul className="text-left space-y-3 mb-8 text-sm text-gray-600">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Manage prospect pipeline</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Generate submission packages</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Compare carrier quotes</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Track application progress</span>
              </li>
            </ul>
            <a
              href="/producer"
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Enter Producer Portal
            </a>
          </div>
        </div>

        {/* Client Portal */}
        <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
              Client Portal
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              For business owners to complete applications and manage their insurance
            </p>
            <ul className="text-left space-y-3 mb-8 text-sm text-gray-600">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sign electronic forms</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Upload required documents</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Complete insurance application</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Review and accept policies</span>
              </li>
            </ul>
            <a
              href="/client"
              className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Enter Client Portal
            </a>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm">
          Trusted by 500+ insurance professionals nationwide
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            {/* Portal Selection */}
            <Route path="/" element={<PortalSelection />} />
            
            {/* Producer Portal Routes */}
            <Route path="/producer" element={
              <ProducerLayout>
                <TodayView />
              </ProducerLayout>
            } />
            <Route path="/producer/prospects" element={
              <ProducerLayout>
                <ProspectList />
              </ProducerLayout>
            } />
            <Route path="/producer/prospects/:id" element={
              <ProducerLayout>
                <ProspectDetail />
              </ProducerLayout>
            } />
            <Route path="/producer/prospects/new" element={
              <ProducerLayout>
                <NewProspect />
              </ProducerLayout>
            } />
            <Route path="/producer/analytics" element={
              <ProducerLayout>
                <Analytics />
              </ProducerLayout>
            } />
            <Route path="/producer/settings" element={
              <ProducerLayout>
                <Settings />
              </ProducerLayout>
            } />
            <Route path="/producer/ai-chat" element={
              <ProducerLayout>
                <AIChat />
              </ProducerLayout>
            } />
            
            {/* Client Portal Routes */}
            <Route path="/client" element={
              <ClientLayout>
                <ClientDashboard />
              </ClientLayout>
            } />
            <Route path="/client/application" element={
              <ClientLayout>
                <SmartForm />
              </ClientLayout>
            } />
            <Route path="/client/documents" element={
              <ClientLayout>
                <DocumentUpload />
              </ClientLayout>
            } />
            <Route path="/client/policy" element={
              <ClientLayout>
                <PolicyAcceptance />
              </ClientLayout>
            } />
            
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;