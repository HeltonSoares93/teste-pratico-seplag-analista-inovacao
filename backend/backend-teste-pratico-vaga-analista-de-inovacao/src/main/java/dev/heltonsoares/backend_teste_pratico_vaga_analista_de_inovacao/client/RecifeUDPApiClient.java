// Unidades de distribuição de preservativos

package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.CkanUDPResponse;

@Component
public class RecifeUDPApiClient {

  private final RestClient restClient;
  private static final String RESOURCE_UDP_ID = "c901459f-f6c7-44dc-bdd5-dd4081e58e69";
  private static final int LIMIT = 1000;

  // configuração da URL base
  public RecifeUDPApiClient() {
    this.restClient = RestClient.create("https://dados.recife.pe.gov.br");
  }

  // Busca o JSON bruto com limit e offset
  public CkanUDPResponse buscarDadosBrutos(int limit, int offset) {
    return restClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/api/action/datastore_search")
            .queryParam("resource_id", RESOURCE_UDP_ID)
            .queryParam("limit", limit)
            .queryParam("offset", offset)
            .build())
        .retrieve().body(CkanUDPResponse.class);
  }
}
