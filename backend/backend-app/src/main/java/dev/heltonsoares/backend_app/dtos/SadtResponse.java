package dev.heltonsoares.backend_app.dtos;

public record SadtResponse(
        String nomeOficial,
        Integer rpa,
        Integer distritoSanitario,
        Integer microregiao,
        String tipoServico,
        String endereco,
        String bairro,
        String fone,
        String servico,
        String especialidade,
        String comoUsar,
        String horario) {

}
