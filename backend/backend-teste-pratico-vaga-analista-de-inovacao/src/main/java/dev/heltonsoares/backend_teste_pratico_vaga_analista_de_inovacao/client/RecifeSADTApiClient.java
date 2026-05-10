package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.CkanSADTResponse;

@Component
public class RecifeSADTApiClient {

  private final RestClient restClient;
  private static final String RESOURCE_SADT_ID = "24d236e8-8a95-4b53-b267-550f6f03b148";
  private static final int LIMIT = 1000;

  // configuração da URL base
  public RecifeSADTApiClient() {
    this.restClient = RestClient.create("https://dados.recife.pe.gov.br");
  }

  // Busca o JSON bruto com limit e offset
  public CkanSADTResponse buscarDadosBrutos(int limit, int offset) {
    return restClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/api/action/datastore_search")
            .queryParam("resource_id", RESOURCE_SADT_ID)
            .queryParam("limit", limit)
            .queryParam("offset", offset)
            .build())
        .retrieve().body(CkanSADTResponse.class);
  }
}
