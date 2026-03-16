import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/index'
import { BarChart3, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Analytics: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks)
  const { projects } = useSelector((state: RootState) => state.projects)

  const taskStatusData = [
    { name: 'Pending', value: tasks.filter((t: any) => t.status === 'PENDING').length, color: '#F59E0B' },
    { name: 'In Progress', value: tasks.filter((t: any) => t.status === 'IN_PROGRESS').length, color: '#3B82F6' },
    { name: 'Completed', value: tasks.filter((t: any) => t.status === 'COMPLETED').length, color: '#10B981' },
    { name: 'On Hold', value: tasks.filter((t: any) => t.status === 'ON_HOLD').length, color: '#6B7280' },
    { name: 'Cancelled', value: tasks.filter((t: any) => t.status === 'CANCELLED').length, color: '#EF4444' },
  ]

  const taskPriorityData = [
    { name: 'Low', value: tasks.filter((t: any) => t.priority === 'LOW').length, color: '#10B981' },
    { name: 'Medium', value: tasks.filter((t: any) => t.priority === 'MEDIUM').length, color: '#3B82F6' },
    { name: 'High', value: tasks.filter((t: any) => t.priority === 'HIGH').length, color: '#F97316' },
    { name: 'Urgent', value: tasks.filter((t: any) => t.priority === 'URGENT').length, color: '#EF4444' },
    { name: 'Critical', value: tasks.filter((t: any) => t.priority === 'CRITICAL').length, color: '#7F1D1D' },
  ]

  const projectStatusData = [
    { name: 'Active', value: projects.filter((p: any) => p.status === 'ACTIVE').length, color: '#3B82F6' },
    { name: 'Completed', value: projects.filter((p: any) => p.status === 'COMPLETED').length, color: '#10B981' },
    { name: 'Planned', value: projects.filter((p: any) => p.status === 'PLANNED').length, color: '#8B5CF6' },
    { name: 'Archived', value: projects.filter((p: any) => p.status === 'ARCHIVED').length, color: '#6B7280' },
    { name: 'Cancelled', value: projects.filter((p: any) => p.status === 'CANCELLED').length, color: '#EF4444' },
  ]

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter((t: any) => t.status === 'COMPLETED').length / tasks.length) * 100)
    : 0

  const stats = [
    {
      name: 'Total Tasks',
      value: tasks.length,
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Completed',
      value: tasks.filter((t: any) => t.status === 'COMPLETED').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      name: 'In Progress',
      value: tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      name: 'Total Projects',
      value: projects.length,
      icon: AlertCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your productivity and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Rate</h2>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray={`${completionRate * 2.83} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Task Priority */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskPriorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {taskPriorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {projectStatusData.map((status, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: status.color }}></div>
              <p className="text-2xl font-bold text-gray-900">{status.value}</p>
              <p className="text-sm text-gray-600">{status.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics
