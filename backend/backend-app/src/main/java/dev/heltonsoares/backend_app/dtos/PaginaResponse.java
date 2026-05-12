package dev.heltonsoares.backend_app.dtos;

import java.util.List;

public record PaginaResponse<T>(
    List<T> dados,
    long total,
    int pagina,
    int itensPorPagina,
    int totalPaginas) {
}
