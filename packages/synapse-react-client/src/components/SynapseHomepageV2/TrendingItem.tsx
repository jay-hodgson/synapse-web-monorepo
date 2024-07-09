import { Box, Typography } from '@mui/material'
import React from 'react'
import { calculateFriendlyFileSize } from '../../utils/functions/calculateFriendlyFileSize'
import { useGetEntityHeader } from '../../synapse-queries'
import { NavigateNext } from '@mui/icons-material'
import { BackendDestinationEnum, getEndpoint } from '../../utils/functions'

export type TrendingItemProps = {
  rank: number
  rowValues: (string | null)[]
  entityIdColIndex: number
  nUniqueUsersColIndex: number
  egressSizeGbColIndex: number
}

const formatter = Intl.NumberFormat('en')
export const gridTemplateColumns = '100px auto 170px 150px 40px'
export const TrendingItem: React.FunctionComponent<TrendingItemProps> = ({
  rank,
  rowValues,
  entityIdColIndex,
  nUniqueUsersColIndex,
  egressSizeGbColIndex,
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
  let backgroundColor
  switch (rank) {
    case 1:
      backgroundColor = '#447A74'
      break
    case 2:
      backgroundColor = '#33575E'
      break
    case 3:
      backgroundColor = '#294251'
      break
    default:
      backgroundColor = '#395979'
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
          '&:hover': {
            color: 'white',
            cursor: 'pointer',
          },
          padding: '15px 0px',
          display: 'grid',
          gridTemplateColumns,
          justifyItems: 'start',
          svg: { margin: '0 3px -3px 0' },
        }}
      >
        <Typography variant="body1" sx={{ marginLeft: '30px' }}>
          {rank}
        </Typography>
        <Typography variant="body1">{entityHeader?.name}</Typography>
        <Typography variant="body1">
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.4668 4.04621C13.4668 4.99226 11.3029 5.75918 8.63347 5.75918C5.9641 5.75918 3.80014 4.99226 3.80014 4.04621M13.4668 4.04621C13.4668 3.10017 11.3029 2.33325 8.63347 2.33325C5.9641 2.33325 3.80014 3.10017 3.80014 4.04621M13.4668 4.04621V12.9537C13.4668 13.8997 11.3029 14.6666 8.63347 14.6666C5.9641 14.6666 3.80014 13.8997 3.80014 12.9537V4.04621M13.4668 8.49992C13.4668 9.42038 11.3029 10.1666 8.63347 10.1666C5.9641 10.1666 3.80014 9.42038 3.80014 8.49992"
              stroke="#D7DEE4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {friendlyEgressSize}
        </Typography>
        <Typography variant="body1">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.767 4.83337C10.767 6.21409 9.64771 7.33337 8.26697 7.33337C6.88629 7.33337 5.767 6.21409 5.767 4.83337C5.767 3.45266 6.88629 2.33337 8.26697 2.33337C9.64771 2.33337 10.767 3.45266 10.767 4.83337Z"
              stroke="#D7DEE4"
              stroke-linejoin="round"
            />
            <path
              d="M8.26599 9.33337C5.73561 9.33337 3.88863 11.0157 3.38039 13.2772C3.29425 13.6604 3.60546 14 3.9983 14H12.5337C12.9266 14 13.2378 13.6604 13.1517 13.2772C12.6434 11.0157 10.7964 9.33337 8.26599 9.33337Z"
              stroke="#D7DEE4"
              stroke-linejoin="round"
            />
          </svg>
          {friendlyUserCount}
        </Typography>
        <Box>
          <NavigateNext />
        </Box>
      </Box>
    </div>
  )
}
