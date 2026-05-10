import { useEffect, useState } from "react"
import axios from "axios";
import MenuNav from "./componentes/MenuNav";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Sobre from "./componentes/Sobre";
import Medicamentos from "./componentes/Medicamentos";
import UnidadesDistribuicaoPreservativos from "./componentes/UnidadesDistribuicaoPreservativos";
import UnidadesSaudeDaFamilia from "./componentes/UnidadesSaudeDaFamilia";
import Painel from "./componentes/Painel";
import ServicosApoioDiagnosticoTerapeutico from "./componentes/ServicosApoioDiagnosticoTerapeutico";
import EducacaoInfantilEja from "./componentes/EducacaoInfantilEja";


export default function App() {

  return (

    <Container>
      <MenuNav />

      <Routes>
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/unidadesdistribuicaopreservativos" element={<UnidadesDistribuicaoPreservativos />} />
        <Route path="/unidadessaudedafamilia" element={<UnidadesSaudeDaFamilia />} />
        <Route path="/servicosdeapoiodiagnosticoeterapeutico" element={<ServicosApoioDiagnosticoTerapeutico />} />
        <Route path="/educacaoinfantileja" element={<EducacaoInfantilEja />} />
        <Route path="/painel" element={<Painel />} />

      </Routes>

    </Container>


  )
}