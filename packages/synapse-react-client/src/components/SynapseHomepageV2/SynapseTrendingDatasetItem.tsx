import { Box, Typography } from '@mui/material'
import React from 'react'
import { calculateFriendlyFileSize } from '../../utils/functions/calculateFriendlyFileSize'
import { useGetEntityHeader } from '../../synapse-queries'
import { NavigateNext } from '@mui/icons-material'
import { BackendDestinationEnum, getEndpoint } from '../../utils/functions'
import { ReactComponent as EgressIcon } from '../../assets/homepage/egress.svg'

import { ReactComponent as UsersIcon } from '../../assets/homepage/users.svg'
export type TrendingItemProps = {
  rank: number
  rowValues: (string | null)[]
  entityIdColIndex: number
  nUniqueUsersColIndex: number
  egressSizeGbColIndex: number
  isMobileView: boolean
}

const formatter = Intl.NumberFormat('en')
export const gridTemplateColumns = (isMobileView: boolean) =>
  isMobileView ? '100px auto 40px' : '100px auto 170px 150px 40px'

export const SynapseTrendingDatasetItem: React.FunctionComponent<
  TrendingItemProps
> = ({
  rank,
  rowValues,
  entityIdColIndex,
  nUniqueUsersColIndex,
  egressSizeGbColIndex,
  isMobileView,
}) => {
  const entityId = rowValues[entityIdColIndex]
  const egressSize = rowValues[egressSizeGbColIndex]
  const { data: entityHeader } = useGetEntityHeader(entityId!, undefined, {
    enabled: !!entityId,
  })
  const friendlyEgressSize = egressSize
    ? calculateFriendlyFileSize(parseFloat(egressSize) * 1e9)
    : ''

  const userCount = rowValues[nUniqueUsersColIndex]
  const friendlyUserCount = userCount
    ? formatter.format(parseInt(userCount))
    : ''
  let backgroundColor = '#223549'
  let borderRadius
  switch (rank) {
    case 1:
      backgroundColor = '#447A74'
      borderRadius = '12px 12px 0px 0px'
      break
    case 2:
      backgroundColor = '#33575E'
      break
    case 3:
      backgroundColor = '#294251'
      break
    case 10:
      borderRadius = '0px 0px 12px 12px'
      break
  }

  return (
    <div
      onClick={() => {
        window.open(
          `${getEndpoint(
            BackendDestinationEnum.PORTAL_ENDPOINT,
          )}Synapse:${entityId!}`,
          '_target',
        )
      }}
    >
      <Box
        sx={{
          color: '#D7DEE4',
          backgroundColor,
          borderRadius,
          '&:hover': {
            color: 'white',
            cursor: 'pointer',
            filter: 'brightness(105%)',
          },
          padding: '15px 0px',
          display: 'grid',
          gridTemplateColumns: gridTemplateColumns(isMobileView),
          justifyItems: 'start',
          svg: { margin: '0 3px -3px 0' },
        }}
      >
        <Typography variant="body1" sx={{ marginLeft: '30px' }}>
          {rank}
        </Typography>
        <Typography variant="body1">{entityHeader?.name}</Typography>
        {!isMobileView && (
          <Typography variant="body1">
            <EgressIcon />
            {friendlyEgressSize}
          </Typography>
        )}
        {!isMobileView && (
          <Typography variant="body1">
            <UsersIcon />
            {friendlyUserCount}
          </Typography>
        )}
        <Box>
          <NavigateNext />
        </Box>
      </Box>
    </div>
  )
}
