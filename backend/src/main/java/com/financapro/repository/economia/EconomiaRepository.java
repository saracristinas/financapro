package com.financapro.repository.economia;

import com.financapro.model.economia.Saving;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EconomiaRepository extends JpaRepository<Saving, Long> {
    List<Saving> findByUserIdOrderByCreatedAtDesc(Long userId);
}




