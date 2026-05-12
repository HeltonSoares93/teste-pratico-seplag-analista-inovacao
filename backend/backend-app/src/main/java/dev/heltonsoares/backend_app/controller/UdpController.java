package dev.heltonsoares.backend_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.heltonsoares.backend_app.dtos.PaginaResponse;
import dev.heltonsoares.backend_app.dtos.UdpResponse;
import dev.heltonsoares.backend_app.service.UdpService;

@RestController
@RequestMapping("/udp")
@CrossOrigin(origins = "*")
public class UdpController {

  @Autowired
  private UdpService udpService;

  @GetMapping
  public ResponseEntity<PaginaResponse<UdpResponse>> listarUnidadesDaSaudeDaFamilia(
      @RequestParam(required = false) String nomeOficial,
      @RequestParam(required = false) String bairro,
      @RequestParam(required = false) String endereco,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {

    PaginaResponse<UdpResponse> dados = udpService.listarUDPs(bairro, endereco, nomeOficial, page, size);

    return ResponseEntity.ok(dados);
  }

}
