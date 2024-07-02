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
import { ReactComponent as TotalDataPlot } from '../../assets/homepage/total-data-static-plot.svg'
import { ReactComponent as TotalDownloadsPlot } from '../../assets/homepage/total-downloads-static-plot.svg'
import { ReactComponent as ActiveUsersPlot } from '../../assets/homepage/active-users-static-plot.svg'
import { SynapseByTheNumbersItem } from './SynapseByTheNumbersItem'
import { useGetQueryResultBundleWithAsyncStatus } from '../../synapse-queries'
import { BUNDLE_MASK_QUERY_RESULTS } from '../../utils/SynapseConstants'
import { TrendingItem } from './TrendingItem'
import { useSynapseContext } from '../../utils'

export type SynapseHomepageV2Props = {}

const onSearch = (value: string) => {
  window.location.assign(`/Search:${encodeURIComponent(value)}`)
}
const past30DaysDownloadMetricsTable = 'syn55382267'
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
  const { data: past30DaysDownloadData } =
    useGetQueryResultBundleWithAsyncStatus({
      entityId: past30DaysDownloadMetricsTable,
      query: {
        sql: `SELECT * FROM ${past30DaysDownloadMetricsTable}`,
        limit: 10,
        sort: [
          { column: 'export_date', direction: 'DESC' }, // First sort by export date desc (only the most recent export)
          { column: 'n_unique_users', direction: 'DESC' }, // TODO: Is this the correct secondary sort?
        ],
      },
      partMask: BUNDLE_MASK_QUERY_RESULTS,
      concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
    })

  const rowSet = past30DaysDownloadData?.responseBody?.queryResult?.queryResults
  const headers = rowSet?.headers
  const entityIdColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'project_id',
  )!
  const nDownloadsColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'n_downloads',
  )!
  const nUniqueUsersColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'n_unique_users',
  )!
  const egressSizeColIndex = headers?.findIndex(
    selectColumn => selectColumn.name == 'egress_size_in_b',
  )!

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
                ' the next cure',
                2500, // wait 1s before replacing
                // TODO: replace with real values
                ' the golden goose',
                2500,
                ' AI magic',
                2500,
                ' the best pickles',
                2500,
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
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* TODO: query for these numbers */}
            <SynapseByTheNumbersItem
              title={'2.71 Petabytes'}
              description={'Total data'}
              plot={<TotalDataPlot />}
            />
            <SynapseByTheNumbersItem
              title={'4,400'}
              description={'Active users per month'}
              plot={<ActiveUsersPlot />}
            />
            <SynapseByTheNumbersItem
              title={'46,827'}
              description={'Total downloads per month'}
              plot={<TotalDownloadsPlot />}
            />
          </Box>
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
          {rowSet &&
            rowSet.rows.map(row => (
              <TrendingItem
                rowValues={row.values}
                entityIdColIndex={entityIdColIndex}
                nDownloadsColIndex={nDownloadsColIndex}
                egressSizeColIndex={egressSizeColIndex}
                nUniqueUsersColIndex={nUniqueUsersColIndex}
              />
            ))}
        </Box>
      </Box>

      {/* for our animation of layers, I think we will want to modify these values, eventually ending on the following:
     opacity: 1;
      filter: blur(0px);
      transform: translateZ(0px) translateX(0px); */}
    </Box>
  )
}

export default SynapseHomepageV2
