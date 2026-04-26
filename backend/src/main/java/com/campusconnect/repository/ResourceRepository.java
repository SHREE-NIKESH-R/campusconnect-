package com.campusconnect.repository;

import com.campusconnect.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByActiveTrue();

    List<Resource> findByTypeAndActiveTrue(Resource.ResourceType type);

    List<Resource> findByAvailableTrueAndActiveTrue();

    @Query("SELECT r FROM Resource r WHERE r.active = true AND r.capacity >= :minCapacity")
    List<Resource> findByMinCapacity(@Param("minCapacity") int minCapacity);

    @Query("""
        SELECT r FROM Resource r WHERE r.active = true
        AND r.id NOT IN (
            SELECT b.resource.id FROM Booking b
            WHERE b.bookingDate = :date
            AND b.status IN ('PENDING', 'APPROVED')
            AND ((b.startTime < :endTime AND b.endTime > :startTime))
        )
    """)
    List<Resource> findAvailableResources(
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );

    @Query("SELECT COUNT(r) FROM Resource r WHERE r.type = :type AND r.active = true")
    long countByType(@Param("type") Resource.ResourceType type);
}
