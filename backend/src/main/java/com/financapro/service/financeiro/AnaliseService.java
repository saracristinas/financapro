package com.financapro.service.financeiro;

import com.financapro.dto.financeiro.DadosMensaisDto;
import com.financapro.model.autenticacao.User;
import com.financapro.model.financeiro.Transaction;
import com.financapro.repository.financeiro.TransacaoRepository;
import com.financapro.service.compartilhado.UsuarioAcessoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnaliseService {

    private final TransacaoRepository transacaoRepository;
    private final UsuarioAcessoService usuarioAcessoService;

    private static final String[] MONTHS = {
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    };

    public List<DadosMensaisDto> getAnnual(String email, int year) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Long uid = user.getId();
        return java.util.Arrays.stream(MONTHS).map(m -> {
            int idx = List.of(MONTHS).indexOf(m) + 1;
            BigDecimal inc = nvl(transacaoRepository.sumByUserAndTypeAndMonthAndYear(uid, Transaction.Type.INCOME, idx, year));
            BigDecimal exp = nvl(transacaoRepository.sumByUserAndTypeAndMonthAndYear(uid, Transaction.Type.EXPENSE, idx, year));

            var md = new DadosMensaisDto();
            md.setMonth(m);
            md.setMonthNumber(idx);
            md.setIncome(inc);
            md.setExpenses(exp);
            md.setSavings(inc.subtract(exp).max(BigDecimal.ZERO));
            return md;
        }).collect(Collectors.toList());
    }

    private BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}






