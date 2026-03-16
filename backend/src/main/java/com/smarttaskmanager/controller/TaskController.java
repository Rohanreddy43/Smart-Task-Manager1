package com.smarttaskmanager.controller;

import com.smarttaskmanager.dto.TaskDto;
import com.smarttaskmanager.model.Project;
import com.smarttaskmanager.model.Task;
import com.smarttaskmanager.model.User;
import com.smarttaskmanager.service.ProjectService;
import com.smarttaskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Task endpoints
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private ProjectService projectService;
    
    /**
     * Create a new task
     */
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskDto taskDto, @AuthenticationPrincipal User user) {
        try {
            Project project = null;
            if (taskDto.getProjectId() != null) {
                Optional<com.smarttaskmanager.dto.ProjectDto> projectDto = projectService.getProjectById(taskDto.getProjectId(), user);
                if (projectDto.isPresent()) {
                    // Convert ProjectDto back to Project entity
                    project = new Project();
                    project.setId(taskDto.getProjectId());
                    project.setName(taskDto.getProjectName());
                    project.setUser(user);
                } else {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Project not found");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }
            
            TaskDto createdTask = taskService.createTask(taskDto, user, project);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Task created successfully");
            response.put("task", createdTask);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Get all tasks for the authenticated user
     */
    @GetMapping
    public ResponseEntity<?> getAllTasks(@AuthenticationPrincipal User user, Pageable pageable) {
        Page<TaskDto> tasks = taskService.getAllTasks(user, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks.getContent());
        response.put("currentPage", tasks.getNumber());
        response.put("totalItems", tasks.getTotalElements());
        response.put("totalPages", tasks.getTotalPages());
        response.put("pageSize", tasks.getSize());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get task by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Optional<TaskDto> taskDto = taskService.getTaskById(id, user);
        
        if (taskDto.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("task", taskDto.get());
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Task not found");
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Update task
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskDto taskDto, @AuthenticationPrincipal User user) {
        Optional<TaskDto> updatedTask = taskService.updateTask(id, taskDto, user);
        
        if (updatedTask.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Task updated successfully");
            response.put("task", updatedTask.get());
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Task not found or access denied");
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Complete task
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Long id, @RequestBody(required = false) Map<String, Integer> requestBody, @AuthenticationPrincipal User user) {
        Integer actualHours = requestBody != null ? requestBody.get("actualHours") : null;
        Optional<TaskDto> completedTask = taskService.completeTask(id, user, actualHours);
        
        if (completedTask.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Task completed successfully");
            response.put("task", completedTask.get());
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Task not found or access denied");
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete task
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @AuthenticationPrincipal User user) {
        boolean deleted = taskService.deleteTask(id, user);
        
        if (deleted) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Task deleted successfully");
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Task not found or access denied");
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get tasks by project
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getTasksByProject(@PathVariable Long projectId, @AuthenticationPrincipal User user) {
        Optional<com.smarttaskmanager.dto.ProjectDto> projectDto = projectService.getProjectById(projectId, user);
        
        if (projectDto.isPresent()) {
            Project project = new Project();
            project.setId(projectId);
            project.setUser(user);
            
            List<TaskDto> tasks = taskService.getTasksByProject(user, project);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tasks", tasks);
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Project not found");
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get tasks by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getTasksByStatus(@PathVariable Task.TaskStatus status, @AuthenticationPrincipal User user) {
        List<TaskDto> tasks = taskService.getTasksByStatus(user, status);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get tasks by priority
     */
    @GetMapping("/priority/{priority}")
    public ResponseEntity<?> getTasksByPriority(@PathVariable Task.TaskPriority priority, @AuthenticationPrincipal User user) {
        List<TaskDto> tasks = taskService.getTasksByPriority(user, priority);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get tasks by complexity
     */
    @GetMapping("/complexity/{complexity}")
    public ResponseEntity<?> getTasksByComplexity(@PathVariable Task.TaskComplexity complexity, @AuthenticationPrincipal User user) {
        List<TaskDto> tasks = taskService.getTasksByComplexity(user, complexity);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get overdue tasks
     */
    @GetMapping("/overdue")
    public ResponseEntity<?> getOverdueTasks(@AuthenticationPrincipal User user) {
        List<TaskDto> tasks = taskService.getOverdueTasks(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get tasks due between dates
     */
    @GetMapping("/due-between")
    public ResponseEntity<?> getTasksDueBetween(@RequestParam String status, @RequestParam String start, @RequestParam String end, @AuthenticationPrincipal User user) {
        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase());
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        
        List<TaskDto> tasks = taskService.getTasksDueBetween(user, taskStatus, startDate, endDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Search tasks
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchTasks(@RequestParam String keyword, @AuthenticationPrincipal User user, Pageable pageable) {
        Page<TaskDto> tasks = taskService.searchTasks(user, keyword, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks.getContent());
        response.put("currentPage", tasks.getNumber());
        response.put("totalItems", tasks.getTotalElements());
        response.put("totalPages", tasks.getTotalPages());
        response.put("pageSize", tasks.getSize());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get task statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getTaskStatistics(@AuthenticationPrincipal User user) {
        TaskService.TaskStatistics stats = taskService.getTaskStatistics(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("statistics", stats);
        
        return ResponseEntity.ok(response);
    }
}
