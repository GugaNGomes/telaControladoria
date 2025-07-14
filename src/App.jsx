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

  // Função para gerar dados fictícios
  const gerarDadosFicticios = (quantidade) => {
    const dados = [];
    const clientes = [
      "Empresa ABC Ltda", "Comércio Beta Ltda", "Distribuidora Delta", "Indústria Zeta S.A.",
      "Comércio Theta Ltda", "Indústria Kappa S.A.", "Distribuidora Mu Ltda", "Comércio Xi Ltda",
      "Indústria Pi S.A.", "Distribuidora Sigma Ltda", "Comércio Upsilon Ltda", "Indústria Chi S.A.",
      "Logística Omega Ltda", "Transportes Alpha S.A.", "Frete Beta Ltda", "Cargas Gamma S.A.",
      "Express Delta Ltda", "Rápido Epsilon S.A.", "Veloz Zeta Ltda", "Ágil Eta S.A."
    ];
    
    const galpoes = [
      "Galpão Central", "Galpão Norte", "Galpão Sul", "Galpão Leste", "Galpão Oeste",
      "Galpão Principal", "Galpão Secundário", "Galpão de Distribuição", "Galpão de Armazenagem",
      "Galpão Logístico", "Galpão Comercial", "Galpão Industrial", "Galpão Regional"
    ];
    
    const solicitantes = [
      "João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira", "Carlos Ferreira",
      "Lucia Mendes", "Roberto Alves", "Fernanda Lima", "Marcelo Santos", "Patricia Costa",
      "Ricardo Silva", "Camila Rodrigues", "André Pereira", "Juliana Almeida", "Rafael Souza",
      "Carolina Martins", "Diego Oliveira", "Vanessa Costa", "Thiago Santos", "Amanda Lima"
    ];

    const tiposAberto = ["Venda", "Compra", "Transferência", "Devolução", "Ajuste"];
    const tiposFaturamento = ["À Vista", "30 dias", "60 dias", "90 dias", "Boleto", "Cartão"];

    // Obter ano e mês atual
    const hoje = new Date();
    const anoAtual = 2025; // Forçando para 2025
    const mesAtual = hoje.getMonth(); // 0-11
    const diaAtual = hoje.getDate();

    for (let i = 1; i <= quantidade; i++) {
      const clienteIndex = Math.floor(Math.random() * clientes.length);
      const galpaoIndex = Math.floor(Math.random() * galpoes.length);
      const solicitanteIndex = Math.floor(Math.random() * solicitantes.length);
      const tipoAbertoIndex = Math.floor(Math.random() * tiposAberto.length);
      const tipoFaturamentoIndex = Math.floor(Math.random() * tiposFaturamento.length);
      
      const valor = (Math.random() * 50000 + 1000).toFixed(2);
      const descontoAcrescimo = (Math.random() * 1000 - 500).toFixed(2);
      
      // Gerar datas variadas: 60% do mês atual, 30% do mês anterior, 10% de outros meses
      let data;
      const random = Math.random();
      
      if (random < 0.6) {
        // 60% dos dados do mês atual
        const dia = Math.floor(Math.random() * diaAtual) + 1; // 1 até dia atual
        data = new Date(anoAtual, mesAtual, dia);
      } else if (random < 0.9) {
        // 30% dos dados do mês anterior
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        const diasNoMes = new Date(anoMesAnterior, mesAnterior + 1, 0).getDate();
        const dia = Math.floor(Math.random() * diasNoMes) + 1;
        data = new Date(anoMesAnterior, mesAnterior, dia);
      } else {
        // 10% dos dados de outros meses do ano atual
        const mes = Math.floor(Math.random() * 12);
        const diasNoMes = new Date(anoAtual, mes + 1, 0).getDate();
        const dia = Math.floor(Math.random() * diasNoMes) + 1;
        data = new Date(anoAtual, mes, dia);
      }
      
      const dataFormatada = data.toISOString().split('T')[0];
      
      dados.push({
        numeroDocumento: `DOC-${anoAtual}-${i.toString().padStart(3, '0')}`,
        tipoAbertoPorLinha: tiposAberto[tipoAbertoIndex],
        dataEmissaoDocumento: dataFormatada,
        cliente: clientes[clienteIndex],
        galpao: galpoes[galpaoIndex],
        solicitante: solicitantes[solicitanteIndex],
        fatura: Math.random() > 0.3 ? `FAT-${anoAtual}-${i.toString().padStart(3, '0')}` : '', // 30% sem fatura
        notaFiscal: `NF-${anoAtual}-${i.toString().padStart(3, '0')}`,
        valorDocumento: `R$ ${valor}`,
        valorDescontoAcrescimo: descontoAcrescimo > 0 ? `+R$ ${descontoAcrescimo}` : `-R$ ${Math.abs(descontoAcrescimo)}`,
        tipoFaturamento: tiposFaturamento[tipoFaturamentoIndex]
      });
    }
    
    return dados;
  };

  // Array com 100 dados fictícios
  const dadosTabela = gerarDadosFicticios(100);

  // Função para filtrar dados por período e número do documento
  const filtrarDados = (dados, dataInicio, dataFim, numeroDocumento) => {
    let dadosFiltrados = dados;
    
    // Filtro por período
    if (dataInicio && dataFim) {
      dadosFiltrados = dadosFiltrados.filter(item => {
        const dataItem = new Date(item.dataEmissaoDocumento);
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        
        return dataItem >= inicio && dataItem <= fim;
      });
    }
    
    // Filtro por número do documento
    if (numeroDocumento && numeroDocumento.trim() !== '') {
      dadosFiltrados = dadosFiltrados.filter(item => {
        return item.numeroDocumento.toLowerCase().includes(numeroDocumento.toLowerCase());
      });
    }
    
    return dadosFiltrados;
  };

  // Função para buscar dados
  const buscarDados = () => {
    setCarregando(true);
    
    // Simula carregamento
    setTimeout(() => {
      const dadosFiltrados = filtrarDados(
        dadosTabela, 
        filtros.dataInicio, 
        filtros.dataFim,
        filtros.numeroDocumento
      );
      
      setDadosFiltrados(dadosFiltrados);
      setCarregando(false);
      console.log('Dados filtrados:', dadosFiltrados.length, 'registros');
    }, 500);
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
              {carregando ? '⏳ Buscando...' : '🔍 Filtrar'}
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
