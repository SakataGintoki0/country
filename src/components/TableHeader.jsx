import React from "react";
import { flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function TableHeader({ table }) {
  return (
    <thead className="bg-gray-100">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="text-left text-base border-b border-gray-300 p-2 select-none uppercase text-gray-500"
            >
              {header.isPlaceholder ? null : (
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() ? (
                      <span className="flex flex-col leading-none">
                        <button
                          type="button"
                          onClick={() => header.column.toggleSorting(false)}
                          className="w-3 h-3 text-gray-600 hover:text-blue-600 cursor-pointer"
                          title="Sort ascending"
                          aria-label="Sort ascending"
                        >
                          <ChevronUp className={"w-3 h-3 " + (header.column.getIsSorted() === "asc" ? "text-blue-600" : "")} />
                        </button>
                        <button
                          type="button"
                          onClick={() => header.column.toggleSorting(true)}
                          className="w-3 h-3 -mt-0.5 text-gray-600 hover:text-blue-600 cursor-pointer"
                          title="Sort descending"
                          aria-label="Sort descending"
                        >
                          <ChevronDown className={"w-3 h-3 " + (header.column.getIsSorted() === "desc" ? "text-blue-600" : "")} />
                        </button>
                      </span>
                    ) : null}
                  </span>
                  {header.column.getCanSort() ? (
                    <input
                      type="text"
                      value={header.column.getFilterValue() ?? ""}
                      onChange={(e) => header.column.setFilterValue(e.target.value)}
                      placeholder={`Search...`}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : null}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

