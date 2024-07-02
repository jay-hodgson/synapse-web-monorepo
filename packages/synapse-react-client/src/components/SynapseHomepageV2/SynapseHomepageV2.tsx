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
  // useMediaQuery,
  // useTheme,
} from '@mui/material'
import SynapseFullLogo from '../../assets/icons/SynapseFullLogo'
import { TypeAnimation } from 'react-type-animation'
import { Search } from '../../assets/themed_icons'
import { useOneSageURL } from '../../utils/hooks'
import { ReactComponent as Image1 } from '../../assets/homepage/image1.svg'
import { ReactComponent as NihHeart } from '../../assets/homepage/nih-heart.svg'
import { ReactComponent as NihMental } from '../../assets/homepage/nih-mental.svg'
import { ReactComponent as Sloan } from '../../assets/homepage/sloan.svg'
import { ReactComponent as NihAging } from '../../assets/homepage/nih-aging.svg'
import { ReactComponent as Ctf } from '../../assets/homepage/ctf.svg'
import { ReactComponent as Ntap } from '../../assets/homepage/ntap.svg'
import { ReactComponent as Gff } from '../../assets/homepage/gff.svg'
import { ReactComponent as Nci } from '../../assets/homepage/nci.svg'
import { ReactComponent as NihCommonFund } from '../../assets/homepage/nih-common-fund.svg'
import { ReactComponent as Cri } from '../../assets/homepage/cri.svg'
import { ReactComponent as MlCommons } from '../../assets/homepage/ml-commons.svg'
import { ReactComponent as Gray } from '../../assets/homepage/gray.svg'
import { useSynapseContext } from '../../utils'
import { SynapseTrendingDatasets } from './SynapseTrendingDatasets'
import { SynapseByTheNumbers } from './SynapseByTheNumbers'
import { SynapseFeatures } from './SynapseFeatures'

export type SynapseHomepageV2Props = {}

const onSearch = (value: string) => {
  window.location.assign(`/Search:${encodeURIComponent(value)}`)
}
const past30DaysDownloadMetricsTable = 'syn61597084'
const generalStatsMetricsTable = 'syn61588163'

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
const MY_DASHBOARD_LINK = '/Profile:v'

export const SynapseHomepageV2: React.FunctionComponent<
  SynapseHomepageV2Props
> = ({}) => {
  const { accessToken } = useSynapseContext()
  const isSignedIn = !!accessToken
  const registrationLink = useOneSageURL('/register1')
  // const theme = useTheme()
  // const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const [searchValue, setSearchValue] = useState('')

  const navButtonSx: SxProps = {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 400,
  }
  const defaultHomepageText: SxProps = {
    color: '#172430',
    fontWeight: 600,
  }
  const titleSx: SxProps = {
    ...defaultHomepageText,
    fontWeight: 700,
    fontSize: '72px',
    lineHeight: '72px',
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
        {/* TODO: Add Hamburger mobile version of nav bar options */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Button sx={navButtonSx}>Portals</Button>
          {/* TODO: Place token should be passed to this component. Ability to show nav on a new Pricing page */}
          <Button sx={navButtonSx}>Pricing</Button>
          <Button sx={{ ...navButtonSx, marginRight: '15px' }}>
            Sage Bionetworks
          </Button>
          {isSignedIn && (
            <Button size="large" variant="contained" href={MY_DASHBOARD_LINK}>
              View My Dashboard
            </Button>
          )}
          {!isSignedIn && (
            <Button size="large" variant="outlined" href={LOGIN_LINK}>
              Login
            </Button>
          )}
          {!isSignedIn && (
            <Button
              size="large"
              variant="contained"
              href={registrationLink.toString()}
            >
              Register Now
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ backgroundColor: '#DAE9E7', padding: '80px 0px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="headline1" sx={titleSx}>
            Explore the data
          </Typography>
          <Typography variant="headline1" sx={titleSx}>
            behind&nbsp;
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'the next cure',
                3000,
                'the next diagnostic',
                3000,
                'the next preventive therapy',
                3000,
              ]}
              wrapper="span"
              speed={20}
              repeat={Infinity}
              style={{
                color: '#38756A',
              }}
            />
          </Typography>
        </Box>

        {/* Search */}
        {/* TODO: currated/hardcoded dropdown list of searches */}
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
                  <Search size={32} fill="#172430" />
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
            flexWrap: 'wrap',
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
              ...defaultHomepageText,
              textAlign: 'center',
              fontSize: '32px',
              lineHeight: '40px',
            }}
          >
            Synapse is your ecosystem for responsible data sharing, innovative
            data reuse, and collaboration.
          </Typography>
        </Box>
        <Box sx={{ maxWidth: '900px', margin: 'auto', marginTop: '60px' }}>
          <Image1 />
        </Box>
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            textAlign: 'center',
            marginTop: '100px',
            fontSize: '56px',
            lineHeight: '56px',
            letterSpacing: '-0.56px',
            marginBottom: '60px',
          }}
        >
          Our Partners
        </Typography>
        <Box sx={{ margin: 'auto', maxWidth: '1200px' }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <NihHeart />
            <NihMental />
            <Sloan />
            <NihAging />
            <Ctf />
            <Ntap />
            <Gff />
            <Nci />
            <NihCommonFund />
            <Cri />
            <MlCommons />
            <Gray />
          </Box>
        </Box>

        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            textAlign: 'center',
            marginTop: '150px',
            fontSize: '56px',
            lineHeight: '56px',
            letterSpacing: '-0.56px',
            marginBottom: '60px',
          }}
        >
          Synapse by the numbers
        </Typography>
        <Box sx={{ margin: 'auto', maxWidth: '750px' }}>
          <SynapseByTheNumbers metricsTable={generalStatsMetricsTable} />
          <Typography
            variant="headline2"
            sx={{
              ...defaultHomepageText,
              textAlign: 'center',
              fontSize: '32px',
              lineHeight: '40px',
              marginTop: '60px',
              marginBottom: '25px',
            }}
          >
            Datasets trending this week
          </Typography>
          <SynapseTrendingDatasets
            past30DaysDownloadMetricsTable={past30DaysDownloadMetricsTable}
          />
        </Box>
      </Box>
      <Box sx={{ marginLeft: '20px' }}>
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            marginTop: '100px',
            fontSize: '56px',
            lineHeight: '56px',
            letterSpacing: '-0.56px',
          }}
        >
          Features
        </Typography>
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            fontSize: '32px',
            lineHeight: '40px',
            maxWidth: '1156px',
            marginBottom: '30px',
          }}
        >
          Synapse is the open-source research collaboration platform by Sage
          Bionetworks, tailored for biomedical data reuse and discovery.
        </Typography>
        <SynapseFeatures />
      </Box>

      <Box sx={{ marginLeft: '20px' }}>
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            marginTop: '150px',
            fontSize: '40px',
            lineHeight: '48px',
          }}
        >
          Featured datasets
        </Typography>
        {/* TODO: Add Featured datasets based on a collection (and maybe MV) */}
      </Box>
      <Box>
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            textAlign: 'center',
            marginTop: '150px',
            fontSize: '56px',
            lineHeight: '56px',
            letterSpacing: '-0.56px',
            marginBottom: '60px',
          }}
        >
          Synapse in action
        </Typography>
        <Box sx={{ margin: 'auto', maxWidth: '1100px' }}>
          <Typography
            variant="headline1"
            sx={{
              ...defaultHomepageText,
              textAlign: 'center',
              marginTop: '50px',
              fontSize: '32px',
              lineHeight: '40px',
              marginBottom: '60px',
            }}
          >
            Explore real-world case studies and success stories showcasing how
            researchers use Synapse to drive innovative biomedical discoveries
            and improve health outcomes.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SynapseHomepageV2
