import { ColumnModel, Row } from '@sage-bionetworks/synapse-types'
import { isEqual } from 'lodash-es'
import { atom } from 'jotai'
import { tableQueryDataAtom } from './QueryWrapper'

export function getRowSelectionEqualityComparator(
  row: Row,
  columnModels?: ColumnModel[],
  rowPrimaryKey?: string,
): (r1: Row, r2: Row) => boolean {
  // Worst-case scenario, use deep equality to compare rows
  // This will fail from the user's perspective if any data changes in the rows since the last time the selection was updated.
  let comparator: (r1: Row, r2: Row) => boolean = isEqual
  if (rowPrimaryKey && columnModels) {
    // If the `rowPrimaryKey` is defined, a row is selected if we have a PK match
    // Even this selection is not guaranteed to persist if data changes, e.g. if column order changes and the PK now has a different column index
    comparator = (r1: Row, r2: Row) => {
      const r1PrimaryKeyValue =
        r1.values[columnModels.findIndex(cm => cm.id === rowPrimaryKey)]!

      const r2PrimaryKeyValue =
        r2.values[columnModels.findIndex(cm => cm.id === rowPrimaryKey)]!

      return isEqual(r1PrimaryKeyValue, r2PrimaryKeyValue)
    }
  } else if (row.rowId) {
    // If there's a rowId, we can use that as a fallback
    comparator = (r1: Row, r2: Row) => r1.rowId === r2.rowId
  }

  return comparator
}

/**
 * Use Jotai atoms to manage table row selection state. We use Jotai instead of React context because subscribing to atoms
 * is more performant than subscribing to a frequently-changing context object, which causes undesirable re-renders.
 */

/**
 * Whether row selection is visible for the current component
 */
export const isRowSelectionVisibleAtom = atom<boolean>(false)

/**
 * Whether row selection UI should float or be shown inline
 */
export const isRowSelectionUIFloatingAtom = atom<boolean>(true)

/**
 * The column ID that contains a row unique key (used to identify the row). If two selected rows have the same key values, then they are considered equal and would both be selected/deselected together.
 */
export const rowPrimaryKeyColumnAtom = atom<ColumnModel | undefined>(undefined)

/**
 * Column ID of containing the row version.
 */
export const rowVersionColumnAtom = atom<ColumnModel | undefined>(undefined)

/**
 * The set of selected rows
 */
export const selectedRowsAtom = atom<Row[]>([])

/**
 * Can be used to determine if a row is selected. If a `rowPrimaryKey` is defined, then the row is selected if it has a matching PK.
 */
export const isRowSelectedAtom = atom(get => (row: Row) => {
  const comparator = getRowSelectionEqualityComparator(
    row,
    get(tableQueryDataAtom)?.columnModels ?? [],
    get(rowPrimaryKeyColumnIdAtom),
  )
  return get(selectedRowsAtom).some(selectedRow => comparator(selectedRow, row))
})

/**
 * Whether rows are currently selected
 */
export const hasSelectedRowsAtom = atom(get => get(selectedRowsAtom).length > 0)
