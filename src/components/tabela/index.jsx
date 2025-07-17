import './index.css';
import { useState, useEffect } from 'react';
import PainelProdutos from '../painel-produtos';
import RelatorioControladoria from '../relatorio-controladoria';
import visualizar from '../../assets/visualizar.png';
import imgColuna from '../../assets/coluna.png';
import imgSinal from '../../assets/sinal.png';
import FiltrosInput from '../../components/input-filtros/index.jsx';

// Função para exportar dados filtrados
const exportarParaExcel = (dados, nomeArquivo = 'relatorio') => {
    try {
        // Remove as colunas que não devem ser exportadas e remove o símbolo 'R$' dos valores
        const dadosExport = dados.map(row => {
            const copia = { ...row };
            delete copia.valorDocumentoNumero;
            delete copia.valorDescontoAcrescimoNumero;
            // Remove 'R$' e espaços dos campos de valor
            for (const key in copia) {
                if (typeof copia[key] === 'string' && copia[key].includes('R$')) {
                    copia[key] = copia[key].replace(/R\$\s?/g, '').replace(/\u00A0/g, '').trim();
                }
            }
            return copia;
        });
        // Tenta usar xlsx se disponível
        if (typeof window !== 'undefined' && window.XLSX) {
            const XLSX = window.XLSX;
            const ws = XLSX.utils.json_to_sheet(dadosExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Relatório");
            XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
        } else {
            // Fallback para CSV
            const headers = Object.keys(dadosExport[0] || {});
            const csvContent = [
                '\uFEFF' + headers.join(','), // Adiciona BOM UTF-8
                ...dadosExport.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${nomeArquivo}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (error) {
        console.error('Erro ao exportar:', error);
        alert('Erro ao exportar arquivo. Tente novamente.');
    }
};


export default function Tabela({ dados = [], evolucaoAnual = [] }){
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [painelProdutosAberto, setPainelProdutosAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [visualizacaoAtiva, setVisualizacaoAtiva] = useState('grafico'); // 'tabela' ou 'grafico'
    
    // Sempre volta para a primeira página ao mudar os dados (filtragem)
    useEffect(() => {
        setPaginaAtual(1);
    }, [dados]);

    // Filtros funcionais nos headers (filtragem em tempo real)
    const [filtrosTabela, setFiltrosTabela] = useState({}); // filtros ativos
    // Remover toda a lógica de filtrosData, errosData e handleFiltroDataChange

    // Atualiza filtro e filtra em tempo real
    const handleFiltroChange = (coluna, valor) => {
        if (coluna === 'numeroDocumento' && valor) {
            setFiltrosTabela(prev => {
                const novo = { ...prev, [coluna]: valor };
                delete novo.dataEmissaoDocumento;
                return novo;
            });
        } else {
            setFiltrosTabela(prev => ({ ...prev, [coluna]: valor }));
        }
        setPaginaAtual(1);
    };

    // Aplica filtros ativos aos dados (agora com suporte a intervalo de datas)
    const aplicarFiltrosTabela = (dados) => {
        return dados.filter(item => {
            for (const coluna in filtrosTabela) {
                if (coluna === 'dataEmissaoDocumento' && filtrosTabela[coluna]) {
                    const valor = filtrosTabela[coluna].trim();
                    // Busca por intervalo: "YYYY-MM-DD a YYYY-MM-DD"
                    const intervaloMatch = valor.match(/^(\d{4}-\d{2}-\d{2})\s*a\s*(\d{4}-\d{2}-\d{2})$/);
                    if (intervaloMatch) {
                        const inicio = intervaloMatch[1];
                        const fim = intervaloMatch[2];
                        if (item.dataEmissaoDocumento < inicio || item.dataEmissaoDocumento > fim) {
                            return false;
                        }
                    } else {
                        // Busca por data exata (ou parcial)
                        if (!String(item.dataEmissaoDocumento || '').toLowerCase().includes(valor.toLowerCase())) {
                            return false;
                        }
                    }
                } else if (filtrosTabela[coluna] && coluna !== 'dataEmissaoDocumento') {
                    if (String(item[coluna] || '').toLowerCase().indexOf(filtrosTabela[coluna].toLowerCase()) === -1) {
                        return false;
                    }
                }
            }
            return true;
        });
    };

    // Dados filtrados e paginados
    const dadosFiltrados = aplicarFiltrosTabela(dados);
    const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosPaginaAtual = dadosFiltrados.slice(inicio, fim);
    
    // Função para ir para a próxima página
    const proximaPagina = () => {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual(paginaAtual + 1);
        }
    };
    
    // Função para ir para a página anterior
    const paginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };
    
    // Função para ir para uma página específica
    const irParaPagina = (pagina) => {
        setPaginaAtual(pagina);
    };

    // Função para alterar a quantidade de itens por página
    const alterarItensPorPagina = (novoValor) => {
        setItensPorPagina(novoValor);
        setPaginaAtual(1); // Volta para a primeira página
    };

    // Função para abrir o painel de produtos
    const abrirPainelProdutos = (item) => {
        setItemSelecionado(item);
        setPainelProdutosAberto(true);
    };

    // Função para fechar o painel de produtos
    const fecharPainelProdutos = () => {
        setPainelProdutosAberto(false);
        setItemSelecionado(null);
    };

    // Funções para análise de dados
    const calcularDadosRelatorio = () => {
        // Considera faturado se fatura existe e não é traço
        const itensFaturados = dados.filter(item => item.fatura && item.fatura !== '-');
        const itensNaoFaturados = dados.filter(item => !item.fatura || item.fatura === '-');
        
        // Dashboard: soma valorDocumentoNumero + valorDescontoAcrescimoNumero
        const valorFaturado = itensFaturados.reduce((total, item) => {
            return total + (item.valorDocumentoNumero || 0);
        }, 0);
        
        const valorNaoFaturado = itensNaoFaturados.reduce((total, item) => {
            return total + (item.valorDocumentoNumero || 0);
        }, 0);
        
        const totalDocumentos = dados.length;
        const totalFaturados = itensFaturados.length;
        const totalNaoFaturados = itensNaoFaturados.length;
        
        const percentualFaturado = totalDocumentos > 0 ? ((totalFaturados / totalDocumentos) * 100).toFixed(1) : '0.0';
        const percentualNaoFaturado = totalDocumentos > 0 ? ((totalNaoFaturados / totalDocumentos) * 100).toFixed(1) : '0.0';
        
        return {
            itensFaturados,
            itensNaoFaturados,
            valorFaturado,
            valorNaoFaturado,
            totalDocumentos,
            totalFaturados,
            totalNaoFaturados,
            percentualFaturado,
            percentualNaoFaturado
        };
    };

    // Paginação simples e robusta (restaurada)
    const renderPaginacaoSimples = () => {
        if (totalPaginas <= 1) return null;
        let paginas = [];
        if (totalPaginas <= 5) {
            for (let i = 1; i <= totalPaginas; i++) {
                paginas.push(i);
            }
        } else {
            if (paginaAtual <= 3) {
                paginas = [1, 2, 3, 4, 5];
            } else if (paginaAtual >= totalPaginas - 2) {
                paginas = [totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
            } else {
                paginas = [paginaAtual - 2, paginaAtual - 1, paginaAtual, paginaAtual + 1, paginaAtual + 2];
            }
        }
        return (
            <div className="paginacao-simples" style={{display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', whiteSpace: 'nowrap', padding: '8px 0'}}>
                <button
                    onClick={() => irParaPagina(1)}
                    disabled={paginaAtual === 1}
                    className="btn-paginacao"
                    aria-label="Primeira página"
                >&#171;</button>
                <button
                    onClick={paginaAnterior}
                    disabled={paginaAtual === 1}
                    className="btn-paginacao"
                    aria-label="Página anterior"
                >&lt;</button>
                {paginas.map((pagina) => (
                    <button
                        key={pagina}
                        onClick={() => irParaPagina(pagina)}
                        className={`btn-numero-pagina${pagina === paginaAtual ? ' ativo' : ''}`}
                        aria-label={`Página ${pagina}`}
                        disabled={pagina === paginaAtual}
                        style={{
                            borderRadius: '6px',
                            minWidth: '32px',
                            padding: '4px 8px',
                            borderRadius: '50px',
                            background: pagina === paginaAtual ? '#477ABE' : '#fff',
                            color: pagina === paginaAtual ? '#fff' : '#333',
                            fontWeight: pagina === paginaAtual ? 'bold' : 'normal',
                            cursor: pagina === paginaAtual ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {pagina}
                    </button>
                ))}
                <button
                    onClick={proximaPagina}
                    disabled={paginaAtual === totalPaginas}
                    className="btn-paginacao"
                    aria-label="Próxima página"
                >&gt;</button>
                <button
                    onClick={() => irParaPagina(totalPaginas)}
                    disabled={paginaAtual === totalPaginas}
                    className="btn-paginacao"
                    aria-label="Última página"
                >&#187;</button>
            </div>
        );
    };

    return(
        <div>
            {/* Botões de navegação */}
            <div className="botoes-navegacao">

                <button 
                    className={`btn-navegacao ${visualizacaoAtiva === 'grafico' ? 'ativo' : ''}`}
                    onClick={() => setVisualizacaoAtiva('grafico')}
                >
                    <img src={imgSinal} alt="Gráfico" style={{width: '12px', height: '12px'}}/> Gráfico
                </button>
                
                <button 
                    className={`btn-navegacao ${visualizacaoAtiva === 'tabela' ? 'ativo' : ''}`}
                    onClick={() => setVisualizacaoAtiva('tabela')}
                >
                     <img src={imgColuna} style={{width: '11px', height: '12px'}} alt="Visualizar Colunas" /> Colunas
                </button>
            </div>

            {/* Visualização da Tabela */}
            {visualizacaoAtiva === 'tabela' && (
                <>
                    <div className="tabela-container">
                        <table className="tabela-principal">
                            <thead className="tabela-header">
                                <tr>
                                    <th>
                                        Número do Documento
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '20px'}}
                                                value={filtrosTabela.numeroDocumento || ''}
                                                onChange={e => handleFiltroChange('numeroDocumento', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        Tipo Aberto por Linha
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '20px'}}
                                                value={filtrosTabela.tipoAbertoPorLinha || ''}
                                                onChange={e => handleFiltroChange('tipoAbertoPorLinha', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        Data de Emissão do Documento
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '20px'}}
                                                value={filtrosTabela.dataEmissaoDocumento || ''}
                                                onChange={e => handleFiltroChange('dataEmissaoDocumento', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        Cliente
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '22px'}}
                                                value={filtrosTabela.cliente || ''}
                                                onChange={e => handleFiltroChange('cliente', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        Galpão
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '20px'}}
                                                value={filtrosTabela.galpao || ''}
                                                onChange={e => handleFiltroChange('galpao', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        Solicitante
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '20px'}}
                                                value={filtrosTabela.solicitante || ''}
                                                onChange={e => handleFiltroChange('solicitante', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        Fatura
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '20px'}}
                                                value={filtrosTabela.fatura || ''}
                                                onChange={e => handleFiltroChange('fatura', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        Nota Fiscal
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '20px'}}
                                                value={filtrosTabela.notaFiscal || ''}
                                                onChange={e => handleFiltroChange('notaFiscal', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                    <th>Valor do Documento</th>
                                    <th>Valor de Desconto ou Acréscimo</th>
                                    <th>
                                        Tipo de Faturamento
                                        <div>
                                            <FiltrosInput
                                                type='text'
                                                style={{width:  '100%', height: '20px'}}
                                                value={filtrosTabela.tipoFaturamento || ''}
                                                onChange={e => handleFiltroChange('tipoFaturamento', e.target.value)}
                                            />
                                        </div>
                                    </th>
                                </tr>
                </thead>
                <tbody>
                                {dadosPaginaAtual.map((item, index) => (
                                    <tr key={inicio + index}>
                                        <td style={{color: '#477ABE', fontWeight: 'bold'}}>{item.numeroDocumento}</td>
                                        <td>{item.tipoAbertoPorLinha}</td>
                                        <td>{item.dataEmissaoDocumento}</td>
                                        <td>{item.cliente}</td>
                                        <td>{item.galpao}</td>
                                        <td>{item.solicitante}</td>
                                        <td>{item.fatura}</td>
                                        <td>{item.notaFiscal}</td>
                                        <td>{item.valorDocumento}</td>
                                        <td>{item.valorDescontoAcrescimo}</td>
                                        <td>{item.tipoFaturamento}</td>
                                    </tr>
                                ))}
                </tbody>
            </table>
                    </div>
                    
                    {/* Paginação - sempre mostra quando há dados */}
                    {dados.length > 0 && (
                        <div className="paginacao" style={{overflowX: 'auto', whiteSpace: 'nowrap', padding: '8px 0'}}>
                            <div className="paginacao-esquerda">
                                <div className="seletor-linhas">
                                    <div className="paginacao-info">
                                        Mostrando {inicio + 1} a {Math.min(fim, dadosFiltrados.length)} de {dadosFiltrados.length} Itens
                                    </div>
                                    <select 
                                        id="itensPorPagina"
                                        value={itensPorPagina}
                                        onChange={(e) => alterarItensPorPagina(Number(e.target.value))}
                                        className="select-itens"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    {/* Botão Exportar Excel */}
                                    <button
                                        onClick={() => exportarParaExcel(dadosFiltrados, 'relatorio_controladoria')}
                                        style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            marginLeft: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <span style={{display: 'flex', alignItems: 'center'}}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="3" width="20" height="18" rx="2" fill="#21A366"/>
                                    <rect x="5" y="6" width="14" height="12" rx="1" fill="#fff" opacity="0.9"/>
                                    <path d="M8 9L11 15" stroke="#21A366" strokeWidth="1.5"/>
                                    <path d="M11 9L8 15" stroke="#21A366" strokeWidth="1.5"/>
                                    <rect x="13" y="9" width="4" height="1.2" rx="0.3" fill="#21A366"/>
                                    <rect x="13" y="11" width="4" height="1.2" rx="0.3" fill="#21A366"/>
                                    <rect x="13" y="13" width="4" height="1.2" rx="0.3" fill="#21A366"/>
                                  </svg>
                                </span>
                                Exportar Excel
                            </button>
                                </div>
                            </div>
                            {/* PAGINAÇÃO SIMPLES RESTAURADA */}
                            {totalPaginas > 1 && (
                                <div className="paginacao-direita" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    {renderPaginacaoSimples()}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Visualização do Gráfico */}
            {visualizacaoAtiva === 'grafico' && (
                <div className="grafico-container">
                    <RelatorioControladoria dados={calcularDadosRelatorio()} evolucaoAnual={evolucaoAnual} />
                </div>
            )}

            {/* Componente do painel de produtos */}
            <PainelProdutos 
                item={itemSelecionado}
                isOpen={painelProdutosAberto}
                onClose={fecharPainelProdutos}
            />
        </div>
    )
}