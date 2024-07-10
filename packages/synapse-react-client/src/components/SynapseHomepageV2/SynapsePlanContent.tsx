import React from 'react'
import { Box, Typography } from '@mui/material'
import { ReactComponent as PlanItemIcon } from '../../assets/homepage/plan-item.svg'

export type SynapsePlanContentProps = {
  category: string
  items: string[]
  asteriskNote?: string
}
export const SynapsePlanContent: React.FunctionComponent<
  SynapsePlanContentProps
> = ({ category, items, asteriskNote }) => {
  return (
    <>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: '20px',
          marginTop: '30px',
          color: 'black',
        }}
      >
        {category}
      </Typography>
      {items.map(item => (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '30px auto',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
          <PlanItemIcon />
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '24px',
              color: 'black',
            }}
          >
            {item}
          </Typography>
        </Box>
      ))}
      {asteriskNote && (
        <Typography
          variant="body1"
          sx={{
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '20px',
            marginTop: '20px',
          }}
        >
          {asteriskNote}
        </Typography>
      )}
    </>
  )
}
