package com.financapro.service.autenticacao;

import com.financapro.dto.autenticacao.AutenticacaoResponseDto;
import com.financapro.dto.autenticacao.CadastroRequestDto;
import com.financapro.dto.autenticacao.LoginRequestDto;
import com.financapro.dto.autenticacao.RecuperarSenhaRequestDto;
import com.financapro.dto.autenticacao.RedefinirSenhaRequestDto;
import com.financapro.model.autenticacao.User;
import com.financapro.repository.autenticacao.UsuarioRepository;
import com.financapro.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AutenticacaoResponseDto register(CadastroRequestDto req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .securityQuestion(req.getSecurityQuestion())
            .securityAnswer(req.getSecurityAnswer())
            .role(User.Role.ADMIN)
            .build();
        usuarioRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        var res = new AutenticacaoResponseDto();
        res.setToken(token);
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole());
        return res;
    }

    public AutenticacaoResponseDto login(LoginRequestDto req) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User user = usuarioRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail());
        var res = new AutenticacaoResponseDto();
        res.setToken(token);
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole());
        return res;
    }

    public String getSecurityQuestion(String email) {
        User user = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        return user.getSecurityQuestion();
    }

    public void resetPassword(RedefinirSenhaRequestDto req) {
        User user = usuarioRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (!user.getSecurityAnswer().equalsIgnoreCase(req.getSecurityAnswer())) {
            throw new IllegalArgumentException("Resposta de segurança incorreta");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        usuarioRepository.save(user);
    }
}
