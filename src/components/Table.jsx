import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function Table({ data, loading }) {
  const columns = React.useMemo(
    () => [
      {
        header: "Common Name",
        accessorFn: (row) => row?.name?.common ?? "",
      },
      {
        header: "Official Name",
        accessorFn: (row) => row?.name?.official ?? "",
      },
      {
        header: "Capital",
        accessorFn: (row) =>
          Array.isArray(row?.capital)
            ? row.capital.join(", ")
            : (row?.capital ?? ""),
      },
      {
        header: "Currency",
        accessorFn: (row) => {
          if (!row?.currencies) return "";
          try {
            return Object.entries(row.currencies)
              .map(([code, info]) => {
                const n = info?.name || "";
                const s = info?.symbol ? ` (${info.symbol})` : "";
                return n ? `${code} - ${n}${s}` : code;
              })
              .join(", ");
          } catch {
            return "";
          }
        },
        cell: ({ getValue }) => getValue(),
      },
      {
        header: "Region",
        accessorKey: "region",
      },
      {
        header: "Subregion",
        accessorKey: "subregion",
      },
      {
        header: "Timezone",
        accessorFn: (row) =>
          Array.isArray(row?.timezones)
            ? (row.timezones[0] ?? "")
            : (row?.timezones ?? ""),
      },
      {
        header: "Google Maps",
        cell: ({ row }) => {
          const url = row.original?.maps?.googleMaps;
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-600 underline hover:text-blue-700"
            >
              Open
            </a>
          ) : (
            ""
          );
        },
        enableSorting: false,
      },
      {
        header: "Flag",
        cell: ({ row }) => {
          const item = row.original;
          const name = item?.name?.common ?? "";
          const flag = item?.flags?.png ?? item?.flags?.svg ?? "";
          return flag ? (
            <img
              src={flag}
              alt={name}
              width={32}
              height={20}
              className="object-cover"
            />
          ) : null;
        },
        enableSorting: false,
      },
    ],
    [],
  );

  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const query = String(filterValue).toLowerCase();
      const item = row.original ?? {};
      const common = item?.name?.common ?? "";
      const official = item?.name?.official ?? "";
      const capital = Array.isArray(item?.capital)
        ? item.capital.join(", ")
        : (item?.capital ?? "");
      const region = item?.region ?? "";
      const subregion = item?.subregion ?? "";
      const timezone = Array.isArray(item?.timezones)
        ? (item.timezones[0] ?? "")
        : (item?.timezones ?? "");
      const map = item?.maps?.googleMaps ?? "";
      const currencies = (() => {
        try {
          if (!item?.currencies) return "";
          return Object.entries(item.currencies)
            .map(
              ([code, info]) =>
                `${code} ${info?.name ?? ""} ${info?.symbol ?? ""}`,
            )
            .join(" ");
        } catch {
          return "";
        }
      })();
      const haystack =
        `${common} ${official} ${capital} ${region} ${subregion} ${timezone} ${map} ${currencies}`.toLowerCase();
      return haystack.includes(query);
    },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
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
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()} — Showing {table.getRowModel().rows.length} of{" "}
          {data.length}
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
      <table className="w-full border-collapse rounded-lg shadow-md bg-white overflow-hidden">
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
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() ? (
                          <span className="flex flex-col leading-none">
                            <button
                              type="button"
                              onClick={() => header.column.toggleSorting(false)}
                              className="w-3 h-3 text-gray-600 hover:text-blue-600 cursor-pointer"
                              title="Sort ascending"
                              aria-label="Sort ascending"
                            >
                              <ChevronUp
                                className={
                                  "w-3 h-3 " +
                                  (header.column.getIsSorted() === "asc"
                                    ? "text-blue-600"
                                    : "")
                                }
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => header.column.toggleSorting(true)}
                              className="w-3 h-3 -mt-0.5 text-gray-600 hover:text-blue-600 cursor-pointer"
                              title="Sort descending"
                              aria-label="Sort descending"
                            >
                              <ChevronDown
                                className={
                                  "w-3 h-3 " +
                                  (header.column.getIsSorted() === "desc"
                                    ? "text-blue-600"
                                    : "")
                                }
                              />
                            </button>
                          </span>
                        ) : null}
                      </span>
                      {header.column.getCanSort() ? (
                        <input
                          type="text"
                          value={header.column.getFilterValue() ?? ""}
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const isCommonName =
                  String(cell.column.columnDef.header) === "Common Name";
                return (
                  <td
                    key={cell.id}
                    className={
                      "p-2 border-b border-gray-100 text-left " +
                      (isCommonName ? "text-gray-500" : "text-gray-400")
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}
