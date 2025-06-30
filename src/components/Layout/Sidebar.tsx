import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Shield,
  FileText,
  Upload,
  DollarSign,
  LogOut,
  Bell,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  role: 'producer' | 'smb';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const producerNavItems = [
    { path: '/producer', icon: Home, label: "Today's View", badge: null },
    { path: '/producer/prospects', icon: Users, label: 'Prospects', badge: '3' },
    { path: '/producer/analytics', icon: BarChart3, label: 'Analytics', badge: null }
  ];

  const smbNavItems = [
    { path: '/client', icon: Home, label: 'Dashboard', badge: null },
    { path: '/client/documents', icon: Upload, label: 'Upload Documents', badge: '2' },
    { path: '/client/application', icon: FileText, label: 'Complete Forms', badge: null },
    { path: '/client/policy', icon: DollarSign, label: 'Review Policy', badge: null }
  ];

  const navItems = role === 'producer' ? producerNavItems : smbNavItems;

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'quote',
      title: 'New Quote Received',
      message: 'Liberty Mutual sent a quote for Tech Solutions Inc',
      time: '5 minutes ago',
      unread: true,
      priority: 'high'
    },
    {
      id: '2',
      type: 'document',
      title: 'Document Uploaded',
      message: 'Green Energy Co uploaded financial statements',
      time: '1 hour ago',
      unread: true,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'form',
      title: 'Form Completed',
      message: 'Downtown Restaurant completed risk assessment',
      time: '2 hours ago',
      unread: false,
      priority: 'low'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Follow-up Reminder',
      message: 'Contact ABC Manufacturing about missing documents',
      time: '3 hours ago',
      unread: false,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'policy',
      title: 'Policy Bound',
      message: 'XYZ Corp policy successfully bound with Travelers',
      time: '1 day ago',
      unread: false,
      priority: 'high'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = () => {
    // In a real app, this would handle logout logic
    navigate('/');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote': return DollarSign;
      case 'document': return FileText;
      case 'form': return CheckCircle;
      case 'reminder': return Clock;
      case 'policy': return Shield;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600 bg-red-100';
    if (priority === 'medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const renderNotificationsPanel = () => (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setShowNotifications(false)}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-96 max-w-full bg-white rounded-2xl border border-gray-200 shadow-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{unreadCount} unread</span>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`text-sm font-semibold ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={toggleMobileSidebar}
          className="p-2 bg-white rounded-full shadow-lg border border-gray-100"
        >
          {mobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
      </div>
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <div 
        className={`w-72 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 
        h-screen flex flex-col shadow-xl transition-all duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  InsureTech
                </h1>
                <p className="text-xs text-gray-500 capitalize font-medium">{role} Portal</p>
              </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Main Navigation */}
          <nav className="p-4 pt-6">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`group flex items-center justify-between 
                      px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border-r-4 border-blue-600'
                          : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`h-5 w-5 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                          <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      
                      {item.badge && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Support Section */}
            <div className="p-4 mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
                Support
              </p>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/producer/ai-chat"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      location.pathname === '/producer/ai-chat'
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border-r-4 border-blue-600'
                        : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <MessageSquare className={`h-5 w-5 ${
                      location.pathname === '/producer/ai-chat' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium text-sm">AI Chat</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/producer/settings"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      location.pathname === '/producer/settings'
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border-r-4 border-blue-600'
                        : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <Settings className={`h-5 w-5 ${
                      location.pathname === '/producer/settings' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium text-sm">Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100 bg-white">
          {/* Notifications Button */}
          <div className="mb-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Bell className="h-5 w-5 text-gray-400" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-sm">Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-sm font-bold text-white">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john@example.com</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Notifications Modal - Outside sidebar to overlay entire screen */}
      {showNotifications && renderNotificationsPanel()}
    </>
  );
};

export default Sidebar;