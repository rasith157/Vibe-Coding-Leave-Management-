package com.leaveflow.repository;

import com.leaveflow.entity.Leave;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    
    List<Leave> findByUserId(Long userId);
    
    List<Leave> findByUserIdAndStatus(Long userId, String status);
    
    List<Leave> findByStatus(String status);
    
    List<Leave> findByLeaveType(String leaveType);
    
    List<Leave> findByUserIdAndLeaveType(Long userId, String leaveType);
    
    @Query("SELECT l FROM Leave l WHERE l.startDate >= :startDate AND l.endDate <= :endDate")
    List<Leave> findByDateRange(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT l FROM Leave l WHERE l.userId = :userId AND l.startDate >= :startDate AND l.endDate <= :endDate")
    List<Leave> findByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.userId = :userId AND l.leaveType = :leaveType AND l.status = 'APPROVED' AND YEAR(l.startDate) = :year")
    Long countApprovedLeavesByUserAndTypeAndYear(Long userId, String leaveType, int year);
    
    @Query("SELECT COALESCE(SUM(l.duration), 0) FROM Leave l WHERE l.userId = :userId AND l.leaveType = :leaveType AND l.status = 'APPROVED' AND YEAR(l.startDate) = :year")
    Integer sumApprovedLeaveDaysByUserAndTypeAndYear(Long userId, String leaveType, int year);
} 