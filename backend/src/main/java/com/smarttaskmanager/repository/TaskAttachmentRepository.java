package com.smarttaskmanager.repository;

import com.smarttaskmanager.model.Task;
import com.smarttaskmanager.model.TaskAttachment;
import com.smarttaskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for TaskAttachment entity
 */
@Repository
public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long> {
    
    List<TaskAttachment> findByTaskOrderByCreatedAtDesc(Task task);
    
    List<TaskAttachment> findByUserOrderByCreatedAtDesc(User user);
    
    List<TaskAttachment> findByTaskAndUser(Task task, User user);
}