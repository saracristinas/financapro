package com.financapro.repository.equipe;

import com.financapro.model.equipe.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MembroEquipeRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByOwnerIdAndStatusNot(Long ownerId, TeamMember.Status status);
}



