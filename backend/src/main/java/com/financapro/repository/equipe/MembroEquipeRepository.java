package com.financapro.repository.equipe;

import com.financapro.model.equipe.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MembroEquipeRepository extends JpaRepository<TeamMember, Long> {
    
    @Query("SELECT tm FROM TeamMember tm " +
           "LEFT JOIN FETCH tm.member " +
           "WHERE tm.owner.id = :ownerId AND tm.status != :status")
    List<TeamMember> findByOwnerIdAndStatusNot(@Param("ownerId") Long ownerId, @Param("status") TeamMember.Status status);
}

