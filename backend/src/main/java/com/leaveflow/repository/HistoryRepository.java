package com.leaveflow.repository;

import com.leaveflow.entity.History;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    
    List<History> findByUserId(Long userId);
    
    List<History> findByLeaveId(Long leaveId);
    
    List<History> findByAction(String action);
    
    List<History> findByPerformedBy(Long performedBy);
    
    List<History> findByUserIdOrderByTimestampDesc(Long userId);
    
    List<History> findByLeaveIdOrderByTimestampDesc(Long leaveId);
    
    @Query("SELECT h FROM History h WHERE h.timestamp >= :fromDate AND h.timestamp <= :toDate ORDER BY h.timestamp DESC")
    List<History> findByDateRange(LocalDateTime fromDate, LocalDateTime toDate);
    
    @Query("SELECT h FROM History h WHERE h.userId = :userId AND h.timestamp >= :fromDate AND h.timestamp <= :toDate ORDER BY h.timestamp DESC")
    List<History> findByUserIdAndDateRange(Long userId, LocalDateTime fromDate, LocalDateTime toDate);
} 