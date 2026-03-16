package com.smarttaskmanager.controller;

import com.smarttaskmanager.dto.ProjectDto;
import com.smarttaskmanager.model.Project;
import com.smarttaskmanager.model.User;
import com.smarttaskmanager.service.ProjectService;
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
 * REST Controller for Project endpoints
 */
@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    /**
     * Create a new project
     */
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectDto projectDto, @AuthenticationPrincipal User user) {
        try {
            ProjectDto createdProject = projectService.createProject(projectDto, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Project created successfully");
            response.put("project", createdProject);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Get all projects for the authenticated user
     */
    @GetMapping
    public ResponseEntity<?> getAllProjects(@AuthenticationPrincipal User user, Pageable pageable) {
        Page<ProjectDto> projects = projectService.getAllProjects(user, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("projects", projects.getContent());
        response.put("currentPage", projects.getNumber());
        response.put("totalItems", projects.getTotalElements());
        response.put("totalPages", projects.getTotalPages());
        response.put("pageSize", projects.getSize());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get project by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Optional<ProjectDto> projectDto = projectService.getProjectById(id, user);
        
        if (projectDto.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("project", projectDto.get());
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Project not found");
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Update project
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody ProjectDto projectDto, @AuthenticationPrincipal User user) {
        Optional<ProjectDto> updatedProject = projectService.updateProject(id, projectDto, user);
        
        if (updatedProject.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Project updated successfully");
            response.put("project", updatedProject.get());
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Project not found or access denied");
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete project
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id, @AuthenticationPrincipal User user) {
        boolean deleted = projectService.deleteProject(id, user);
        
        if (deleted) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Project deleted successfully");
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Project not found or access denied");
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get projects by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getProjectsByStatus(@PathVariable Project.ProjectStatus status, @AuthenticationPrincipal User user) {
        List<ProjectDto> projects = projectService.getProjectsByStatus(user, status);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("projects", projects);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get projects by priority
     */
    @GetMapping("/priority/{priority}")
    public ResponseEntity<?> getProjectsByPriority(@PathVariable Project.ProjectPriority priority, @AuthenticationPrincipal User user) {
        List<ProjectDto> projects = projectService.getProjectsByPriority(user, priority);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("projects", projects);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get active projects on a specific date
     */
    @GetMapping("/active/{date}")
    public ResponseEntity<?> getActiveProjectsOnDate(@PathVariable String date, @AuthenticationPrincipal User user) {
        LocalDateTime localDate = LocalDateTime.parse(date + "T00:00:00");
        List<ProjectDto> projects = projectService.getActiveProjectsOnDate(user, localDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("projects", projects);
        
        return ResponseEntity.ok(response);
    }
}