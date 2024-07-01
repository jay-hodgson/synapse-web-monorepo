import React, { useState } from 'react'
import {
  Box,
  Button,
  SxProps,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Chip,
} from '@mui/material'
import SynapseFullLogo from '../../assets/icons/SynapseFullLogo'
import { TypeAnimation } from 'react-type-animation'
import { Search } from '../../assets/themed_icons'
import { useOneSageURL } from '../../utils/hooks'

export type SynapseHomepageV2Props = {}

const onSearch = (value: string) => {
  window.location.assign(`/Search:${encodeURIComponent(value)}`)
}

export const SynapseHomepageV2: React.FunctionComponent<
  SynapseHomepageV2Props
> = ({}) => {
  const popularSearches = [
    'Alzheimer',
    'Parkinson',
    'Neurofibromatosis',
    'HTAN',
    'ukb-ppp',
    'ROSMAP',
    'GENIE',
  ]
  const LOGIN_LINK = '/LoginPlace:0'
  const registrationLink = useOneSageURL('/register1')

  const [searchValue, setSearchValue] = useState('')

  const navButtonSx: SxProps = {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 400,
  }
  const titleSx: SxProps = {
    fontWeight: 700,
    fontSize: '72px',
    lineHeight: '72px',
    color: '#172430',
  }
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
          <Button sx={navButtonSx}>Explore Portals</Button>
          <Button sx={navButtonSx}>Pricing</Button>
          <Button sx={{ ...navButtonSx, marginRight: '15px' }}>
            Sage Bionetworks
          </Button>
          <Button size="large" variant="outlined" href={LOGIN_LINK}>
            Login
          </Button>
          <Button
            size="large"
            variant="contained"
            href={registrationLink.toString()}
          >
            Register Now
          </Button>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: '#DAE9E7', padding: '80px 0px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="headline1" sx={titleSx}>
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
            <Typography variant="headline1" sx={titleSx}>
              behind
            </Typography>
            <Typography
              variant="headline1"
              sx={{ ...titleSx, color: '#38756A' }}
            >
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  'the next cure',
                  2500, // wait 1s before replacing
                  'the golden goose',
                  2500,
                  'AI magic',
                  2500,
                  'the best pickles',
                  2500,
                ]}
                wrapper="span"
                speed={20}
                repeat={Infinity}
              />
            </Typography>
          </Box>
        </Box>

        {/* Search */}
        <Box
          sx={{
            paddingTop: '70px',
            maxWidth: '600px',
            margin: 'auto',
          }}
        >
          <FormControl fullWidth sx={{ m: 1 }}>
            <OutlinedInput
              startAdornment={
                <InputAdornment
                  position="start"
                  sx={{ marginLeft: '20px', marginRight: '18px' }}
                >
                  <Search size={24} />
                </InputAdornment>
              }
              placeholder="Search Synapse"
              sx={{ fontSize: '24px', borderRadius: 96.6 }}
              onSubmit={() => onSearch(searchValue)}
              onChange={event => setSearchValue(event.target.value)}
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '30px',
          }}
        >
          <Typography variant="body1">Popular Searches:</Typography>
          {popularSearches.map(value => {
            return (
              <Chip
                label={value}
                onClick={() => onSearch(value)}
                variant="outlined"
                sx={{ borderColor: '#6BA89D' }}
              />
            )
          })}
        </Box>
        <Box
          sx={{
            maxWidth: '800px',
            margin: 'auto',
            marginTop: '50px',
          }}
        >
          <Typography
            variant="headline2"
            sx={{
              textAlign: 'center',
              fontSize: '32px',
              lineHeight: '40px',
              color: '#172430',
              fontWeight: 600,
            }}
          >
            Synapse is your ecosystem for responsible data sharing, innovative
            data reuse, and collaboration.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SynapseHomepageV2
