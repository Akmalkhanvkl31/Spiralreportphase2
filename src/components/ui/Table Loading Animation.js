import React from 'react';

const TableLoader = () => {
  // Generate arrays for skeleton rows and columns
  const columns = Array(6).fill(null);
  const rows = Array(3).fill(null);
  const tagPlaceholders = Array(2).fill(null);

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((_, i) => (
                  <th key={`header-${i}`} className="px-6 py-3 text-left">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((_, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-48"></div>
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-32"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
                      <div className="flex gap-2">
                        {tagPlaceholders.map((_, i) => (
                          <div key={`tag-${i}`} className="h-6 bg-gray-100 rounded animate-pulse w-16"></div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-24"></div>
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-gray-100 rounded-full animate-pulse w-12"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 bg-gray-100 rounded animate-pulse w-24"></div>
                      <div className="h-8 bg-gray-100 rounded animate-pulse w-8"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableLoader;