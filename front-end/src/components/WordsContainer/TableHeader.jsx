import { flexRender } from "@tanstack/react-table";
import styles from "./WordsContainer.module.css";

const TableHeader = ({ headerGroups }) => (
  <thead>
    {headerGroups?.map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            style={{ width: `${header.column.columnDef.size}px` }}
            className={styles.tableHeaderCell}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
);

export default TableHeader;
