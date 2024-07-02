import { Box, Typography } from '@mui/material'
import React, { ReactElement } from 'react'

export type SynapseFeatureItemProps = {
  title: string
  description: string
  icon: ReactElement
}

export const SynapseFeatureItem: React.FunctionComponent<
  SynapseFeatureItemProps
> = ({ title, description, icon }) => {
  return (
    <Box sx={{ marginBottom: '50px', maxWidth: '437px' }}>
      <Box sx={{ height: '60px', marginBottom: '10px' }}>{icon}</Box>
      <Typography
        variant="headline3"
        sx={{
          color: 'black',
          fontSize: '24px',
          lineHeight: '32px',
          marginBottom: '5px',
        }}
      >
        {title}
      </Typography>
      <Typography variant="body1">{description}</Typography>
    </Box>
  )
}
