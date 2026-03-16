package com.smarttaskmanager.repository;

import com.smarttaskmanager.model.Project;
import com.smarttaskmanager.model.Task;
import com.smarttaskmanager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Task entity
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Task> findByUser(User user, Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.project = :project")
    List<Task> findByUserAndProject(@Param("user") User user, @Param("project") Project project);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.status = :status")
    List<Task> findByUserAndStatus(@Param("user") User user, @Param("status") Task.TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.priority = :priority")
    List<Task> findByUserAndPriority(@Param("user") User user, @Param("priority") Task.TaskPriority priority);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.complexity = :complexity")
    List<Task> findByUserAndComplexity(@Param("user") User user, @Param("complexity") Task.TaskComplexity complexity);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.dueDate <= :date AND t.status NOT IN :completedStatuses")
    List<Task> findByUserAndDueDateBefore(@Param("user") User user, @Param("date") LocalDateTime date, @Param("completedStatuses") List<Task.TaskStatus> completedStatuses);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.status = :status AND t.dueDate BETWEEN :start AND :end")
    List<Task> findByUserAndStatusAndDueDateBetween(@Param("user") User user, @Param("status") Task.TaskStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND (t.title LIKE %:keyword% OR t.description LIKE %:keyword%)")
    Page<Task> findByUserAndKeyword(@Param("user") User user, @Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user = :user AND t.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") Task.TaskStatus status);
    
    @Query("SELECT AVG(t.estimatedHours) FROM Task t WHERE t.user = :user AND t.status = :status AND t.estimatedHours IS NOT NULL")
    Double getAverageEstimatedHoursByUserAndStatus(@Param("user") User user, @Param("status") Task.TaskStatus status);
}
