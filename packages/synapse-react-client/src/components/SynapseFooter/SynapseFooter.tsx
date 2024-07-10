import React from 'react'
import SynapseClient from '../../synapse-client'
import { useSynapseContext } from '../../utils'
import { useOneSageURL } from '../../utils/hooks/useOneSageURL'
import { Box, Button, Typography } from '@mui/material'
import SynapseFullLogo from '../../assets/icons/SynapseFullLogo'
import SageFullLogo from 'src/assets/icons/SageFullLogo'
import { SynapseLinksColumn } from './SynapseLinksColumn'
import { ReactComponent as Github } from '../../assets/homepage/github.svg'
import { ReactComponent as Twitter } from '../../assets/homepage/twitter.svg'
import { ReactComponent as LinkedIn } from '../../assets/homepage/linkedin.svg'
import { ReactComponent as Facebook } from '../../assets/homepage/facebook.svg'
import { ReactComponent as Instagram } from '../../assets/homepage/instagram.svg'
import { ReactComponent as Youtube } from '../../assets/homepage/youtube.svg'
import ExperimentalMode from '../ExperimentalMode'

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
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
            rowGap: '50px',
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
                  sx={{
                    color: '#B0BDC9',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
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
                  sx={{
                    color: '#B0BDC9',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
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
            <Box
              sx={{
                display: 'flex',
                columnGap: '40px',
                rowGap: '40px',
                flexWrap: 'wrap',
              }}
            >
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
            rowGap: '40px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              columnGap: '20px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
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
          <Box
            sx={{
              display: 'flex',
              columnGap: '15px',
              svg: {
                '&:hover': {
                  stroke: 'rgba(255, 255, 255, .4)',
                  // fill: 'rgba(245, 246, 241, .05)',
                  cursor: 'pointer',
                },
              },
            }}
          >
            <a href="https://github.com/Sage-Bionetworks" target="_blank">
              <Github />
            </a>
            <a href="https://twitter.com/sagebio" target="_blank">
              <Twitter />
            </a>
            <a
              href="https://www.linkedin.com/company/sage-bionetworks"
              target="_blank"
            >
              <LinkedIn />
            </a>
            <a href="https://www.facebook.com/sagebionetworks/" target="_blank">
              <Facebook />
            </a>
            <a
              href="https://www.instagram.com/sagebionetworks/"
              target="_blank"
            >
              <Instagram />
            </a>
            <a
              href="https://www.youtube.com/channel/UCiWTMRdO82wNq6o8JOs3WzQ"
              target="_blank"
            >
              <Youtube />
            </a>
          </Box>
        </Box>
      </Box>
      {/* Versions and experimental mode */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          backgroundColor: '#121B23',
          alignItems: 'center',
          padding: '15px 50px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '40px',
            rowGap: '0px',
            color: '##889BAF',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '14px',
            }}
          >
            portal: {portalVersion}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '14px',
            }}
          >
            synapse-react-client: {srcVersion}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '14px',
            }}
          >
            repo: {repoVersion}
          </Typography>
        </Box>
        <ExperimentalMode />
      </Box>
    </Box>
  )
}
