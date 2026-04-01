package com.financapro.service.compartilhado;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String emailRemetente;

    @Async
    public void enviarConviteEquipe(String emailDestinatario, String nomeConvidador, String linkAceitar) {
        // Validar se as credenciais estão configuradas
        if (emailRemetente == null || emailRemetente.isBlank()) {
            log.warn("Email não foi enviado para {} pois as credenciais de email não estão configuradas no servidor", emailDestinatario);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailRemetente);
            message.setTo(emailDestinatario);
            message.setSubject("🎉 Convite para FinançaPro - Equipe");
            message.setText(construirMensagemConvite(nomeConvidador, linkAceitar));

            mailSender.send(message);
            log.info("Email enviado com sucesso para: {}", emailDestinatario);
        } catch (Exception e) {
            log.error("Erro ao enviar email de convite para {}: {}", emailDestinatario, e.getMessage());
        }
    }

    private String construirMensagemConvite(String nomeConvidador, String linkAceitar) {
        return "Olá!\n\n" +
                nomeConvidador + " te convidou para fazer parte de sua equipe no FinançaPro!\n\n" +
                "FinançaPro é uma plataforma completa de gerenciamento financeiro pessoal e em equipe.\n\n" +
                "Clique no link abaixo para aceitar o convite:\n" +
                linkAceitar + "\n\n" +
                "Se você não esperava esse convite, pode ignorar este email.\n\n" +
                "---\n" +
                "FinançaPro Team\n" +
                "https://financapro-1.onrender.com";
    }
}

