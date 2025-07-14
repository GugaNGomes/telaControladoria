import "./index.css";

function Filtros(props) {
  return (
    <div className="filtros-container">
      <b className="filtros-title">{props.title}</b>
      <select
        className="form-select form-select-lg filtros-select"
        {...props}
      >
        <option value="">Selecione</option>
        <option value="">Selecione</option>
        <option value="">Selecione</option>

        <option value="">Selecione</option>

      </select>
    </div>
  );
}
export default Filtros;
