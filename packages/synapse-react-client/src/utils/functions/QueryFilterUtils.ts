import {
  ColumnSingleValueFilterOperator,
  ColumnSingleValueQueryFilter,
  QueryFilter,
  Row,
  SelectColumn,
} from '@sage-bionetworks/synapse-types'

export function getPrimaryKeyINFilter(
  primaryKeyColumnName: string,
  selectedRows: Row[],
  selectColumns: SelectColumn[],
): QueryFilter {
  if (!primaryKeyColumnName) {
    // If the key is undefined, then the user should have never been able to apply a filter
    // TODO: Handling a composite key would be tricky since the QueryFilter API currently only allows you to specify one column
    throw new Error('primaryKeyColumnName is undefined')
  }
  // Apply a filter that should only return the selected rows
  const primaryKeyColumnIndex = selectColumns.findIndex(
    sc => sc.name === primaryKeyColumnName,
  )
  const filter: ColumnSingleValueQueryFilter = {
    concreteType:
      'org.sagebionetworks.repo.model.table.ColumnSingleValueQueryFilter',
    columnName: selectColumns[primaryKeyColumnIndex].name,
    operator: ColumnSingleValueFilterOperator.IN,
    values: selectedRows.map(row => row.values[primaryKeyColumnIndex]!),
  }
  return filter
}
