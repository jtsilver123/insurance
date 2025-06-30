import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { mockProspects, mockActivities } from '../../data/mockData';
import { format } from 'date-fns';

const TodayView: React.FC = () => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const todayActions = [
    {
      id: '1',
      type: 'follow-up',
      prospect: 'Tech Solutions Inc',
      action: 'Follow up on missing loss runs',
      priority: 'high',
      dueTime: '2:00 PM'
    },
    {
      id: '2',
      type: 'quote',
      prospect: 'Green Energy Co',
      action: 'Review and compare incoming quotes',
      priority: 'medium',
      dueTime: '4:30 PM'
    },
    {
      id: '3',
      type: 'renewal',
      prospect: 'Downtown Restaurant',
      action: 'Prepare renewal package',
      priority: 'low',
      dueTime: 'Tomorrow'
    }
  ];

  const stats = [
    {
      title: 'Active Prospects',
      value: '24',
      change: '+3 this week',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Pending Quotes',
      value: '8',
      change: '2 due today',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Revenue Pipeline',
      value: '$145K',
      change: '+12% vs last month',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Bound This Month',
      value: '12',
      change: '+25% vs last month',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{greeting}, John! 👋</h1>
            <p className="text-blue-100 text-lg">Here's what's happening with your prospects today</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Today</p>
            <p className="text-2xl font-bold">{format(new Date(), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-2 font-medium">{stat.change}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 shadow-sm`}>
                <stat.icon className={`h-7 w-7 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              Today's Actions
            </h2>
            <p className="text-gray-600 mt-1">Your priority tasks for today</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayActions.map((action) => (
                <div key={action.id} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer">
                  <div className={`p-2 rounded-full ${
                    action.priority === 'high' ? 'bg-red-100 group-hover:bg-red-200' :
                    action.priority === 'medium' ? 'bg-yellow-100 group-hover:bg-yellow-200' :
                    'bg-green-100 group-hover:bg-green-200'
                  }`}>
                    <AlertCircle className={`h-4 w-4 ${
                      action.priority === 'high' ? 'text-red-600' :
                      action.priority === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{action.prospect}</p>
                    <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">{action.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{action.dueTime}</p>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 ml-auto mt-1 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
              Recent Activity
            </h2>
            <p className="text-gray-600 mt-1">Latest updates across all prospects</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockActivities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-full shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(activity.timestamp, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link 
                to="/producer/activity"
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center group transition-colors"
              >
                View all activity
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TodayView;