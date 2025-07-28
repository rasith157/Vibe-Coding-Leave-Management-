package com.leaveflow.repository;

import com.leaveflow.entity.History;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistoryRepository extends CrudRepository<History, Long> {
    
    List<History> findByUserId(Long userId);
    
    List<History> findByLeaveId(Long leaveId);
    
    List<History> findByAction(String action);
    
    List<History> findByPerformedBy(Long performedBy);
    
    List<History> findByUserIdOrderByTimestampDesc(Long userId);
    
    List<History> findByLeaveIdOrderByTimestampDesc(Long leaveId);
    
    @Query("SELECT * FROM history WHERE timestamp >= :fromDate AND timestamp <= :toDate ORDER BY timestamp DESC")
    List<History> findByDateRange(LocalDateTime fromDate, LocalDateTime toDate);
    
    @Query("SELECT * FROM history WHERE user_id = :userId AND timestamp >= :fromDate AND timestamp <= :toDate ORDER BY timestamp DESC")
    List<History> findByUserIdAndDateRange(Long userId, LocalDateTime fromDate, LocalDateTime toDate);
} 