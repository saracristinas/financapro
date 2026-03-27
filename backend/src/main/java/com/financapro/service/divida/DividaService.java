package com.financapro.service.divida;

import com.financapro.dto.divida.DividaRequestDto;
import com.financapro.dto.divida.DividaResponseDto;
import com.financapro.model.autenticacao.User;
import com.financapro.model.divida.Debt;
import com.financapro.repository.divida.DividaRepository;
import com.financapro.service.compartilhado.UsuarioAcessoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DividaService {

    private final DividaRepository dividaRepository;
    private final UsuarioAcessoService usuarioAcessoService;

    public List<DividaResponseDto> getAll(String email) {
        User user = usuarioAcessoService.obterPorEmail(email);
        return dividaRepository.findByUserIdOrderByDueDateAsc(user.getId())
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public DividaResponseDto create(String email, DividaRequestDto req) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Debt d = Debt.builder()
            .creditor(req.getCreditor()).description(req.getDescription())
            .amount(req.getAmount())
            .paidAmount(req.getPaidAmount() != null ? req.getPaidAmount() : BigDecimal.ZERO)
            .dueDate(req.getDueDate())
            .status(req.getStatus() != null ? Debt.Status.valueOf(req.getStatus()) : Debt.Status.PENDING)
            .user(user).build();
        return toDto(dividaRepository.save(d));
    }

    public DividaResponseDto update(String email, Long id, DividaRequestDto req) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Debt d = dividaRepository.findById(id).orElseThrow();
        usuarioAcessoService.validarDono(d.getUser().getId(), user.getId());
        d.setCreditor(req.getCreditor());
        d.setDescription(req.getDescription());
        d.setAmount(req.getAmount());
        d.setPaidAmount(req.getPaidAmount());
        d.setDueDate(req.getDueDate());
        if (req.getStatus() != null) d.setStatus(Debt.Status.valueOf(req.getStatus()));
        return toDto(dividaRepository.save(d));
    }

    public void delete(String email, Long id) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Debt d = dividaRepository.findById(id).orElseThrow();
        usuarioAcessoService.validarDono(d.getUser().getId(), user.getId());
        dividaRepository.delete(d);
    }

    private DividaResponseDto toDto(Debt d) {
        var r = new DividaResponseDto();
        r.setId(d.getId());
        r.setCreditor(d.getCreditor());
        r.setDescription(d.getDescription());
        r.setAmount(d.getAmount());
        r.setPaidAmount(d.getPaidAmount());
        r.setDueDate(d.getDueDate());
        r.setStatus(d.getStatus().name());
        return r;
    }
}






