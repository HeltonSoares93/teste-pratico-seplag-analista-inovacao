package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CkanUSF(
        String cnes,
        @JsonProperty("nome_oficial") String nomeOficial,
        String servico,
        String especialidade,
        @JsonProperty("como_usar") String comoUsar,
        String horario,
        String distrito,
        Integer rpa,
        String bairro,
        @JsonProperty("endereço") String endereco,
        String fone,
        @JsonProperty("micro_regiao") String microRegiao,
        String latitude,
        String longitude) {

}
