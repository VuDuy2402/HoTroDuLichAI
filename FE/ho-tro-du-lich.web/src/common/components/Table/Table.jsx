import React, { useState, useMemo } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

/**
 * Table component with sorting functionality
 * @param {Array} columns - Column configurations [{label: string, row: string, sortable: boolean}]
 * @param {Array} items - Data to display in table rows
 * @param {React.Element} template - Template for each row in the table
 * @param {Function} onSort - Callback function to handle sorting (pass to parent component)
 * @returns Table component with sorting features
 */
const Table = ({ columns, items, template, onSort }) => {
  // State to track sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc", // can be "asc" or "desc"
  });

  // Handle sort change: toggles between ascending and descending sort
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    // Call the onSort callback to notify parent component about sorting
    if (onSort) {
      onSort(key, direction); // This will trigger the API call or state update for sorting
    }
  };

  // Sorting logic for local sorting (if needed), but ideally will rely on API sorting
  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig]);

  return (
    <div className="table-responsive overflow-auto d-flex rounded shadow my-3" style={{ width: "100%" }}>
      <table className="table table-striped table-hover" style={{ minWidth: "600px", whiteSpace: "nowrap" }}>
        <thead>
          <tr>
            {columns &&
              columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={col.sortable ? () => handleSort(col.row) : undefined}
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  {col.label}
                  {col.sortable && sortConfig.key === col.row && (
                    <span className="ms-2">
                      {sortConfig.direction === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                    </span>
                  )}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {sortedItems && sortedItems.map((item, idx) => React.cloneElement(template, { key: idx, data: item }))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;