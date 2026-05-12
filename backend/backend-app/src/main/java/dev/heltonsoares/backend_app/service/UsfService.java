package dev.heltonsoares.backend_app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import dev.heltonsoares.backend_app.client.RecifeUSFApiClient;
import dev.heltonsoares.backend_app.dtos.CkanUFSResponse;
import dev.heltonsoares.backend_app.dtos.PaginaResponse;
import dev.heltonsoares.backend_app.dtos.UsfResponse;

@Service
public class UsfService {

  private final RecifeUSFApiClient apiClient;
  private final List<UsfResponse> cache = new ArrayList<>();

  public UsfService(RecifeUSFApiClient apiClient) {
    this.apiClient = apiClient;
  }

  @PostConstruct
  public void inicializarCache() {
    int limit = 1000;
    int offset = 0;
    boolean temMais = true;

    System.out.println("Iniciando cache de USFs...");
    while (temMais) {
      try {
        CkanUFSResponse response = apiClient.buscarDadosBrutos(limit, offset);
        if (response != null && response.success() && response.result() != null && response.result().records() != null) {
          List<UsfResponse> lote = response.result().records().stream()
              .map(ckan -> new UsfResponse(
                  ckan.cnes(),
                  ckan.nomeOficial(),
                  ckan.servico(),
                  ckan.especialidade(),
                  ckan.comoUsar(),
                  ckan.horario(),
                  ckan.distrito(),
                  ckan.rpa(),
                  ckan.bairro(),
                  ckan.endereco(),
                  ckan.fone(),
                  ckan.microRegiao(),
                  ckan.latitude(),
                  ckan.longitude()))
              .toList();

          cache.addAll(lote);
          offset += lote.size();

          if (lote.isEmpty()) {
            temMais = false; // Fim dos registros
          }
        } else {
          temMais = false;
        }
      } catch (Exception e) {
        System.err.println("Erro ao buscar lote do CKAN USF (offset " + offset + "): " + e.getMessage());
        temMais = false;
      }
    }
    System.out.println("Cache de USFs finalizado. Total de registros: " + cache.size());
  }

  public PaginaResponse<UsfResponse> listarUSFs(
      String nomeOficial,
      String endereco,
      String especialidade,
      String bairro,
      String horario,
      int page, int size) {

    List<UsfResponse> filtrados = cache.stream()
        .filter(u -> {
          if (bairro == null || bairro.isBlank()) return true;
          if (u.bairro() == null) return false;
          return u.bairro().toLowerCase().contains(bairro.toLowerCase());
        })
        .filter(u -> {
          if (endereco == null || endereco.isBlank()) return true;
          if (u.endereco() == null) return false;
          return u.endereco().toLowerCase().contains(endereco.toLowerCase());
        })
        .filter(u -> {
          if (nomeOficial == null || nomeOficial.isBlank()) return true;
          if (u.nomeOficial() == null) return false;
          return u.nomeOficial().toLowerCase().contains(nomeOficial.toLowerCase());
        })
        .filter(u -> {
          if (especialidade == null || especialidade.isBlank()) return true;
          if (u.especialidade() == null) return false;
          return u.especialidade().toLowerCase().contains(especialidade.toLowerCase());
        })
        .filter(u -> {
          if (horario == null || horario.isBlank()) return true;
          if (u.horario() == null) return false;
          return u.horario().toLowerCase().contains(horario.toLowerCase());
        })
        .collect(Collectors.toList());

    long total = filtrados.size();
    int totalPaginas = size > 0 ? (int) Math.ceil((double) total / size) : 1;

    List<UsfResponse> paginados = filtrados;
    if (size > 0 && page >= 0) {
      paginados = filtrados.stream()
          .skip((long) page * size)
          .limit(size)
          .collect(Collectors.toList());
    }

    return new PaginaResponse<>(paginados, total, page, size, totalPaginas);
  }
}
