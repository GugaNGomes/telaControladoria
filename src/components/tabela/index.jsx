import './index.css';
import { useState } from 'react';
import PainelProdutos from '../painel-produtos';
import RelatorioControladoria from '../relatorio-controladoria';
import visualizar from '../../assets/visualizar.png';
import imgColuna from '../../assets/coluna.png';
import imgSinal from '../../assets/sinal.png';



export default function Tabela({ dados = [] }){
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [painelProdutosAberto, setPainelProdutosAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [visualizacaoAtiva, setVisualizacaoAtiva] = useState('grafico'); // 'tabela' ou 'grafico'
    
    // Calcula o total de páginas
    const totalPaginas = Math.ceil(dados.length / itensPorPagina);
    
    // Obtém os dados da página atual
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosPaginaAtual = dados.slice(inicio, fim);
    
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
                     <img src={imgColuna} style={{width: '11px', height: '12px'}} alt="Visualizar Colunas" /> Visualizar Colunas
                </button>
            </div>

            {/* Visualização da Tabela */}
            {visualizacaoAtiva === 'tabela' && (
                <>
                    <div className="tabela-container">
                        <table className="tabela-principal">
                            <thead className="tabela-header">
                                <tr>
                                    <th>Número do Documento</th>
                                    <th>Tipo Aberto por Linha</th>
                                    <th>Data de Emissão do Documento</th>
                                    <th>Cliente</th>
                                    <th>Galpão</th>
                                    <th>Solicitante</th>
                                    <th>Fatura</th>
                                    <th>Nota Fiscal</th>
                                    <th>Valor do Documento</th>
                                    <th>Valor de Desconto ou Acréscimo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadosPaginaAtual.map((item, index) => (
                                    <tr key={inicio + index}>
                                        <td>{item.numeroDocumento}</td>
                                        <td>{item.tipoAbertoPorLinha}</td>
                                        <td>{item.dataEmissaoDocumento}</td>
                                        <td>{item.cliente}</td>
                                        <td>{item.galpao}</td>
                                        <td>{item.solicitante}</td>
                                        <td>{item.fatura}</td>
                                        <td>{item.notaFiscal}</td>
                                        <td>{item.valorDocumento}</td>
                                        <td>{item.valorDescontoAcrescimo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Paginação - sempre mostra quando há dados */}
                    {dados.length > 0 && (
                        <div className="paginacao">
                            <div className="paginacao-esquerda">
                                <div className="seletor-linhas">
                                    <div className="paginacao-info">
                                        Mostrando {inicio + 1} a {Math.min(fim, dados.length)} de {dados.length} Itens
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
                                </div>
                            </div>
                            
                            <div className="paginacao-direita">
                                {totalPaginas > 1 && (
                                    <div className="paginacao-controles">
                                        <button 
                                            onClick={paginaAnterior} 
                                            disabled={paginaAtual === 1}
                                            className="btn-paginacao"
                                        >
                                            &lt;
                                        </button>
                                        
                                        {/* Números das páginas */}
                                        <div className="numeros-pagina">
                                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                                                <button
                                                    key={pagina}
                                                    onClick={() => irParaPagina(pagina)}
                                                    className={`btn-numero-pagina ${pagina === paginaAtual ? 'ativo' : ''}`}
                                                >
                                                    {pagina}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <button 
                                            onClick={proximaPagina} 
                                            disabled={paginaAtual === totalPaginas}
                                            className="btn-paginacao"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Visualização do Gráfico */}
            {visualizacaoAtiva === 'grafico' && (
                <div className="grafico-container">
                    <RelatorioControladoria dados={calcularDadosRelatorio()} />
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