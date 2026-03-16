package com.smarttaskmanager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smarttaskmanager.model.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Project entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    
    private Long id;
    private String name;
    private String description;
    private Project.ProjectStatus status;
    private Project.ProjectPriority priority;
    private Long userId;
    private String username;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;
    
    private Long taskCount;
    
    public static ProjectDto fromEntity(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .priority(project.getPriority())
                .userId(project.getUser().getId())
                .username(project.getUser().getUsername())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .build();
    }
}