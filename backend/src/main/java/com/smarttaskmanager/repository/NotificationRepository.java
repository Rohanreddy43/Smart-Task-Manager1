package com.smarttaskmanager.repository;

import com.smarttaskmanager.model.Notification;
import com.smarttaskmanager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Notification entity
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.status = :status")
    List<Notification> findByUserAndStatus(@Param("user") User user, @Param("status") Notification.NotificationStatus status);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.type = :type")
    List<Notification> findByUserAndType(@Param("user") User user, @Param("type") Notification.NotificationType type);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") Notification.NotificationStatus status);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.status = :status ORDER BY n.createdAt DESC")
    Page<Notification> findByUserAndStatusOrderByCreatedAtDesc(@Param("user") User user, @Param("status") Notification.NotificationStatus status, Pageable pageable);
}