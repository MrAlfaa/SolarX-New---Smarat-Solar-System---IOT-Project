import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Login from './pages/Login'; // Import the new Login component
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import PrivateRoute from './components/PrivateRoute';

// Create a wrapper component that uses the sidebar context
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Navigation />
      <main 
        className={`flex-1 overflow-auto transition-all duration-200 ease-in-out ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="p-4 md:p-8 min-h-screen bg-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <PrivateRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              } />
              <Route path="/devices" element={
                <PrivateRoute>
                  <MainLayout>
                    <DeviceManagement />
                  </MainLayout>
                </PrivateRoute>
              } />
              <Route path="/analytics" element={
                <PrivateRoute>
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                </PrivateRoute>
              } />
              <Route path="/alerts" element={
                <PrivateRoute>
                  <MainLayout>
                    <Alerts />
                  </MainLayout>
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </PrivateRoute>
              } />
              {/* Catch-all redirect to login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;