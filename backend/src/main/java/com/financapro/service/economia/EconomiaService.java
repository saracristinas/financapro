package com.financapro.service.economia;

import com.financapro.dto.economia.EconomiaRequestDto;
import com.financapro.dto.economia.EconomiaResponseDto;
import com.financapro.model.autenticacao.User;
import com.financapro.model.economia.Saving;
import com.financapro.repository.economia.EconomiaRepository;
import com.financapro.service.compartilhado.UsuarioAcessoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EconomiaService {

    private final EconomiaRepository economiaRepository;
    private final UsuarioAcessoService usuarioAcessoService;

    public List<EconomiaResponseDto> getAll(String email) {
        User user = usuarioAcessoService.obterPorEmail(email);
        return economiaRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public EconomiaResponseDto create(String email, EconomiaRequestDto req) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Saving s = Saving.builder()
            .name(req.getName()).goal(req.getGoal())
            .current(req.getCurrent() != null ? req.getCurrent() : BigDecimal.ZERO)
            .emoji(req.getEmoji()).color(req.getColor())
            .deadline(req.getDeadline()).user(user).build();
        return toDto(economiaRepository.save(s));
    }

    public EconomiaResponseDto update(String email, Long id, EconomiaRequestDto req) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Saving s = economiaRepository.findById(id).orElseThrow();
        usuarioAcessoService.validarDono(s.getUser().getId(), user.getId());
        s.setName(req.getName());
        s.setGoal(req.getGoal());
        s.setCurrent(req.getCurrent());
        s.setEmoji(req.getEmoji());
        s.setColor(req.getColor());
        s.setDeadline(req.getDeadline());
        return toDto(economiaRepository.save(s));
    }

    public void delete(String email, Long id) {
        User user = usuarioAcessoService.obterPorEmail(email);
        Saving s = economiaRepository.findById(id).orElseThrow();
        usuarioAcessoService.validarDono(s.getUser().getId(), user.getId());
        economiaRepository.delete(s);
    }

    private EconomiaResponseDto toDto(Saving s) {
        var r = new EconomiaResponseDto();
        r.setId(s.getId());
        r.setName(s.getName());
        r.setGoal(s.getGoal());
        r.setCurrent(s.getCurrent());
        r.setEmoji(s.getEmoji());
        r.setColor(s.getColor());
        r.setDeadline(s.getDeadline());

        double pct = s.getGoal().compareTo(BigDecimal.ZERO) == 0 ? 0
            : s.getCurrent().divide(s.getGoal(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue();
        r.setPercentage(Math.min(pct, 100));
        return r;
    }
}






