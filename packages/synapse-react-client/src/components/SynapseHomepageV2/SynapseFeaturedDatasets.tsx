import React from 'react'
import { useGetQueryResultBundleWithAsyncStatus } from '../../synapse-queries'
import { BUNDLE_MASK_QUERY_RESULTS } from '../../utils/SynapseConstants'
import { Box } from '@mui/material'
import { SynapseFeaturedDatasetItem } from './SynapseFeaturedDatasetItem'

export type SynapseFeaturedDatasetsProps = {
  sourceTable: string
}

export const SynapseFeaturedDatasets: React.FunctionComponent<
  SynapseFeaturedDatasetsProps
> = ({ sourceTable }) => {
  const { data: past30DaysDownloadData } =
    useGetQueryResultBundleWithAsyncStatus({
      entityId: sourceTable,
      query: {
        sql: `SELECT * FROM ${sourceTable} where name is not null`,
        limit: 10,
        sort: [
          //TODO: sort?
          // { column: 'last_updated', direction: 'DESC' },
        ],
      },
      partMask: BUNDLE_MASK_QUERY_RESULTS,
      concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
    })

  const rowSet = past30DaysDownloadData?.responseBody?.queryResult?.queryResults
  const headers = rowSet?.headers
  const entityIdColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'id',
  )!
  const communityColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'community',
  )!
  const nameColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'name',
  )!
  const descriptionColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'description',
  )!
  const contributorsColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'contributors',
  )!
  const keywordsColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'keywords',
  )!
  const individualsColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'individuals',
  )!
  const imageColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'image',
  )!
  const sizeColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'size',
  )!
  const sizeUnitColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'sizeUnit',
  )!

  if (!rowSet || rowSet.rows.length == 0) {
    return <></>
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
      }}
    >
      {rowSet.rows.map(row => {
        const community = row.values[communityColIndex]
        const id = row.values[entityIdColIndex]
        const name = row.values[nameColIndex]
        const description = row.values[descriptionColIndex]
        const contributors = row.values[contributorsColIndex]
        const keywords = row.values[keywordsColIndex]
        const individuals = row.values[individualsColIndex]
        const imageFileId = row.values[imageColIndex]
        const size = row.values[sizeColIndex]
        const sizeUnit = row.values[sizeUnitColIndex]
        return (
          <Box sx={{ maxWidth: '450px' }}>
            <SynapseFeaturedDatasetItem
              key={row.rowId}
              sourceTable={sourceTable}
              community={community}
              id={id}
              name={name}
              description={description}
              keywords={keywords}
              individuals={individuals}
              contributors={contributors}
              imageFileId={imageFileId}
              size={size}
              sizeUnit={sizeUnit}
            />
          </Box>
        )
      })}
    </Box>
  )
}
