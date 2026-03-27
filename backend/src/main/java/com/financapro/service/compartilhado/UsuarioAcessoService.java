package com.financapro.service.compartilhado;

import com.financapro.model.autenticacao.User;
import com.financapro.repository.autenticacao.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioAcessoService {

    private final UsuarioRepository usuarioRepository;

    public User obterPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElseThrow();
    }

    public void validarDono(Long donoId, Long usuarioAtualId) {
        if (!donoId.equals(usuarioAtualId)) {
            throw new SecurityException("Forbidden");
        }
    }
}




