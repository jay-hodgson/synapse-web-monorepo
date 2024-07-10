import React from 'react'
import SynapseClient from '../../synapse-client'
import { useSynapseContext } from '../../utils'
import { useOneSageURL } from '../../utils/hooks/useOneSageURL'
import { Box, Button, Typography } from '@mui/material'
import SynapseFullLogo from '../../assets/icons/SynapseFullLogo'
import SageFullLogo from 'src/assets/icons/SageFullLogo'
import { SynapseLinksColumn } from './SynapseLinksColumn'

export type SynapseFooterProps = {
  portalVersion: string
  srcVersion: string
  repoVersion: string
  signoutCallback?: () => void
  gotoPlace: (href: string) => void
  reportViolationCallback: () => void
}

const currentYear = new Date().getFullYear()
export const SynapseFooter: React.FunctionComponent<SynapseFooterProps> = ({
  portalVersion,
  srcVersion,
  repoVersion,
  signoutCallback,
  gotoPlace,
  reportViolationCallback,
}) => {
  const { accessToken } = useSynapseContext()
  const registrationUrl = useOneSageURL('/register1')
  const sageResourcesUrl = useOneSageURL('/sageresources')

  const isLoggedIn = !!accessToken

  const signOut = async () => {
    if (signoutCallback) {
      signoutCallback()
    } else {
      await SynapseClient.signOut()
      window.location.reload()
    }
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateRows: 'auto 70px' }}>
      <Box
        sx={{
          backgroundColor: '#172430',
          padding: '50px 50px 20px 50px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <SynapseFullLogo textColor="white" />
            <Typography
              variant="body1Italic"
              sx={{ color: '#B0BDC9', fontSize: '13px', marginBottom: '25px' }}
            >
              Powered by Sage Bionetworks
            </Typography>
            {!isLoggedIn && (
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontSize: '32px',
                  lineHeight: '46px',
                  fontWeight: 400,
                  marginBottom: '30px',
                }}
              >
                Sign up for Synapse today
              </Typography>
            )}
            {!isLoggedIn && (
              <Box sx={{ display: 'flex', columnGap: '20px' }}>
                <Button
                  variant="outlined"
                  sx={{ color: 'white' }}
                  onClick={() => {
                    gotoPlace('/LoginPlace:0')
                  }}
                >
                  Login to Synapse
                </Button>
                <Button
                  variant="contained"
                  color="light"
                  href={registrationUrl.toString()}
                >
                  Register Now
                </Button>
              </Box>
            )}
            {isLoggedIn && (
              <Box sx={{ display: 'flex', columnGap: '20px' }}>
                <Button
                  variant="outlined"
                  sx={{ color: 'white' }}
                  onClick={signOut}
                >
                  Sign out
                </Button>
                <Button
                  variant="contained"
                  color="light"
                  onClick={() => {
                    gotoPlace('/Profile:v')
                  }}
                >
                  View My Dashboard
                </Button>
              </Box>
            )}
          </Box>
          <Box>
            <Box sx={{ display: 'flex', columnGap: '40px' }}>
              <SynapseLinksColumn
                category="Synapse"
                synapseLinks={[
                  {
                    text: 'Contact Us',
                    props: {
                      href: 'https://sagebionetworks.jira.com/servicedesk/customer/portal/9',
                    },
                  },
                  {
                    text: 'Pricing',
                    props: {
                      href: 'https://help.synapse.org/docs/Sage-Offerings.2965078125.html',
                    },
                  },
                  {
                    text: 'Data Portals',
                    props: { href: sageResourcesUrl.toString() },
                  },
                  {
                    text: 'Donate',
                    props: { href: 'https://sagebionetworks.org/donate' },
                  },
                ]}
              />
              {/* TODO fill in link URLs */}
              <SynapseLinksColumn
                category="Resources"
                synapseLinks={[
                  {
                    text: 'Blog',
                    props: { href: '' },
                  },
                  {
                    text: "FAQ's",
                    props: { href: '' },
                  },
                  {
                    text: 'Documentation',
                    props: { href: 'https://help.synapse.org/docs/' },
                  },
                ]}
              />
              <SynapseLinksColumn
                category="Sage Bionetworks"
                synapseLinks={[
                  {
                    text: 'Sage Home Page',
                    props: { href: 'https://sagebionetworks.org/' },
                  },
                  {
                    text: 'Creative Commons License',
                    props: { href: '' },
                  },
                  {
                    text: 'Report Violations',
                    props: { onClick: reportViolationCallback },
                  },
                ]}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '60px',
          }}
        >
          <Box
            sx={{ display: 'flex', columnGap: '20px', alignItems: 'center' }}
          >
            <SageFullLogo textColor="white" width={285} />
            <Typography
              variant="body1"
              sx={{
                color: '#B0BDC9',
                fontSize: '18px',
              }}
            >
              © Sage Bionetworks {currentYear}
            </Typography>
          </Box>
          <Box>social media links</Box>
        </Box>
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
