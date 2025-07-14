import './index.css';

function PainelProdutos({ item, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay escuro */}
            <div className="overlay" onClick={onClose}></div>
            
            {/* Painel lateral de produtos */}
            <div className="painel-produtos">
                <div className="painel-header">
                    <h2>Produtos - {item?.cliente}</h2>
                    <button className="btn-fechar" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="painel-content">
                    <div className="info-item">
                        <strong>Número do Documento:</strong> {item?.numeroDocumento}
                    </div>
                    <div className="info-item">
                        <strong>Cliente:</strong> {item?.cliente}
                    </div>
                    <div className="info-item">
                        <strong>Galpão:</strong> {item?.galpao}
                    </div>
                    <div className="info-item">
                        <strong>Data de Emissão:</strong> {item?.dataEmissaoDocumento}
                    </div>
                    <div className="info-item">
                        <strong>Valor do Documento:</strong> {item?.valorDocumento}
                    </div>
                    
                    <div className="produtos-lista">
                        <h3>Lista de Produtos</h3>
                        <div className="produto-item">
                            <span>Produto 1 - Quantidade: 10 - Valor: R$ 100,00</span>
                        </div>
                        <div className="produto-item">
                            <span>Produto 2 - Quantidade: 5 - Valor: R$ 50,00</span>
                        </div>
                        <div className="produto-item">
                            <span>Produto 3 - Quantidade: 8 - Valor: R$ 80,00</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PainelProdutos; 