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
    // O gráfico de evolução usa sempre evolucaoAnual
    const dataLine = evolucaoAnual || [];
    const anoGrafico = dataLine.length > 0 ? dataLine[0].mes.split('/')[1] : new Date().getFullYear();

    return (
        <div className="relatorio-container relatorio-compacto">
            {/* Gráficos lado a lado */}
            <div className="graficos-linha" style={{display: 'flex', flexWrap: 'nowrap', gap: 16, marginTop: 8, justifyContent: 'center', alignItems: 'stretch'}}>
                <div className="grafico-principal compacto" style={{background: 'none', boxShadow: 'none', padding: 0, minWidth: 320, maxWidth: 400, flex: 1}}>
                    <div className="grafico-item compacto" style={{background: 'none', boxShadow: 'none', padding: 0, borderRadius: 0}}>
                        <h3 style={{textAlign: 'center', marginBottom: 6, color: '#222', fontSize: 14, fontWeight: 600, letterSpacing: 0}}>
                            Distribuição por Status
                        </h3>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={dataPie}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={38}
                                    outerRadius={60}
                                    paddingAngle={2}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    isAnimationActive={true}
                                    stroke="none"
                                >
                                    {dataPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Valor total no centro do donut */}
                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none'}}>
                            <div style={{fontSize: 16, fontWeight: 700, color: '#222', lineHeight: 1}}>{totalDocumentos}</div>
                            <div style={{fontSize: 11, color: '#888'}}>Total</div>
                        </div>
                        {/* Legenda clean */}
                        <div style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 6, justifyContent: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                                <span style={{width: 10, height: 10, borderRadius: '50%', background: '#0A2144', display: 'inline-block'}}></span>
                                <span style={{fontSize: 11, color: '#222'}}>Faturados</span>
                                <span style={{fontWeight: 500, color: '#222', fontSize: 10}}>{percentualFaturado}%</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                                <span style={{width: 10, height: 10, borderRadius: '50%', background: '#F5871F', display: 'inline-block'}}></span>
                                <span style={{fontSize: 11, color: '#222'}}>Não Faturados</span>
                                <span style={{fontWeight: 500, color: '#222', fontSize: 10}}>{percentualNaoFaturado}%</span>
                            </div>
                        </div>
                    </div>
                </div>
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
            {/* Cards em grid quadrado 2x3 */}
            <div className="cards-quadrados">
                <div className="card-quadrado">
                    <div className="card-content">
                        <h3>Total de Documentos</h3>
                        <p className="card-valor">{totalDocumentos}</p>
                    </div>
                </div>
                <div className="card-quadrado">
                    <div className="card-content">
                        <h3>Documentos Faturados</h3>
                        <p className="card-valor">{totalFaturados}</p>
                        <p className="card-percentual">{percentualFaturado}%</p>
                    </div>
                </div>
                <div className="card-quadrado">
                    <div className="card-content">
                        <h3>Documentos Não Faturados</h3>
                        <p className="card-valor">{totalNaoFaturados}</p>
                        <p className="card-percentual">{percentualNaoFaturado}%</p>
                    </div>
                </div>
                <div className="card-quadrado">
                    <div className="card-content">
                        <h3>Valor Total</h3>
                        <p className="card-valor">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="card-quadrado">
                    <div className="card-content">
                        <h3>Valor Faturado</h3>
                        <p className="card-valor">R$ {valorFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p className="card-percentual">{percentualValorFaturado}%</p>
                    </div>
                </div>
                <div className="card-quadrado">
                    <div className="card-content">
                        <h3>Valor Pendente</h3>
                        <p className="card-valor">R$ {valorNaoFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p className="card-percentual">{percentualValorNaoFaturado}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RelatorioControladoria; 