import { HeaderContext } from '@tanstack/react-table'
import { Box, IconButton, Tooltip } from '@mui/material'
import { HelpTwoTone } from '@mui/icons-material'
import IconSvg from '../IconSvg'
import React from 'react'

type ColumnHeaderProps = {
  title?: React.ReactNode
  helpText?: React.ReactNode
  additionalButtons?: React.ReactNode

  // TODO: Replace with props that can be passed to a reusable filter control
  filterControl?: React.ReactNode
}

/**
 * Styled table column header component for use with @tanstack/react-table, with extra optional props for additional
 * UI features
 */
export default function ColumnHeader<TData = unknown, TValue = unknown>(
  props: ColumnHeaderProps & HeaderContext<TData, TValue>,
) {
  const {
    column,
    title = props.column.id,
    helpText,
    filterControl,
    additionalButtons,
  } = props

  return (
    <Box
      display={'flex'}
      alignContent={'center'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <span
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>
      <Box
        role={'menubar'}
        display={'flex'}
        alignItems="center"
        sx={{
          height: '22px',
          ml: 2,
          gap: 0.25,
        }}
      >
        {helpText && (
          <Tooltip title={helpText} placement={'top'}>
            <IconButton size={'small'}>
              <HelpTwoTone fontSize={'inherit'} />
            </IconButton>
          </Tooltip>
        )}
        {column.getCanFilter() && filterControl}
        {column.getCanSort() && (
          <Tooltip title={`Sort by ${title}`} placement={'top'}>
            <IconButton
              role="button"
              size={'small'}
              aria-label={`Sort by ${title}`}
              tabIndex={0}
              onKeyPress={() => column.toggleSorting()}
              onClick={() => column.toggleSorting()}
            >
              <IconSvg
                icon={column.getIsSorted() === 'asc' ? 'sortUp' : 'sortDown'}
                wrap={false}
                sx={{
                  color: column.getIsSorted() ? 'primary.main' : 'grey.700',
                  backgroundColor: 'none',
                }}
              />
            </IconButton>
          </Tooltip>
        )}
        {additionalButtons}
      </Box>
    </Box>
  )
}
