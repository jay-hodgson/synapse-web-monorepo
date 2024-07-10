import '@tanstack/react-table'
import { RowData } from '@tanstack/react-table'

// Type that represents an enumerated value that can be passed to a column to render a filter control
type ColumnFilterEnumValue<TValue = unknown> = {
  value: TValue
  displayText: string
  count?: number
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    textAlign?: React.CSSProperties['textAlign']

    /** The type of filter that this column may have */
    filterVariant?: 'enumeration' // could be extended to include 'range', 'freeText', etc.
    /** If the filterVariant is `enumeration`, this list captures the potential values that may be picked for filtering */
    enumValues?: ColumnFilterEnumValue<TValue>[]
    /** If the filterVariant is `enumeration`, determines whether the user can filter by multiple values. */
    enableMultipleSelect?: boolean
  }
}
