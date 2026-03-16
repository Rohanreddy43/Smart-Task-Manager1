package com.smarttaskmanager.repository;

import com.smarttaskmanager.model.Project;
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
 * Repository interface for Project entity
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Project> findByUser(User user, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.user = :user AND p.status IN :statuses")
    List<Project> findByUserAndStatusIn(@Param("user") User user, @Param("statuses") List<Project.ProjectStatus> statuses);
    
    @Query("SELECT p FROM Project p WHERE p.user = :user AND p.priority = :priority")
    List<Project> findByUserAndPriority(@Param("user") User user, @Param("priority") Project.ProjectPriority priority);
    
    @Query("SELECT p FROM Project p WHERE p.user = :user AND p.startDate <= :date AND (p.endDate IS NULL OR p.endDate >= :date)")
    List<Project> findByUserAndActiveOnDate(@Param("user") User user, @Param("date") LocalDateTime date);
    
    @Query("SELECT p FROM Project p WHERE p.user = :user AND p.status = :status")
    List<Project> findByUserAndStatus(@Param("user") User user, @Param("status") Project.ProjectStatus status);
}
