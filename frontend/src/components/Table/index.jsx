import { Table as TableReact } from "reactstrap";
import _ from "lodash";
import styles from "./styles.module.scss";


const formatValue = (column, value) => {
  if (!value) return "";

  if (column.toLowerCase() === "date") {
    const date = new Date(value);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
  }

  if (column.toLowerCase() === "image") {
    const src = value.startsWith("http") ? value : `http://localhost:3000/uploads/${value}`;
    return <img src={src} alt="Game" className={styles.image} />;
  }

  return value;
};

const Table = ({
  columns = [],
  rows = {
    data: [],
    pagination: {},
  },
  
}) => {
  const formatValue = (key, value) => value;

  return (
    <TableReact hover className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={`header-${index}`}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(Array.isArray(rows) ? rows : rows?.data || []).map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {columns.map((column, colIndex) => {
              const rawValue = _.get(row, column, "");
              const formatted = formatValue(column, rawValue);
              return (
                <td key={`cell-${rowIndex}-${colIndex}`}>
                  {formatted}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </TableReact>
  );
};

export default Table;
