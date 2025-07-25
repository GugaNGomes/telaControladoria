import './index.css';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';

function RelatorioControladoria({ dados, evolucaoAnual }) {
    const {
        itensFaturados,
        itensNaoFaturados,
        valorFaturado,
        valorNaoFaturado,
        totalDocumentos,
        totalFaturados,
        totalNaoFaturados,
        percentualFaturado,
        percentualNaoFaturado
    } = dados;

    const valorTotal = valorFaturado + valorNaoFaturado;
    const percentualValorFaturado = valorTotal > 0 ? ((valorFaturado / valorTotal) * 100).toFixed(1) : 0;
    const percentualValorNaoFaturado = valorTotal > 0 ? ((valorNaoFaturado / valorTotal) * 100).toFixed(1) : 0;

    // Dados para o gráfico de pizza
    const dataPie = [
        { name: 'Faturados', value: totalFaturados },
        { name: 'Não Faturados', value: totalNaoFaturados }
    ];
    const COLORS = ['#0A2144', '#F5871F'];

    // Dados fictícios para os novos gráficos
    const dataBar = [
        { name: 'Faturado', value: valorFaturado },
        { name: 'Pendente', value: valorNaoFaturado }
    ];
    // Substituir o cálculo de dataLine para agrupar por competenciaComercial:
    // Recebe a prop evolucaoAnual já agrupada por competenciaComercial, então só usa:
    const dataLine = evolucaoAnual || [];
    // O eixo X do gráfico já é mes: dataLine[i].mes (que agora é competenciaComercial)
    const anoGrafico = dataLine.length > 0 ? dataLine[0].mes.split('/')[1] : new Date().getFullYear();

    return (
        <div className="relatorio-container relatorio-compacto">
            {/* Layout: cards à esquerda, gráfico à direita */}
            <div style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'stretch', justifyContent: 'center', marginTop: 8}}>
                {/* Cards em coluna */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 16, minWidth: 200, maxWidth: 240, flex: '0 0 220px'}}>
                    <div className="card-quadrado">
                        <div className="card-content">
                            <h3>Total de Documentos</h3>
                            <p className="card-valor">{totalDocumentos}</p>
                        </div>
                    </div>
                    <div className="card-quadrado">
                        <div className="card-content">
                            <h3>Valor Faturado</h3>
                            <p className="card-valor">R$ {valorFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>
                {/* Gráfico de evolução à direita */}
                <div className="grafico-evolucao" style={{background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, minWidth: 320, maxWidth: 700, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <h3 style={{textAlign: 'center', marginBottom: 6, color: '#222', fontSize: 14, fontWeight: 700}}>Evolução Faturado ({anoGrafico})</h3>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={dataLine} margin={{top: 4, right: 4, left: 4, bottom: 4}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" tick={{fontSize: 10}}/>
                            <YAxis tick={{fontSize: 10}}/>
                            <Tooltip formatter={v => `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}/>
                            <Legend />
                            <Line type="monotone" dataKey="valor" stroke="#477ABE" strokeWidth={2} dot={{r:3}}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default RelatorioControladoria; 