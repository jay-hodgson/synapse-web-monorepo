import React from 'react'
import { Box, Button, Link, Typography } from '@mui/material'
import SynapseFullLogo from '../../assets/icons/SynapseFullLogo'
import { TypeAnimation } from 'react-type-animation'

export type SynapseHomepageV2Props = {}

export const SynapseHomepageV2: React.FunctionComponent<
  SynapseHomepageV2Props
> = ({}) => {
  return (
    <Box>
      {/* Top nav bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 15px',
        }}
      >
        {/* Logo */}
        <SynapseFullLogo textColor="#0B1218" />
        {/* Menu Items */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Link>Solutions</Link>
          <Link>Pricing</Link>
          <Link sx={{ paddingRight: '15px' }}>Sage Bionetworks</Link>
          <Button variant="outlined">Login</Button>
          <Button variant="contained">Register Now</Button>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: '#DAE9E7', padding: '80px 0px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="headline1"
            sx={{ fontSize: '72px', lineHeight: '72px', color: '#172430' }}
          >
            Explore the data
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              width: '900px',
              margin: 'auto',
            }}
          >
            <Typography
              variant="headline1"
              sx={{ fontSize: '72px', lineHeight: '72px', color: '#172430' }}
            >
              behind
            </Typography>
            <Typography
              variant="headline1"
              sx={{ fontSize: '72px', lineHeight: '72px', color: '#38756A' }}
            >
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  'the next cure',
                  2000, // wait 1s before replacing
                  'the golden goose',
                  2000,
                  'AI magic',
                  2000,
                  'the best pickles',
                  2000,
                ]}
                wrapper="span"
                speed={20}
                repeat={Infinity}
              />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SynapseHomepageV2
