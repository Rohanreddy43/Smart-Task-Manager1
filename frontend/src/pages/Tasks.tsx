import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/index'
import { fetchTasks, createTask, updateTask, deleteTask, completeTask, Task } from '../store/slices/taskSlice'
import { fetchProjects } from '../store/slices/projectSlice'
import { toast } from 'react-hot-toast'
import { Plus, CheckCircle, Clock, AlertCircle, Pencil, Trash2 } from 'lucide-react'

const Tasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, isLoading } = useSelector((state: RootState) => state.tasks)
  const { projects } = useSelector((state: RootState) => state.projects)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<string>('ALL')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL',
    projectId: undefined as number | undefined,
    dueDate: '',
    estimatedHours: 0,
    complexity: 'SIMPLE' as 'SIMPLE' | 'MEDIUM' | 'COMPLEX' | 'EXPERT',
  })

  useEffect(() => {
    dispatch(fetchTasks())
    dispatch(fetchProjects())
  }, [dispatch])

  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === 'ALL') return true
    return task.status === filter
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const taskData = {
        ...formData,
        projectId: formData.projectId || undefined,
        dueDate: formData.dueDate ? `${formData.dueDate} 00:00:00` : undefined,
      }
      
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask.id, ...taskData })).unwrap()
        toast.success('Task updated successfully')
      } else {
        await dispatch(createTask({ ...taskData, userId: user?.id || 1 })).unwrap()
        toast.success('Task created successfully')
      }
      setShowModal(false)
      setEditingTask(null)
      resetForm()
    } catch (error) {
      toast.error('Operation failed')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      projectId: undefined,
      dueDate: '',
      estimatedHours: 0,
      complexity: 'SIMPLE',
    })
  }

  const handleComplete = async (id: number) => {
    try {
      await dispatch(completeTask({ id })).unwrap()
      toast.success('Task completed!')
    } catch (error) {
      toast.error('Failed to complete task')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap()
        toast.success('Task deleted successfully')
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'IN_PROGRESS': return <Clock className="h-5 w-5 text-blue-600" />
      case 'PENDING': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'ON_HOLD': return <Clock className="h-5 w-5 text-gray-600" />
      case 'CANCELLED': return <AlertCircle className="h-5 w-5 text-red-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'badge badge-critical'
      case 'URGENT': return 'badge badge-urgent'
      case 'HIGH': return 'badge badge-high'
      case 'MEDIUM': return 'badge badge-medium'
      case 'LOW': return 'badge badge-low'
      default: return 'badge badge-medium'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'badge badge-completed'
      case 'IN_PROGRESS': return 'badge badge-in-progress'
      case 'PENDING': return 'badge badge-pending'
      case 'CANCELLED': return 'badge badge-urgent'
      case 'ON_HOLD': return 'badge badge-medium'
      default: return 'badge badge-medium'
    }
  }

  const normalizeDateForInput = (value?: string) => {
    if (!value) return ''
    return value.replace(' ', 'T').split('T')[0]
  }

  const formatDisplayDate = (value?: string) => {
    if (!value) return '-'
    return new Date(value.replace(' ', 'T')).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your tasks</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-4">Create your first task to get started</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">Create Task</button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task: Task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(task.status)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{task.projectName || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusColor(task.status)}>{task.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {formatDisplayDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {task.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleComplete(task.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Complete"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingTask(task)
                          setFormData({
                            title: task.title,
                            description: task.description,
                            status: task.status,
                            priority: task.priority,
                            projectId: task.projectId,
                            dueDate: normalizeDateForInput(task.dueDate),
                            estimatedHours: task.estimatedHours || 0,
                            complexity: task.complexity || 'SIMPLE',
                          })
                          setShowModal(true)
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field mt-1"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select
                  value={formData.projectId || ''}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value ? Number(e.target.value) : undefined })}
                  className="input-field mt-1"
                >
                  <option value="">No Project</option>
                  {projects.map((project: any) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="input-field mt-1"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="input-field mt-1"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                    className="input-field mt-1"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTask(null)
                    resetForm()
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks
