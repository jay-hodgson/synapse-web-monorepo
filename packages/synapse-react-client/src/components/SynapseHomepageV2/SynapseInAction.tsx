import React from 'react'
import { useGetQueryResultBundleWithAsyncStatus } from '../../synapse-queries'
import { BUNDLE_MASK_QUERY_RESULTS } from '../../utils/SynapseConstants'
import { Box } from '@mui/material'
import { SynapseInActionItem } from './SynapseInActionItem'

export type SynapseInActionProps = {
  sourceTableId: string
}

export const SynapseInAction: React.FunctionComponent<SynapseInActionProps> = ({
  sourceTableId,
}) => {
  const { data } = useGetQueryResultBundleWithAsyncStatus({
    entityId: sourceTableId,
    query: {
      sql: `SELECT * FROM ${sourceTableId} WHERE synapseHomepageTitle is not null`,
      limit: 5,
      sort: [{ column: 'friendlyName', direction: 'DESC' }],
    },
    partMask: BUNDLE_MASK_QUERY_RESULTS,
    concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
  })

  const rowSet = data?.responseBody?.queryResult?.queryResults
  const headers = rowSet?.headers
  const titleColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'synapseHomepageTitle',
  )!
  const descriptionColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'synapseHomepageDescription',
  )!
  const tagsColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'tags',
  )!
  const imageFileColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'synapseHomepageImage',
  )!
  const logoColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'logo',
  )!
  const linkColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'appURL',
  )!
  const friendlyNameColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'friendlyName',
  )!
  const primaryColorColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'primaryColor',
  )!
  const secondaryColorColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'secondaryColor',
  )!

  if (!rowSet || rowSet.rows.length == 0) {
    return <></>
  }
  return (
    <Box>
      {rowSet.rows.map(row => {
        const title = row.values[titleColIndex]!
        const description = row.values[descriptionColIndex]!
        const tags: string[] = JSON.parse(row.values[tagsColIndex]!)
        const imageFileHandleId = row.values[imageFileColIndex]!
        const logoFileHandleId = row.values[logoColIndex]!
        const link = row.values[linkColIndex]!
        const friendlyName = row.values[friendlyNameColIndex]!
        const primaryColor = row.values[primaryColorColIndex]!
        const secondaryColor = row.values[secondaryColorColIndex]!
        return (
          <SynapseInActionItem
            sourceTableId={sourceTableId}
            friendlyName={friendlyName}
            title={title}
            description={description}
            logoFileHandleId={logoFileHandleId}
            imageFileHandleId={imageFileHandleId}
            tags={tags}
            link={link}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )
      })}
    </Box>
  )
}
