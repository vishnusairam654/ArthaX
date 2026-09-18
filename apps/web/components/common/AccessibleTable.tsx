import React from 'react';

export interface AccessibleTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface AccessibleTableProps<T> {
  caption: string;
  columns: AccessibleTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  emptyMessage?: string;
  className?: string;
  summary?: string;
  rowClassName?: (row: T, index: number) => string;
}

/**
 * WCAG 2.1 AA Compliant Financial Table Primitive
 * Ensures proper semantic table hierarchy, captioning for screen readers,
 * column header scopes, and row-level accessibility.
 */
export function AccessibleTable<T>({
  caption,
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No financial records found in this view.',
  className = '',
  summary,
  rowClassName,
}: AccessibleTableProps<T>) {
  return (
    <div className={`overflow-x-auto arthax-scrollbar-horizontal w-full rounded-lg border border-[rgba(2,36,72,0.08)] bg-white/80 backdrop-blur-sm ${className}`}>
      <table className="w-full text-left border-collapse" summary={summary}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-[rgba(2,36,72,0.08)] bg-[rgba(242,239,231,0.5)]">
            {columns.map((col, idx) => {
              const alignClass =
                col.align === 'right'
                  ? 'text-right'
                  : col.align === 'center'
                  ? 'text-center'
                  : 'text-left';

              return (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary,#022448)] ${alignClass} ${
                    col.headerClassName || ''
                  }`}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(2,36,72,0.05)] text-sm">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-sm text-[var(--color-ink,#262320)]/60"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => {
              const customRowClass = rowClassName ? rowClassName(row, rowIdx) : '';
              return (
                <tr
                  key={keyExtractor(row, rowIdx)}
                  className={`hover:bg-[rgba(2,36,72,0.02)] transition-colors ${customRowClass}`}
                >
                  {columns.map((col, colIdx) => {
                    const alignClass =
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left';

                    const content = col.render
                      ? col.render(row, rowIdx)
                      : (row as any)[col.key];

                    // Make the first column act as a row header for optimal screen reader navigation
                    if (colIdx === 0) {
                      return (
                        <th
                          key={col.key}
                          scope="row"
                          className={`px-4 py-3 font-medium text-[var(--color-ink,#262320)] ${alignClass} ${
                            col.className || ''
                          }`}
                        >
                          {content}
                        </th>
                      );
                    }

                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-[var(--color-ink,#262320)] ${alignClass} ${
                          col.className || ''
                        }`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
