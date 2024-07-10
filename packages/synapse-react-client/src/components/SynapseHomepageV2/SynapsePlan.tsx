import React, { PropsWithChildren } from 'react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/material'

export type SynapsePlanProps = {
  title: string
  description: string
  ctaText: string
  ctaLink: string
  backgroundColor: string
}
export const SynapsePlan: React.FunctionComponent<
  PropsWithChildren<SynapsePlanProps>
> = ({ title, description, ctaText, ctaLink, backgroundColor, children }) => {
  return (
    <Box
      sx={{
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '373px',
        backgroundColor,
        boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.10)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          minHeight: '590px',
        }}
      >
        <Box>
          <Typography
            variant="headline1"
            sx={{
              fontWeight: 400,
              fontSize: '32px',
              lineHeight: '40px',
              textAlign: 'center',
              color: 'black',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              fontSize: '24px',
              textAlign: 'center',
              color: 'black',
              lineHeight: '34px',
            }}
          >
            {description}
          </Typography>
          {children}
        </Box>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: '100%' }}
          href={ctaLink}
        >
          {ctaText}
        </Button>
      </Box>
    </Box>
  )
}
