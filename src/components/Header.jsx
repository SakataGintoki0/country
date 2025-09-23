import React from "react"

export default function Header({ regions = [], selectedRegion = "All", onSelect }){
    const tabs = [ ...regions, "All"];
    return (
        <div className="w-full">
            <div className="flex gap-2 border-b border-gray-100 overflow-x-auto pt-2">
                {tabs.map((label) => {
                    const isActive = label === selectedRegion;
                    return (
                        <div
                            key={label}
                            onClick={() => onSelect?.(label)}
                            className={
                                `px-3 py-3 text-md whitespace-nowrap cursor-pointer hover:border-b hover:border-blue-600 ` +
                                (isActive
                                    ? "border-b border-blue-600"
                                    : "")
                                    
                            }
                        >
                            {label}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}