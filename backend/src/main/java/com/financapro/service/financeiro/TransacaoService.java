package com.financapro.service.financeiro;

import com.financapro.dto.financeiro.PainelResponseDto;
import com.financapro.dto.financeiro.ResumoCategoriaDto;
import com.financapro.dto.financeiro.TransacaoRequestDto;
import com.financapro.dto.financeiro.TransacaoResponseDto;
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
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final UsuarioAcessoService usuarioAcessoService;

    public List<TransacaoResponseDto> getByMonthYear(String email, int month, int year) {
        User user = usuarioAcessoService.obterPorEmail(email);
        return transacaoRepository
            .findByUserIdAndMonthAndYearOrderByDateDesc(user.getId(), month, year)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public TransacaoResponseDto create(String email, TransacaoRequestDto req) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Transaction t = Transaction.builder()
            .description(req.getDescription())
            .amount(req.getAmount())
            .type(req.getType())
            .category(req.getCategory())
            .date(req.getDate())
            .user(user)
            .build();
        return toDto(transacaoRepository.save(t));
    }

    public void delete(String email, Long id) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Transaction t = transacaoRepository.findById(id).orElseThrow();
        usuarioAcessoService.validarDono(t.getUser().getId(), user.getId());
        transacaoRepository.delete(t);
    }

    public PainelResponseDto getDashboard(String email, int month, int year) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Long uid = user.getId();

        BigDecimal income = nvl(transacaoRepository.sumByUserAndTypeAndMonthAndYear(uid, Transaction.Type.INCOME, month, year));
        BigDecimal expenses = nvl(transacaoRepository.sumByUserAndTypeAndMonthAndYear(uid, Transaction.Type.EXPENSE, month, year));
        BigDecimal balance = income.subtract(expenses);

        List<ResumoCategoriaDto> categories = transacaoRepository.sumByCategory(uid, month, year)
            .stream().map(row -> {
                var cs = new ResumoCategoriaDto();
                cs.setCategory(row[0].toString());
                cs.setTotal((BigDecimal) row[1]);
                return cs;
            }).collect(Collectors.toList());

        List<TransacaoResponseDto> recent = transacaoRepository
            .findByUserIdAndMonthAndYearOrderByDateDesc(uid, month, year)
            .stream().limit(5).map(this::toDto).collect(Collectors.toList());

        var dash = new PainelResponseDto();
        dash.setIncome(income);
        dash.setExpenses(expenses);
        dash.setSavings(balance.compareTo(BigDecimal.ZERO) > 0 ? balance : BigDecimal.ZERO);
        dash.setBalance(balance);
        dash.setCategorySummaries(categories);
        dash.setRecentTransactions(recent);
        return dash;
    }

    private TransacaoResponseDto toDto(Transaction t) {
        var r = new TransacaoResponseDto();
        r.setId(t.getId());
        r.setDescription(t.getDescription());
        r.setAmount(t.getAmount());
        r.setType(t.getType().name());
        r.setCategory(t.getCategory() != null ? t.getCategory().name() : null);
        r.setDate(t.getDate());
        r.setCreatedAt(t.getCreatedAt());
        return r;
    }

    private BigDecimal nvl(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }
}



