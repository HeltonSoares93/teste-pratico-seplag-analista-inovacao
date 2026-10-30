package dev.heltonsoares.backend_app.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.heltonsoares.backend_app.service.EducacaoInfantilEjaService;
import dev.heltonsoares.backend_app.service.MedicamentoService;
import dev.heltonsoares.backend_app.service.SadtService;
import dev.heltonsoares.backend_app.service.UdpService;
import dev.heltonsoares.backend_app.service.UsfService;

@RestController
@RequestMapping("/debug")
@CrossOrigin(origins = "*")
public class DebugController {

  @Autowired
  private MedicamentoService medicamentoService;

  @Autowired
  private UsfService usfService;

  @Autowired
  private SadtService sadtService;

  @Autowired
  private UdpService udpService;

  @Autowired
  private EducacaoInfantilEjaService educacaoInfantilEjaService;

  @GetMapping("/cache")
  public Map<String, Integer> cache() {
    Map<String, Integer> resposta = new LinkedHashMap<>();
    resposta.put("medicamentos", medicamentoService.tamanhoCache());
    resposta.put("usf", usfService.tamanhoCache());
    resposta.put("sadt", sadtService.tamanhoCache());
    resposta.put("udp", udpService.tamanhoCache());
    resposta.put("educacao_infantil_eja", educacaoInfantilEjaService.tamanhoCache());
    return resposta;
  }
}
