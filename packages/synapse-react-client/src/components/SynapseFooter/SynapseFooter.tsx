import React from 'react'
import SynapseClient from '../../synapse-client'
import { useSynapseContext } from '../../utils'
import { useOneSageURL } from '../../utils/hooks/useOneSageURL'
import { Box, Typography } from '@mui/material'
import SynapseFullLogo from '../../assets/icons/SynapseFullLogo'

export type SynapseFooterProps = {
  portalVersion: string
  srcVersion: string
  repoVersion: string
  signoutCallback?: () => void
  gotoPlace: (href: string) => void
}

export const SynapseFooter: React.FunctionComponent<SynapseFooterProps> = ({
  portalVersion,
  srcVersion,
  repoVersion,
  signoutCallback,
  gotoPlace,
}) => {
  const { accessToken } = useSynapseContext()
  const registrationUrl = useOneSageURL('/register1')
  const isLoggedIn = !!accessToken

  const signOut = async () => {
    if (signoutCallback) {
      signoutCallback()
    } else {
      await SynapseClient.signOut()
      window.location.reload()
    }
  }

  const onLogin = () => {
    gotoPlace(`/Login:0`)
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateRows: 'auto 70px' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          backgroundColor: '#172430',
          padding: '50px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <SynapseFullLogo textColor="white" />
          <Typography
            variant="body1Italic"
            sx={{ color: '#B0BDC9', fontSize: '13px' }}
          >
            Powered by Sage Bionetworks
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontSize: '32px',
              lineHeight: '46px',
              fontWeight: 400,
              marginTop: '25px',
            }}
          >
            Sign up for Synapse today
          </Typography>
        </Box>
        <Box></Box>
      </Box>
      {/* Versions and experimental mode */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          backgroundColor: '#121B23',
        }}
      ></Box>
    </Box>
  )
}
