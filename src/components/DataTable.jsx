import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";

const DataTable = ({ sectionTotal, sectionTitle, data, columns }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tableData, setTableData] = useState(data);
  const [mainTotal, setMainTotal] = useState(sectionTotal);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleInputChange = (rowIndex, field, value) => {
    const updatedData = tableData?.map((row, index) => {
      if (index === rowIndex) {
        const newRow = { ...row, [field]: value };

        if (field === "quantity" || field === "unit_cost") {
          const qty = parseFloat(newRow?.quantity) || 0;
          const unitCost = parseFloat(newRow?.unit_cost) || 0;
          newRow.total = qty * unitCost || 0;
        }
        return newRow;
      }
      return row;
    });

    setTableData(updatedData);
    const newMainTotal = updatedData.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0,
    );
    setMainTotal(newMainTotal);
  };

  return (
    <div className="p-4 my-4 bg-white mb-4">
      <div
        className="flex justify-between items-center cursor-pointer p-2 bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold">- {sectionTitle}</h2>
        <div className="flex gap-3 items-center">
          <p className="text-lg font-semibold">${mainTotal}</p>
          <span>{isExpanded ? "🔽" : "▶"}</span>
        </div>
      </div>
      {isExpanded && (
        <table className="w-full mt-2 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left font-medium"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`${index % 2 !== 0 ? "bg-gray-100" : "bg-white"}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {cell.column.id === "quantity" ||
                    cell.column.id === "unit_cost" ? (
                      <>
                        {cell.column.id === "unit_cost" ? "$" : ""}
                        <input
                          type="number"
                          value={cell.getValue()}
                          className="p-1 w-20"
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              cell.column.id,
                              e.target.value,
                            )
                          }
                          onKeyUp={(e) =>
                            handleInputChange(
                              index,
                              cell.column.id,
                              e.target.value,
                            )
                          }
                        />
                      </>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTable;
