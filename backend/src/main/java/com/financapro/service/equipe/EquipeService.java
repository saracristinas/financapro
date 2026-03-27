package com.financapro.service.equipe;

import com.financapro.dto.equipe.ConviteRequestDto;
import com.financapro.dto.equipe.MembroEquipeResponseDto;
import com.financapro.model.autenticacao.User;
import com.financapro.model.equipe.TeamMember;
import com.financapro.repository.autenticacao.UsuarioRepository;
import com.financapro.repository.equipe.MembroEquipeRepository;
import com.financapro.service.compartilhado.UsuarioAcessoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipeService {

    private final MembroEquipeRepository membroEquipeRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioAcessoService usuarioAcessoService;

    public List<MembroEquipeResponseDto> getTeam(String email) {
        User owner = usuarioAcessoService.obterPorEmail(email);
        return membroEquipeRepository.findByOwnerIdAndStatusNot(owner.getId(), TeamMember.Status.REMOVED)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public MembroEquipeResponseDto invite(String email, ConviteRequestDto req) {
        User owner = usuarioAcessoService.obterPorEmail(email);
        User.Role role = User.Role.valueOf(req.getRole().toUpperCase());
        TeamMember tm = TeamMember.builder()
            .owner(owner).invitedEmail(req.getEmail()).role(role).build();
        usuarioRepository.findByEmail(req.getEmail()).ifPresent(tm::setMember);
        return toDto(membroEquipeRepository.save(tm));
    }

    public void remove(String email, Long memberId) {
        User owner = usuarioAcessoService.obterPorEmail(email);
        TeamMember tm = membroEquipeRepository.findById(memberId).orElseThrow();
        usuarioAcessoService.validarDono(tm.getOwner().getId(), owner.getId());
        tm.setStatus(TeamMember.Status.REMOVED);
        membroEquipeRepository.save(tm);
    }

    private MembroEquipeResponseDto toDto(TeamMember tm) {
        var r = new MembroEquipeResponseDto();
        r.setId(tm.getId());
        r.setRole(tm.getRole().name());
        r.setStatus(tm.getStatus().name());
        if (tm.getMember() != null) {
            r.setName(tm.getMember().getName());
            r.setEmail(tm.getMember().getEmail());
            r.setAvatarColor(tm.getMember().getAvatarColor());
        } else {
            r.setEmail(tm.getInvitedEmail());
            r.setName(tm.getInvitedEmail());
        }
        return r;
    }
}





