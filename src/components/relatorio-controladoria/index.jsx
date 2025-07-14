import './index.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function RelatorioControladoria({ dados }) {
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
    const COLORS = ['#477ABE', '#F5871F'];

    return (
        <div className="relatorio-container relatorio-compacto">
            {/* Cards de Resumo - Seção Superior */}
            <div className="cards-resumo compacto">
                <div className="card-resumo compacto">
                    <div className="card-icon" style={{color: 'var(--azul-escuro)'}}>📋</div>
                    <div className="card-content">
                        <h3>Total de Documentos</h3>
                        <p className="card-valor">{totalDocumentos}</p>
                    </div>
                </div>
                <div className="card-resumo faturado compacto">
                    <div className="card-icon" style={{color: 'var(--azul-principal)'}}>✅</div>
                    <div className="card-content">
                        <h3>Faturados</h3>
                        <p className="card-valor">{totalFaturados}</p>
                        <p className="card-percentual">{percentualFaturado}%</p>
                    </div>
                </div>
                <div className="card-resumo nao-faturado compacto">
                    <div className="card-icon" style={{color: 'var(--laranja)'}}>⏳</div>
                    <div className="card-content">
                        <h3>Não Faturados</h3>
                        <p className="card-valor">{totalNaoFaturados}</p>
                        <p className="card-percentual">{percentualNaoFaturado}%</p>
                    </div>
                </div>
            </div>

            {/* Seção Principal - Cards de Valores + Gráfico lado a lado */}
            <div className="secao-principal compacto">
                {/* Cards de Valores - Lado Esquerdo */}
                <div className="cards-valores compacto">
                    <div className="card-valor-item compacto">
                        <div className="card-icon" style={{color: 'var(--azul-escuro)'}}>💰</div>
                        <div className="card-content">
                            <h3>Valor Total</h3>
                            <p className="card-valor">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                    <div className="card-valor-item faturado compacto">
                        <div className="card-icon" style={{color: 'var(--azul-principal)'}}>💵</div>
                        <div className="card-content">
                            <h3>Valor Faturado</h3>
                            <p className="card-valor">R$ {valorFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className="card-percentual">{percentualValorFaturado}%</p>
                        </div>
                    </div>
                    <div className="card-valor-item nao-faturado compacto">
                        <div className="card-icon" style={{color: 'var(--laranja)'}}>⚠️</div>
                        <div className="card-content">
                            <h3>Valor Pendente</h3>
                            <p className="card-valor">R$ {valorNaoFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className="card-percentual">{percentualValorNaoFaturado}%</p>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Pizza - Lado Direito */}
                <div className="grafico-principal compacto">
                    <div className="grafico-item compacto">
                        <h3 style={{textAlign: 'center', marginBottom: 20, color: 'var(--azul-escuro)', fontSize: 18, fontWeight: 600}}>
                            Distribuição por Status
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dataPie}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={2}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    isAnimationActive={true}
                                >
                                    {dataPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Valor total no centro do donut */}
                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none'}}>
                            <div style={{fontSize: 32, fontWeight: 700, color: '#0A2144', lineHeight: 1}}>{totalDocumentos}</div>
                            <div style={{fontSize: 14, color: '#888'}}>Total</div>
                        </div>
                        {/* Legenda abaixo */}
                        <div style={{display: 'flex', flexDirection: 'row', gap: 32, marginTop: 24, justifyContent: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                <span style={{width: 18, height: 18, borderRadius: '50%', background: '#477ABE', display: 'inline-block'}}></span>
                                <span style={{fontSize: 15, color: '#0A2144'}}>Faturados</span>
                                <span style={{fontWeight: 600, color: '#0A2144'}}>{percentualFaturado}%</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                <span style={{width: 18, height: 18, borderRadius: '50%', background: '#F5871F', display: 'inline-block'}}></span>
                                <span style={{fontSize: 15, color: '#0A2144'}}>Não Faturados</span>
                                <span style={{fontWeight: 600, color: '#0A2144'}}>{percentualNaoFaturado}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RelatorioControladoria; 