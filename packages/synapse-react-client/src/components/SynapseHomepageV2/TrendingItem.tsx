import { Box, Typography } from '@mui/material'
import React from 'react'
import { EntityLink } from '../EntityLink'
import { calculateFriendlyFileSize } from '../../utils/functions/calculateFriendlyFileSize'

export type TrendingItemProps = {
  rowValues: (string | null)[]
  entityIdColIndex: number
  nUniqueUsersColIndex: number
  egressSizeGbColIndex: number
}

const formatter = Intl.NumberFormat('en')

export const TrendingItem: React.FunctionComponent<TrendingItemProps> = ({
  rowValues,
  entityIdColIndex,
  nUniqueUsersColIndex,
  egressSizeGbColIndex,
}) => {
  const entityId = rowValues[entityIdColIndex]
  const egressSize = rowValues[egressSizeGbColIndex]
  const friendlyEgressSize = egressSize
    ? calculateFriendlyFileSize(parseFloat(egressSize) * 1e9)
    : ''

  const userCount = rowValues[nUniqueUsersColIndex]
  const friendlyUserCount = userCount
    ? formatter.format(parseInt(userCount))
    : ''

  return (
    <Box
      sx={{
        padding: '10px',
        marginBottom: '2px',
      }}
    >
      {/* TODO: get the entity header, and show the entity name here in color #D7DEE4
      {entityId && <EntityLink entity={entityId} />} */}
      <Box sx={{ display: 'flex', svg: { margin: '0 3px -3px 0' } }}>
        <Typography variant="smallText1" sx={{ color: '#D7DEE4' }}>
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.4668 4.04621C13.4668 4.99226 11.3029 5.75918 8.63347 5.75918C5.9641 5.75918 3.80014 4.99226 3.80014 4.04621M13.4668 4.04621C13.4668 3.10017 11.3029 2.33325 8.63347 2.33325C5.9641 2.33325 3.80014 3.10017 3.80014 4.04621M13.4668 4.04621V12.9537C13.4668 13.8997 11.3029 14.6666 8.63347 14.6666C5.9641 14.6666 3.80014 13.8997 3.80014 12.9537V4.04621M13.4668 8.49992C13.4668 9.42038 11.3029 10.1666 8.63347 10.1666C5.9641 10.1666 3.80014 9.42038 3.80014 8.49992"
              stroke="#71767F"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {friendlyEgressSize} &nbsp; • &nbsp;
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.767 4.83337C10.767 6.21409 9.64771 7.33337 8.26697 7.33337C6.88629 7.33337 5.767 6.21409 5.767 4.83337C5.767 3.45266 6.88629 2.33337 8.26697 2.33337C9.64771 2.33337 10.767 3.45266 10.767 4.83337Z"
              stroke="#71767F"
              stroke-linejoin="round"
            />
            <path
              d="M8.26599 9.33337C5.73561 9.33337 3.88863 11.0157 3.38039 13.2772C3.29425 13.6604 3.60546 14 3.9983 14H12.5337C12.9266 14 13.2378 13.6604 13.1517 13.2772C12.6434 11.0157 10.7964 9.33337 8.26599 9.33337Z"
              stroke="#71767F"
              stroke-linejoin="round"
            />
          </svg>
          Unique Users: {friendlyUserCount}
        </Typography>
      </Box>
    </Box>
  )
}
