import styles from "./TableRowMenu.module.css";

const TableRowMenu = () => {
  return (
    <div className={styles.rowMenuContainer}>
      <ul>
        <li>Mark as Favorite</li>
        <li>Mark as hard</li>
        <li>Delete word</li>
      </ul>
    </div>
  );
};

export default TableRowMenu;
