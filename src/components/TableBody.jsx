import React from "react";
import { flexRender } from "@tanstack/react-table";

export default function TableBody({ table }) {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => {
            const isCommonName = String(cell.column.columnDef.header) === "Common Name";
            return (
              <td
                key={cell.id}
                className={
                  "p-2 border-b border-gray-100 text-left " + (isCommonName ? "text-gray-500" : "text-gray-400")
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}

