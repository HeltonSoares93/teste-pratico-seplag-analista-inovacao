package dev.heltonsoares.backend_app.dtos;

public record EducacaoInfantilEjaResponse(
    String unidadeEnsino,
    String bairroEscola,
    String modalidadeEnsino,
    String sexo,
    String raca,
    Integer quantidade) {

}
