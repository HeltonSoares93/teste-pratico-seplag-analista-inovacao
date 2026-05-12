package dev.heltonsoares.backend_app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import dev.heltonsoares.backend_app.client.RecifeUDPApiClient;
import dev.heltonsoares.backend_app.dtos.CkanUDPResponse;
import dev.heltonsoares.backend_app.dtos.PaginaResponse;
import dev.heltonsoares.backend_app.dtos.UdpResponse;

@Service
public class UdpService {

  private final RecifeUDPApiClient apiClient;
  private final List<UdpResponse> cache = new ArrayList<>();

  public UdpService(RecifeUDPApiClient apiClient) {
    this.apiClient = apiClient;
  }

  @PostConstruct
  public void inicializarCache() {
    int limit = 1000;
    int offset = 0;
    boolean temMais = true;

    System.out.println("Iniciando cache de UDPs...");
    while (temMais) {
      try {
        CkanUDPResponse response = apiClient.buscarDadosBrutos(limit, offset);
        if (response != null && response.success() && response.result() != null && response.result().records() != null) {
          List<UdpResponse> lote = response.result().records().stream()
              .map(ckan -> new UdpResponse(
                  ckan.nomeOficial(),
                  ckan.servico(),
                  ckan.horario(),
                  ckan.distrito(),
                  ckan.bairro(),
                  ckan.endereco(),
                  ckan.fone()))
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
        System.err.println("Erro ao buscar lote do CKAN UDP (offset " + offset + "): " + e.getMessage());
        temMais = false;
      }
    }
    System.out.println("Cache de UDPs finalizado. Total de registros: " + cache.size());
  }

  public PaginaResponse<UdpResponse> listarUDPs(String bairro, String endereco, String nomeOficial, int page, int size) {
    List<UdpResponse> filtrados = cache.stream()
        .filter(ckan -> {
          if (bairro == null || bairro.isBlank()) return true;
          if (ckan.bairro() == null) return false;
          return ckan.bairro().toLowerCase().contains(bairro.toLowerCase());
        })
        .filter(ckan -> {
          if (endereco == null || endereco.isBlank()) return true;
          if (ckan.endereco() == null) return false;
          return ckan.endereco().toLowerCase().contains(endereco.toLowerCase());
        })
        .filter(ckan -> {
          if (nomeOficial == null || nomeOficial.isBlank()) return true;
          if (ckan.nomeOficial() == null) return false;
          return ckan.nomeOficial().toLowerCase().contains(nomeOficial.toLowerCase());
        })
        .collect(Collectors.toList());

    long total = filtrados.size();
    int totalPaginas = size > 0 ? (int) Math.ceil((double) total / size) : 1;

    List<UdpResponse> paginados = filtrados;
    if (size > 0 && page >= 0) {
      paginados = filtrados.stream()
          .skip((long) page * size)
          .limit(size)
          .collect(Collectors.toList());
    }

    return new PaginaResponse<>(paginados, total, page, size, totalPaginas);
  }
}
