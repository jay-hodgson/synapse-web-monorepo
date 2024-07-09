import React from 'react'
import { useGetQueryResultBundleWithAsyncStatus } from '../../synapse-queries'
import { BUNDLE_MASK_QUERY_RESULTS } from '../../utils/SynapseConstants'
import { TrendingItem } from './TrendingItem'

export type SynapseTrendingDatasetsProps = {
  past30DaysDownloadMetricsTable: string
}

export const SynapseTrendingDatasets: React.FunctionComponent<
  SynapseTrendingDatasetsProps
> = ({ past30DaysDownloadMetricsTable }) => {
  const { data: past30DaysDownloadData } =
    useGetQueryResultBundleWithAsyncStatus({
      entityId: past30DaysDownloadMetricsTable,
      query: {
        sql: `SELECT * FROM ${past30DaysDownloadMetricsTable}`,
        limit: 10,
        sort: [
          { column: 'last_updated', direction: 'DESC' }, // First sort by export date desc (only the most recent export)
          { column: 'N_UNIQUE_USERS', direction: 'DESC' }, // TODO: Is this the correct secondary sort?
        ],
      },
      partMask: BUNDLE_MASK_QUERY_RESULTS,
      concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
    })

  const rowSet = past30DaysDownloadData?.responseBody?.queryResult?.queryResults
  const headers = rowSet?.headers
  const entityIdColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'PROJECT_ID',
  )!
  const nUniqueUsersColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'N_UNIQUE_USERS',
  )!
  const egressSizeColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'TOTAL_DATA_SIZE_GIB',
  )!

  if (!rowSet || rowSet.rows.length == 0) {
    return <></>
  }
  return rowSet.rows.map((row, index) => (
    <TrendingItem
      rank={index + 1}
      rowValues={row.values}
      entityIdColIndex={entityIdColIndex}
      egressSizeGbColIndex={egressSizeColIndex}
      nUniqueUsersColIndex={nUniqueUsersColIndex}
    />
  ))
}
