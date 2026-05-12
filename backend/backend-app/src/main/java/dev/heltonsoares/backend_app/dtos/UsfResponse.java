package dev.heltonsoares.backend_app.dtos;

public record UsfResponse(
    String cnes,
    String nomeOficial,
    String servico,
    String especialidade,
    String comoUsar,
    String horario,
    String distrito,
    Integer rpa,
    String bairro,
    String endereco,
    String fone,
    String microRegiao,
    String latitude,
    String longitude) {

}
