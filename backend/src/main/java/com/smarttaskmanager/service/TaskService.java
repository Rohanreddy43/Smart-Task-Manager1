package com.smarttaskmanager.service;

import com.smarttaskmanager.dto.TaskDto;
import com.smarttaskmanager.model.Project;
import com.smarttaskmanager.model.Task;
import com.smarttaskmanager.model.User;
import com.smarttaskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for Task management operations
 */
@Service
@Transactional
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    /**
     * Create a new task
     */
    public TaskDto createTask(TaskDto taskDto, User user, Project project) {
        Task task = Task.builder()
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .status(taskDto.getStatus() != null ? taskDto.getStatus() : Task.TaskStatus.PENDING)
                .priority(taskDto.getPriority() != null ? taskDto.getPriority() : Task.TaskPriority.MEDIUM)
                .complexity(taskDto.getComplexity() != null ? taskDto.getComplexity() : Task.TaskComplexity.MEDIUM)
                .user(user)
                .project(project)
                .dueDate(taskDto.getDueDate())
                .estimatedHours(taskDto.getEstimatedHours())
                .build();
        
        Task savedTask = taskRepository.save(task);
        return TaskDto.fromEntity(savedTask);
    }
    
    /**
     * Get task by ID
     */
    public Optional<TaskDto> getTaskById(Long id, User user) {
        return taskRepository.findById(id)
                .filter(task -> task.getUser().getId().equals(user.getId()))
                .map(TaskDto::fromEntity);
    }
    
    /**
     * Get all tasks for a user
     */
    public Page<TaskDto> getAllTasks(User user, Pageable pageable) {
        return taskRepository.findByUser(user, pageable)
                .map(TaskDto::fromEntity);
    }
    
    /**
     * Get tasks by project
     */
    public List<TaskDto> getTasksByProject(User user, Project project) {
        return taskRepository.findByUserAndProject(user, project)
                .stream()
                .map(TaskDto::fromEntity)
                .toList();
    }
    
    /**
     * Get tasks by status
     */
    public List<TaskDto> getTasksByStatus(User user, Task.TaskStatus status) {
        return taskRepository.findByUserAndStatus(user, status)
                .stream()
                .map(TaskDto::fromEntity)
                .toList();
    }
    
    /**
     * Get tasks by priority
     */
    public List<TaskDto> getTasksByPriority(User user, Task.TaskPriority priority) {
        return taskRepository.findByUserAndPriority(user, priority)
                .stream()
                .map(TaskDto::fromEntity)
                .toList();
    }
    
    /**
     * Get tasks by complexity
     */
    public List<TaskDto> getTasksByComplexity(User user, Task.TaskComplexity complexity) {
        return taskRepository.findByUserAndComplexity(user, complexity)
                .stream()
                .map(TaskDto::fromEntity)
                .toList();
    }
    
    /**
     * Get overdue tasks
     */
    public List<TaskDto> getOverdueTasks(User user) {
        LocalDateTime now = LocalDateTime.now();
        List<Task.TaskStatus> completedStatuses = List.of(Task.TaskStatus.COMPLETED, Task.TaskStatus.CANCELLED);
        
        return taskRepository.findByUserAndDueDateBefore(user, now, completedStatuses)
                .stream()
                .map(TaskDto::fromEntity)
                .toList();
    }
    
    /**
     * Get tasks due between dates
     */
    public List<TaskDto> getTasksDueBetween(User user, Task.TaskStatus status, LocalDateTime start, LocalDateTime end) {
        return taskRepository.findByUserAndStatusAndDueDateBetween(user, status, start, end)
                .stream()
                .map(TaskDto::fromEntity)
                .toList();
    }
    
    /**
     * Search tasks by keyword
     */
    public Page<TaskDto> searchTasks(User user, String keyword, Pageable pageable) {
        return taskRepository.findByUserAndKeyword(user, keyword, pageable)
                .map(TaskDto::fromEntity);
    }
    
    /**
     * Update task
     */
    public Optional<TaskDto> updateTask(Long id, TaskDto taskDto, User user) {
        return taskRepository.findById(id)
                .filter(task -> task.getUser().getId().equals(user.getId()))
                .map(task -> {
                    task.setTitle(taskDto.getTitle());
                    task.setDescription(taskDto.getDescription());
                    task.setStatus(taskDto.getStatus());
                    task.setPriority(taskDto.getPriority());
                    task.setComplexity(taskDto.getComplexity());
                    task.setDueDate(taskDto.getDueDate());
                    task.setEstimatedHours(taskDto.getEstimatedHours());
                    task.setActualHours(taskDto.getActualHours());
                    task.setAiInsights(taskDto.getAiInsights());
                    task.setUpdatedAt(LocalDateTime.now());
                    
                    Task updatedTask = taskRepository.save(task);
                    return TaskDto.fromEntity(updatedTask);
                });
    }
    
    /**
     * Complete task
     */
    public Optional<TaskDto> completeTask(Long id, User user, Integer actualHours) {
        return taskRepository.findById(id)
                .filter(task -> task.getUser().getId().equals(user.getId()))
                .map(task -> {
                    task.setStatus(Task.TaskStatus.COMPLETED);
                    task.setCompletedAt(LocalDateTime.now());
                    if (actualHours != null) {
                        task.setActualHours(actualHours);
                    }
                    task.setUpdatedAt(LocalDateTime.now());
                    
                    Task updatedTask = taskRepository.save(task);
                    return TaskDto.fromEntity(updatedTask);
                });
    }
    
    /**
     * Delete task
     */
    public boolean deleteTask(Long id, User user) {
        return taskRepository.findById(id)
                .filter(task -> task.getUser().getId().equals(user.getId()))
                .map(task -> {
                    taskRepository.delete(task);
                    return true;
                })
                .orElse(false);
    }
    
    /**
     * Get task statistics
     */
    public TaskStatistics getTaskStatistics(User user) {
        TaskStatistics stats = new TaskStatistics();
        
        stats.setTotalTasks(taskRepository.countByUserAndStatus(user, Task.TaskStatus.PENDING));
        stats.setInProgressTasks(taskRepository.countByUserAndStatus(user, Task.TaskStatus.IN_PROGRESS));
        stats.setCompletedTasks(taskRepository.countByUserAndStatus(user, Task.TaskStatus.COMPLETED));
        
        Double avgEstimatedHours = taskRepository.getAverageEstimatedHoursByUserAndStatus(user, Task.TaskStatus.COMPLETED);
        stats.setAverageEstimatedHours(avgEstimatedHours != null ? avgEstimatedHours : 0.0);
        
        return stats;
    }
    
    /**
     * Task statistics class
     */
    public static class TaskStatistics {
        private Long totalTasks;
        private Long inProgressTasks;
        private Long completedTasks;
        private Double averageEstimatedHours;
        
        // Getters and setters
        public Long getTotalTasks() { return totalTasks; }
        public void setTotalTasks(Long totalTasks) { this.totalTasks = totalTasks; }
        
        public Long getInProgressTasks() { return inProgressTasks; }
        public void setInProgressTasks(Long inProgressTasks) { this.inProgressTasks = inProgressTasks; }
        
        public Long getCompletedTasks() { return completedTasks; }
        public void setCompletedTasks(Long completedTasks) { this.completedTasks = completedTasks; }
        
        public Double getAverageEstimatedHours() { return averageEstimatedHours; }
        public void setAverageEstimatedHours(Double averageEstimatedHours) { this.averageEstimatedHours = averageEstimatedHours; }
    }
}