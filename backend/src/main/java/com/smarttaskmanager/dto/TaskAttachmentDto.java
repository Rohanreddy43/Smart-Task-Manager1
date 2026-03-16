package com.smarttaskmanager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smarttaskmanager.model.TaskAttachment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for TaskAttachment entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskAttachmentDto {
    
    private Long id;
    private String filename;
    private String originalFilename;
    private String contentType;
    private String filePath;
    private Long fileSize;
    private Long userId;
    private String username;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    public static TaskAttachmentDto fromEntity(TaskAttachment attachment) {
        return TaskAttachmentDto.builder()
                .id(attachment.getId())
                .filename(attachment.getFilename())
                .originalFilename(attachment.getOriginalFilename())
                .contentType(attachment.getContentType())
                .filePath(attachment.getFilePath())
                .fileSize(attachment.getFileSize())
                .userId(attachment.getUser().getId())
                .username(attachment.getUser().getUsername())
                .createdAt(attachment.getCreatedAt())
                .build();
    }
}