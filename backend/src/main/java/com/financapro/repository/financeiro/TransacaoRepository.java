package com.financapro.repository.financeiro;

import com.financapro.model.financeiro.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdAndMonthAndYearOrderByDateDesc(Long userId, Integer month, Integer year);

    List<Transaction> findByUserIdAndYearOrderByDateDesc(Long userId, Integer year);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND t.month = :month AND t.year = :year")
    BigDecimal sumByUserAndTypeAndMonthAndYear(
        @Param("userId") Long userId,
        @Param("type") Transaction.Type type,
        @Param("month") Integer month,
        @Param("year") Integer year
    );

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = 'EXPENSE' AND t.month = :month AND t.year = :year GROUP BY t.category")
    List<Object[]> sumByCategory(@Param("userId") Long userId, @Param("month") Integer month, @Param("year") Integer year);
}




