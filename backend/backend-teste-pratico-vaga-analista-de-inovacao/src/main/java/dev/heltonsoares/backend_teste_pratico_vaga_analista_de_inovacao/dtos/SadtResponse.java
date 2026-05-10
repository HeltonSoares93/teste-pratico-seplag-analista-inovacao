package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos;

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
