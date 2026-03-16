package com.smarttaskmanager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smarttaskmanager.model.TaskComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for TaskComment entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskCommentDto {
    
    private Long id;
    private String content;
    private Long userId;
    private String username;
    private String userFirstName;
    private String userLastName;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    public static TaskCommentDto fromEntity(TaskComment comment) {
        return TaskCommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .userFirstName(comment.getUser().getFirstName())
                .userLastName(comment.getUser().getLastName())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}