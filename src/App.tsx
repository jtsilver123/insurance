import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
import ErrorBoundary from './components/Common/ErrorBoundary';

import TodayView from './components/Producer/TodayView';
import ProspectList from './components/Producer/ProspectList';
import ProspectDetail from './components/Producer/ProspectDetail';
import NewProspect from './components/Producer/NewProspect';
import Renewals from './components/Producer/Renewals';
import Analytics from './components/Producer/Analytics';
import Settings from './components/Producer/Settings';
import AIChat from './components/Producer/AIChat';

const ProducerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Sidebar role="producer" />
    <div className="ml-72">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/producer" replace />} />
            <Route path="/producer" element={<ProducerLayout><TodayView /></ProducerLayout>} />
            <Route path="/producer/prospects" element={<ProducerLayout><ProspectList /></ProducerLayout>} />
            <Route path="/producer/prospects/:id" element={<ProducerLayout><ProspectDetail /></ProducerLayout>} />
            <Route path="/producer/prospects/new" element={<ProducerLayout><NewProspect /></ProducerLayout>} />
            <Route path="/producer/renewals" element={<ProducerLayout><Renewals /></ProducerLayout>} />
            <Route path="/producer/analytics" element={<ProducerLayout><Analytics /></ProducerLayout>} />
            <Route path="/producer/settings" element={<ProducerLayout><Settings /></ProducerLayout>} />
            <Route path="/producer/ai-chat" element={<ProducerLayout><AIChat /></ProducerLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000, 
              style: { background: '#363636', color: '#fff' }
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;