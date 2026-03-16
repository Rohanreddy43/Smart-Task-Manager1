package com.smarttaskmanager.service;

import com.smarttaskmanager.dto.ProjectDto;
import com.smarttaskmanager.model.Project;
import com.smarttaskmanager.model.User;
import com.smarttaskmanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for Project management operations
 */
@Service
@Transactional
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    /**
     * Create a new project
     */
    public ProjectDto createProject(ProjectDto projectDto, User user) {
        Project project = Project.builder()
                .name(projectDto.getName())
                .description(projectDto.getDescription())
                .status(projectDto.getStatus() != null ? projectDto.getStatus() : Project.ProjectStatus.PLANNED)
                .priority(projectDto.getPriority() != null ? projectDto.getPriority() : Project.ProjectPriority.MEDIUM)
                .user(user)
                .startDate(projectDto.getStartDate())
                .endDate(projectDto.getEndDate())
                .build();
        
        Project savedProject = projectRepository.save(project);
        return ProjectDto.fromEntity(savedProject);
    }
    
    /**
     * Get project by ID
     */
    public Optional<ProjectDto> getProjectById(Long id, User user) {
        return projectRepository.findById(id)
                .filter(project -> project.getUser().getId().equals(user.getId()))
                .map(ProjectDto::fromEntity);
    }
    
    /**
     * Get all projects for a user
     */
    public Page<ProjectDto> getAllProjects(User user, Pageable pageable) {
        return projectRepository.findByUser(user, pageable)
                .map(ProjectDto::fromEntity);
    }
    
    /**
     * Update project
     */
    public Optional<ProjectDto> updateProject(Long id, ProjectDto projectDto, User user) {
        return projectRepository.findById(id)
                .filter(project -> project.getUser().getId().equals(user.getId()))
                .map(project -> {
                    project.setName(projectDto.getName());
                    project.setDescription(projectDto.getDescription());
                    project.setStatus(projectDto.getStatus());
                    project.setPriority(projectDto.getPriority());
                    project.setStartDate(projectDto.getStartDate());
                    project.setEndDate(projectDto.getEndDate());
                    project.setUpdatedAt(LocalDateTime.now());
                    
                    Project updatedProject = projectRepository.save(project);
                    return ProjectDto.fromEntity(updatedProject);
                });
    }
    
    /**
     * Delete project
     */
    public boolean deleteProject(Long id, User user) {
        return projectRepository.findById(id)
                .filter(project -> project.getUser().getId().equals(user.getId()))
                .map(project -> {
                    projectRepository.delete(project);
                    return true;
                })
                .orElse(false);
    }
    
    /**
     * Get projects by status
     */
    public List<ProjectDto> getProjectsByStatus(User user, Project.ProjectStatus status) {
        return projectRepository.findByUserAndStatus(user, status)
                .stream()
                .map(ProjectDto::fromEntity)
                .toList();
    }
    
    /**
     * Get projects by priority
     */
    public List<ProjectDto> getProjectsByPriority(User user, Project.ProjectPriority priority) {
        return projectRepository.findByUserAndPriority(user, priority)
                .stream()
                .map(ProjectDto::fromEntity)
                .toList();
    }
    
    /**
     * Get active projects on a specific date
     */
    public List<ProjectDto> getActiveProjectsOnDate(User user, LocalDateTime date) {
        return projectRepository.findByUserAndActiveOnDate(user, date)
                .stream()
                .map(ProjectDto::fromEntity)
                .toList();
    }
}
