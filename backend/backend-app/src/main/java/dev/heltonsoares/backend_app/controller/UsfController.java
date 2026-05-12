package dev.heltonsoares.backend_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.heltonsoares.backend_app.dtos.PaginaResponse;
import dev.heltonsoares.backend_app.dtos.UsfResponse;
import dev.heltonsoares.backend_app.service.UsfService;
import java.util.List;

@RestController
@RequestMapping("/usf")
@CrossOrigin(origins = "*")
public class UsfController {

  @Autowired
  private UsfService usfService;

  @GetMapping
  public ResponseEntity<PaginaResponse<UsfResponse>> listarUnidadesDaSaudeDaFamilia(
      @RequestParam(required = false) String nomeOficial,
      @RequestParam(required = false) String endereco,
      @RequestParam(required = false) String especialidade,
      @RequestParam(required = false) String bairro,
      @RequestParam(required = false) String horario,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    PaginaResponse<UsfResponse> dados = usfService.listarUSFs(nomeOficial, endereco, especialidade, bairro, horario, page, size);

    return ResponseEntity.ok(dados);
  }

  @GetMapping("/horarios")
  public ResponseEntity<List<String>> listarHorarios() {
      return ResponseEntity.ok(usfService.listarHorariosDisponiveis());
  }

}
