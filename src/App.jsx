import "./App.css";
import Header from "./components/header/index.jsx";
import FiltrosSelect from "./components/select-filtros/index.jsx";
import Tabela from "./components/tabela/index.jsx";
import FiltrosInput from "./components/input-filtros/index.jsx";
import iconeVoltar from "./assets/voltar.png";
import iconeCasa from "./assets/casinha.jpg";
import { useState, useEffect } from 'react';

function App() {
  // Função para obter datas de 1 mês de diferença
  const obterDatasUmMes = () => {
    const hoje = new Date();
    const umMesAtras = new Date(hoje);
    umMesAtras.setMonth(hoje.getMonth() - 1);
    
    return {
      dataInicio: umMesAtras.toISOString().split('T')[0],
      dataFim: hoje.toISOString().split('T')[0]
    };
  };

  const [filtros, setFiltros] = useState(obterDatasUmMes());
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Função para buscar dados reais na API
  const buscarDados = async () => {
    setCarregando(true);
    try {
      let response;
      let data;
      // Se o filtro de número do documento estiver preenchido, busca por documento
      if (filtros.numeroDocumento && filtros.numeroDocumento.trim() !== '') {
        const body = {
          documentoCodigo: Number(filtros.numeroDocumento)
        };
        response = await fetch('http://localhost:62073/api/controladoria/ConsultarFaturamentoPorCodigoDocumento', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer OTQ1MDA2NDUxNDI2'
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          throw new Error('Erro ao consultar por número do documento');
        }
        data = await response.json();
        // Se a API retorna um único objeto, transforma em array
        if (data && !Array.isArray(data)) {
          data = [data];
        }
      } else {
        // Busca por período
        const body = {
          dataInicio: filtros.dataInicio ? new Date(filtros.dataInicio).toISOString() : null,
          dataFim: filtros.dataFim ? new Date(filtros.dataFim).toISOString() : null
        };
        response = await fetch('http://localhost:62073/api/controladoria/ConsultarFaturamentoPorPeriodo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer OTQ1MDA2NDUxNDI2'
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          throw new Error('Erro ao consultar por período');
        }
        data = await response.json();
      }
      // Adapta os campos do retorno para o formato esperado pela tabela
      const dadosAdaptados = Array.isArray(data) ? data.map(item => ({
        numeroDocumento: item.numeroDocumento ? String(item.numeroDocumento) : '-',
        tipoAbertoPorLinha: item.tipoAberto || '-',
        dataEmissaoDocumento: item.dataEmissao ? item.dataEmissao.split('T')[0] : '-',
        cliente: item.cliente || '-',
        galpao: item.galpao || '-',
        solicitante: item.usuarioSolicitante || '-',
        fatura: item.nroFatura ? String(item.nroFatura) : '-',
        notaFiscal: item.notafiscal ? String(item.notafiscal) : '-',
        valorDocumento: typeof item.valorTotal === 'number'
          ? item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : '-',
        valorDocumentoNumero: typeof item.valorTotal === 'number'
          ? item.valorTotal
          : 0,
        valorDescontoAcrescimo: typeof item.valorDescontoAcrescimo === 'number'
          ? item.valorDescontoAcrescimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : '-',
        valorDescontoAcrescimoNumero: typeof item.valorDescontoAcrescimo === 'number'
          ? item.valorDescontoAcrescimo
          : 0,
        tipoFaturamento: item.tipoFaturamento || '-'
      })) : [];
      setDadosFiltrados(dadosAdaptados);
    } catch (error) {
      setDadosFiltrados([]);
      alert('Erro ao buscar dados: ' + error.message);
    }
    setCarregando(false);
  };

  // Carrega dados automaticamente ao montar o componente
  useEffect(() => {
    buscarDados();
  }, []);

  return (
    <div className="app-center">
      <Header />
      <div className="body-relatorio">
        <div className="opcoes">
          <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <img src={iconeVoltar} alt="Voltar" style={{width: '24px', height: '24px'}}/>
            <b>Controladoria</b>
          </div>
          <div className="page-navigate">
            
            <img src={iconeCasa} alt="Casa" style={{width: '12px'}}/>
            <p>Home</p>
            <p>&gt;</p>
            <p><b>Controladoria</b></p>
          </div>
        </div>
        <div className="filtros">
          <div style={{display: 'flex', gap: '1%'}}>
            <FiltrosInput 
              type="date" 
              title="Data Inicio:" 
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
            />
            <FiltrosInput 
              type="date" 
              title="Data Fim:" 
              value={filtros.dataFim}
              onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
            />
            <FiltrosInput 
              type="text" 
              title="Número do Documento" 
              placeholder="Número do documento"
              value={filtros.numeroDocumento || ''}
              onChange={(e) => setFiltros({...filtros, numeroDocumento: e.target.value})}
            />
          </div>
          <div style={{display: 'flex', gap: '1%', alignItems: 'center'}}>
            <span></span>
            <button 
              style={{ 
                backgroundColor: '#477ABE', 
                width: '120px', 
                height: '35px', 
                borderRadius:'10px', 
                border: '1px solid #ccc', 
                color: 'white', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                opacity: carregando ? 0.6 : 1
              }}
              onClick={buscarDados}
              disabled={carregando}
            >
              {carregando ? '⏳ Buscando...' : 'Filtrar'}
            </button>
          </div>
        </div>
        <div className="tabela">
          <Tabela dados={dadosFiltrados} />
        </div>
      </div>
    </div>
  );
}

export default App;
