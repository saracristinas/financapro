package com.financapro.repository.divida;

import com.financapro.model.divida.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DividaRepository extends JpaRepository<Debt, Long> {
    List<Debt> findByUserIdOrderByDueDateAsc(Long userId);
}




