import logoPostall from "../../assets/logoPostall.png";
import mapaMundial from "../../assets/mapaMundial.png";
import "./index.css";

function Header() {
  return (
    <>
      <header className="header">
        <div className="logo-section">
          <div>
            <div className="logo-text">
              <img width="200px" src={logoPostall}></img>
            </div>
          </div>
        </div>

        {/* Marca d'água centralizada */}
        <div className="watermark-container">
          <img src={mapaMundial} alt="Marca d'água" className="watermark" />
        </div>

        <div className="user-section">
          
          <div className="user-profile-container">
            <a href="#" className="user-profile">
              <div className="avatar">C</div>
              <span className="user-name">Carolina Bessa</span>
              <span className="dropdown-arrow">▼</span>
            </a>
            
            <div className="user-dropdown">
              <button className="logout-button">
                <span className="logout-icon" style={{color: '#477ABE'}}>X</span>
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;
