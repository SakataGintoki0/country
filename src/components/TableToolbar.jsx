import React from "react";

export default function TableToolbar({ table, dataLength }) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          placeholder="Global Search"
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-between items-center my-3 text-gray-500">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} — Showing {table.getRowModel().rows.length} of {dataLength}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

