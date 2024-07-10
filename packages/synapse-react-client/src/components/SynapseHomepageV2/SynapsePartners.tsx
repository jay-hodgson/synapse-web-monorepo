import React from 'react'
import { Box } from '@mui/material'
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

export const SynapsePartners: React.FunctionComponent = () => {
  return (
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
  )
}
