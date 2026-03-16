import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store/index'
import { Plus, Calendar, Folder, BarChart3, TrendingUp } from 'lucide-react'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { statistics } = useSelector((state: RootState) => state.tasks)

  const quickActions = [
    {
      title: 'Create Task',
      description: 'Add a new task to your list',
      icon: Plus,
      color: 'text-green-600',
      bg: 'bg-green-50',
      onClick: () => navigate('/tasks')
    },
    {
      title: 'View Tasks',
      description: 'Manage your current tasks',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      onClick: () => navigate('/tasks')
    },
    {
      title: 'Manage Projects',
      description: 'Organize your projects',
      icon: Folder,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      onClick: () => navigate('/projects')
    },
    {
      title: 'View Analytics',
      description: 'Track your productivity',
      icon: BarChart3,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      onClick: () => navigate('/analytics')
    }
  ]

  const stats = [
    {
      name: 'Total Tasks',
      value: statistics.totalTasks,
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'In Progress',
      value: statistics.inProgressTasks,
      change: '+5%',
      changeType: 'increase',
    },
    {
      name: 'Completed',
      value: statistics.completedTasks,
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Avg. Hours',
      value: statistics.averageEstimatedHours.toFixed(1),
      change: '-2%',
      changeType: 'decrease',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
            <p className="text-gray-600 mt-1">Here's your productivity overview for today</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <div
              key={index}
              onClick={action.onClick}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
                <div className={`p-3 rounded-full ${action.bg}`}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`flex items-center space-x-1 ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Completed "Review project requirements" - 2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Started "Design database schema" - 4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Created new project "E-commerce Platform" - Yesterday</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Updated task deadline for "API integration" - 2 days ago</span>
          </div>
        </div>
        <button className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all activity →
        </button>
      </div>
    </div>
  )
}

export default Dashboard