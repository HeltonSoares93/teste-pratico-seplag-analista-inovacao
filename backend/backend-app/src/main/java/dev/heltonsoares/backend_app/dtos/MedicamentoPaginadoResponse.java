package dev.heltonsoares.backend_app.dtos;

import java.util.List;

public record MedicamentoPaginadoResponse(
    List<MedicamentoResponse> dados,
    int total,
    int pagina,
    int itensPorPagina,
    int totalPaginas) {

}
