package com.leaveflow.repository;

import com.leaveflow.entity.Leave;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends CrudRepository<Leave, Long> {
    
    List<Leave> findByUserId(Long userId);
    
    List<Leave> findByUserIdAndStatus(Long userId, String status);
    
    List<Leave> findByStatus(String status);
    
    List<Leave> findByLeaveType(String leaveType);
    
    List<Leave> findByUserIdAndLeaveType(Long userId, String leaveType);
    
    @Query("SELECT * FROM leaves WHERE start_date >= :startDate AND end_date <= :endDate")
    List<Leave> findByDateRange(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT * FROM leaves WHERE user_id = :userId AND start_date >= :startDate AND end_date <= :endDate")
    List<Leave> findByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(*) FROM leaves WHERE user_id = :userId AND leave_type = :leaveType AND status = 'APPROVED' AND EXTRACT(YEAR FROM start_date) = :year")
    Long countApprovedLeavesByUserAndTypeAndYear(Long userId, String leaveType, int year);
    
    @Query("SELECT SUM(duration) FROM leaves WHERE user_id = :userId AND leave_type = :leaveType AND status = 'APPROVED' AND EXTRACT(YEAR FROM start_date) = :year")
    Integer sumApprovedLeaveDaysByUserAndTypeAndYear(Long userId, String leaveType, int year);
} 