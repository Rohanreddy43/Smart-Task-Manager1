package com.smarttaskmanager.repository;

import com.smarttaskmanager.model.Task;
import com.smarttaskmanager.model.TaskComment;
import com.smarttaskmanager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for TaskComment entity
 */
@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    
    Page<TaskComment> findByTaskOrderByCreatedAtDesc(Task task, Pageable pageable);
    
    Page<TaskComment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<TaskComment> findByTaskAndUserOrderByCreatedAtDesc(Task task, User user, Pageable pageable);
}