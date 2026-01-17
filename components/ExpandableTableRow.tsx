import { formatBytes } from "@/lib/util/animebytes";
import React, { useState, useRef, useEffect } from "react";

const ExpandableTableRow = ({ FileList, isExpandRow } : {FileList? : FileData[], isExpandRow : boolean}) => {
  const [contentHeight, setContentHeight] = useState(0); 
  const contentRef = useRef<HTMLDivElement | null>(null); 

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpandRow ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpandRow]); 

  return (
    <tr className="table-row">
      <td colSpan={12} className="p-0">
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out bg-white"
          style={{
            height: `${contentHeight}px`,
          }}
        >
          <div ref={contentRef} className="p-4">
            <div className="table w-full border-collapse border border-gray-300">
                <div className="table-row  bg-gray-100 text-gray-900">
                    <div className="table-cell p-2 font-bold text-xs border border-gray-300">
                    Filename
                    </div>
                    <div className="table-cell p-2 font-bold text-xs border border-gray-300">
                    Size
                    </div>
                </div>

                {FileList?.map((file, key) => (
                    <div key={key} className="table-row">
                    <div className="table-cell p-2 text-xs border border-gray-300">
                        {file.filename}
                    </div>
                    <div className="table-cell p-2 text-xs border border-gray-300">
                        {formatBytes(file.size)}
                    </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ExpandableTableRow;
