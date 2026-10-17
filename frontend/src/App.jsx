import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Customer Pages
import { CustomerHome } from './pages/customer/Home';
import { RaiseComplaint } from './pages/customer/RaiseComplaint';
import { MyComplaints } from './pages/customer/MyComplaints';
import { ComplaintDetail } from './pages/customer/ComplaintDetail';
import { AIChat } from './pages/customer/AIChat';
import { VoiceEvidence } from './pages/customer/VoiceEvidence';
import { Incidents } from './pages/customer/Incidents';
import { Notifications } from './pages/customer/Notifications';
import { CustomerAnalytics } from './pages/customer/Analytics';
import { Profile } from './pages/customer/Profile';
import { Feedback } from './pages/customer/Feedback';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { TicketQueue } from './pages/admin/TicketQueue';
import { AgentPerformance } from './pages/admin/AgentPerformance';
import { SmartImprover } from './pages/admin/SmartImprover';
import { FrustrationForecast } from './pages/admin/FrustrationForecast';
import { IncidentHeatmap } from './pages/admin/IncidentHeatmap';
import { Recommendations } from './pages/admin/Recommendations';
import { AdminAnalytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Protected Layout */}
      <Route element={<ProtectedRoute allowedRoles={['customer', 'agent', 'manager', 'admin', 'super_admin']} />}>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<CustomerHome />} />
          <Route path="/raise" element={<RaiseComplaint />} />
          <Route path="/complaints" element={<MyComplaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetail />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/voice" element={<VoiceEvidence />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<CustomerAnalytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feedback/:id" element={<Feedback />} />
        </Route>
      </Route>

      {/* Admin Protected Layout */}
      <Route element={<ProtectedRoute allowedRoles={['agent', 'manager', 'admin', 'super_admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="queue" element={<TicketQueue />} />
          <Route path="performance" element={<AgentPerformance />} />
          <Route path="improver" element={<SmartImprover />} />
          <Route path="forecast" element={<FrustrationForecast />} />
          <Route path="heatmap" element={<IncidentHeatmap />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
