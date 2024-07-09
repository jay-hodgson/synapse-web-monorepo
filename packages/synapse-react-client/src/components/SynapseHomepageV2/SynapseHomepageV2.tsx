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
import { ReactComponent as SageLogo } from '../../assets/logos/sage-logo.svg'
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
import { SynapseInAction } from './SynapseInAction'
import { backgroundInlinePng } from '../../assets/homepage/header-splash'

export type SynapseHomepageV2Props = {}

const onSearch = (value: string) => {
  window.location.assign(`/Search:${encodeURIComponent(value)}`)
}
const synapseInActionTable = 'syn61670075'
const past30DaysDownloadMetricsTable = 'syn61597084'
const generalStatsMetricsTable = 'syn61588163'

const popularSearches = [
  "Alzheimer's Disease",
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
  const resourcesLink = useOneSageURL('/sageresources')

  const [searchValue, setSearchValue] = useState('')

  // TODO: Mount query-based components when getting closer to the component (optimization)
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
    fontWeight: 300,
    fontSize: '72px',
    lineHeight: '82px',
    color: 'white',
  }

  // Some sections have an angled cut in the separators.  Use these clip paths
  const desktopLowerClipPath = 'polygon(0 0, 100% 0, 100% 65%, 0% 100%)'

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
          <Button
            sx={navButtonSx}
            href={resourcesLink.toString()}
            target="_blank"
          >
            Portals
          </Button>
          <Button
            sx={{ ...navButtonSx, marginRight: '15px' }}
            href="https://sagebionetworks.org/"
            target="_blank"
          >
            Sage Bionetworks
          </Button>
          {isSignedIn && (
            <Button
              size="large"
              variant="contained"
              color="secondary"
              href={MY_DASHBOARD_LINK}
            >
              View My Dashboard
            </Button>
          )}
          {!isSignedIn && (
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              href={LOGIN_LINK}
            >
              Login
            </Button>
          )}
          {!isSignedIn && (
            <Button
              size="large"
              variant="contained"
              color="secondary"
              href={registrationLink.toString()}
            >
              Register Now
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ position: 'relative', paddingBottom: '80px' }}>
        <Box
          sx={{
            position: 'absolute',
            background: `linear-gradient(0deg, rgba(23, 36, 48, 0.75) 0%, rgba(23, 36, 48, 0.75) 100%), url(${backgroundInlinePng}) lightgray 50% / cover no-repeat`,
            minHeight: '600px',
            width: '100%',
            height: '100%',
            content: "''",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: -1,
            clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0% 100%)',
          }}
        >
          {' '}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', paddingTop: '80px' }}>
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
              color: '#B5D3CE',
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
        {popularSearches.map(value => {
          return (
            <Chip
              label={value}
              onClick={() => onSearch(value)}
              variant="outlined"
              sx={{ color: '#2A5850', backgroundColor: '#DAE9E7' }}
            />
          )
        })}
      </Box>
      {/* TODO: This Grid is mobile unfriendly (see the image).  */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '50% 50%',
          backgroundColor: '#DAE9E7',
          marginTop: '150px',
        }}
      >
        <Box sx={{ padding: '70px 0px 25px 60px' }}>
          <SageLogo style={{ height: '60px', marginLeft: '-100px' }} />
          <Typography
            variant="headline2"
            sx={{
              ...defaultHomepageText,
              fontSize: '40px',
              lineHeight: '60px',
              maxWidth: '600px',
              color: '#38756A',
              marginTop: '20px',
              fontWeight: 400,
              marginBottom: '35px',
            }}
          >
            Created by <strong>Sage Bionetworks</strong>, Synapse is your
            ecosystem for responsible data sharing, innovative data reuse, and
            collaboration.
          </Typography>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            href="https://www.sagebionetworks.org"
            target="_blank"
          >
            About Sage Bionetworks
          </Button>
        </Box>
        <Box sx={{ height: '100%', justifySelf: 'end' }}>
          <Image1 />
        </Box>
      </Box>
      <Box>
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            textAlign: 'center',
            marginTop: '100px',
            fontSize: '40px',
            lineHeight: '72px',
            letterSpacing: '-0.56px',
          }}
        >
          We partner with scientific leaders
        </Typography>
        <Box sx={{ margin: 'auto', maxWidth: '750px' }}>
          <Typography
            variant="headline1"
            sx={{
              ...defaultHomepageText,
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: 400,
              marginBottom: '60px',
              lineHeight: '34px',
            }}
          >
            Synapse is your ecosystem for responsible data sharing, innovative
            data reuse, and collaboration.
          </Typography>
        </Box>
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
        <Box
          sx={{
            paddingBottom: '220px',
            clipPath: 'polygon(0 0, 100% 0, 100% 20%, 0% 100%)',
            backgroundColor: 'white',
            zIndex: 100,
          }}
        />
        <Box
          sx={{
            backgroundColor: '#223549',
            paddingTop: '200px',
            marginTop: '-200px',
            paddingLeft: '50px',
            paddingRight: '50px',
            paddingBottom: '5px',
          }}
        >
          <Typography
            variant="headline1"
            sx={{
              ...defaultHomepageText,
              textAlign: 'center',
              marginTop: '100px',
              fontSize: '52px',
              lineHeight: '62px',
              marginBottom: '60px',
              color: 'white',
            }}
          >
            Synapse by the numbers
          </Typography>
          <SynapseByTheNumbers metricsTable={generalStatsMetricsTable} />
          <Typography
            variant="headline2"
            sx={{
              ...defaultHomepageText,
              textAlign: 'center',
              fontSize: '36px',
              lineHeight: '40px',
              marginTop: '60px',
              marginBottom: '25px',
              color: 'white',
            }}
          >
            Datasets trending this week
          </Typography>
          <SynapseTrendingDatasets
            past30DaysDownloadMetricsTable={past30DaysDownloadMetricsTable}
          />
        </Box>
        <Box
          sx={{
            paddingBottom: '220px',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 0%)',
            backgroundColor: '#223549',
            zIndex: 100,
          }}
        />
      </Box>
      <Box
        sx={{
          paddingTop: '300px',
          marginTop: '-220px',
          backgroundColor: '#172430',
        }}
      />

      <Box
        sx={{
          backgroundColor: '#172430',
          paddingLeft: '70px',
        }}
      >
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            fontSize: '52px',
            lineHeight: '62px',
            color: 'white',
            maxWidth: '700px',
            paddingBottom: '100px',
          }}
        >
          Made for biomedical data reuse and discovery
        </Typography>
        <SynapseFeatures />
      </Box>
      <Box sx={{ marginLeft: '20px' }}>
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            textAlign: 'center',
            paddingTop: '75px',
            paddingBottom: '75px',
            fontSize: '40px',
            lineHeight: '48px',
          }}
        >
          Featured datasets
        </Typography>
        {/* TODO: Add Featured datasets based on a collection (and maybe MV) */}
      </Box>
      <Box
        sx={{
          paddingBottom: '190px',
          clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)',
          backgroundColor: '#f5f9f9',
          zIndex: -100,
          marginTop: '-190px',
          position: 'relative',
        }}
      />
      <Box
        sx={{
          backgroundColor: '#f5f9f9',
        }}
      >
        <Typography
          variant="headline1"
          sx={{
            ...defaultHomepageText,
            textAlign: 'center',
            paddingTop: '75px',
            fontSize: '56px',
            lineHeight: '56px',
            letterSpacing: '-0.56px',
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
              fontSize: '24px',
              lineHeight: '34px',
              marginBottom: '100px',
              fontWeight: 400,
            }}
          >
            Explore real-world case studies and success stories showcasing how
            researchers use Synapse to drive innovative biomedical discoveries
            and improve health outcomes.
          </Typography>
        </Box>
        <SynapseInAction tableId={synapseInActionTable} />
      </Box>
    </Box>
  )
}

export default SynapseHomepageV2
