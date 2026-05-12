package dev.heltonsoares.backend_app.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import dev.heltonsoares.backend_app.dtos.CkanUFSResponse;

@Component
public class RecifeUSFApiClient {

  private final RestClient restClient;
  private static final String RESOURCE_USF_ID = "64cc8ab3-bd69-4629-b145-74552fe31e1c";
  private static final int LIMIT = 1000;

  // configuraÃ§Ã£o da URL base
  public RecifeUSFApiClient() {
    this.restClient = RestClient.create("https://dados.recife.pe.gov.br");
  }

  // Busca o JSON bruto com limit e offset
  public CkanUFSResponse buscarDadosBrutos(int limit, int offset) {
    return restClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/api/action/datastore_search")
            .queryParam("resource_id", RESOURCE_USF_ID)
            .queryParam("limit", limit)
            .queryParam("offset", offset)
            .build())
        .retrieve().body(CkanUFSResponse.class);
  }
}
