import { Box, Typography } from '@mui/material'
import React from 'react'
import { EntityLink } from '../EntityLink'
import { calculateFriendlyFileSize } from '../../utils/functions/calculateFriendlyFileSize'

export type TrendingItemProps = {
  rowValues: (string | null)[]
  entityIdColIndex: number
  nDownloadsColIndex: number
  nUniqueUsersColIndex: number
  egressSizeColIndex: number
}

const compactFormatter = Intl.NumberFormat('en', { notation: 'compact' })
const formatter = Intl.NumberFormat('en')

export const TrendingItem: React.FunctionComponent<TrendingItemProps> = ({
  rowValues,
  entityIdColIndex,
  nDownloadsColIndex,
  nUniqueUsersColIndex,
  egressSizeColIndex,
}) => {
  const entityId = rowValues[entityIdColIndex]
  const egressSize = rowValues[egressSizeColIndex]
  const friendlyEgressSize = egressSize
    ? calculateFriendlyFileSize(parseInt(egressSize))
    : ''

  const downloadCount = rowValues[nDownloadsColIndex]
  const friendlyDownloadCount = downloadCount
    ? compactFormatter.format(parseInt(downloadCount))
    : ''

  const userCount = rowValues[nUniqueUsersColIndex]
  const friendlyUserCount = userCount
    ? formatter.format(parseInt(userCount))
    : ''

  return (
    <Box sx={{ padding: '15px' }}>
      {entityId && <EntityLink entity={entityId} />}
      <Typography variant="body1">
        Downloads: {friendlyDownloadCount}
      </Typography>
      <Typography variant="body1">Unique Users: {friendlyUserCount}</Typography>
      <Typography variant="body1">
        Download Size: {friendlyEgressSize}
      </Typography>
    </Box>
  )
}
