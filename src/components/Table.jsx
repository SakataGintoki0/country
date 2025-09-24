import React from "react";
import TableToolbar from "./TableToolbar";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import {
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
    <div className="p-8">
      <TableToolbar table={table} dataLength={data.length} />
      <table className="w-full border-collapse rounded-lg shadow-md bg-white overflow-hidden">
        <TableHeader table={table} />
        <TableBody table={table} />
      </table>
    </div>
  );
}
