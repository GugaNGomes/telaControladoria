import "./index.css";

function Filtros(props) {
  return (
    <div className="filtros-container">
      <b className="filtros-title">{props.title}</b>
      <input type="date" className="filtros-input" {...props} />
    </div>
  );
}
export default Filtros;
