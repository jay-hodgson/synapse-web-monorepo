import { Box } from '@mui/material'
import React from 'react'
import { SynapseFeatureItem } from './SynapseFeatureItem'
import { ReactComponent as SeamlessIntegration } from '../../assets/homepage/seamless-integration-feature.svg'
import { ReactComponent as ResearchCredit } from '../../assets/homepage/research-credit-feature.svg'
import { ReactComponent as PrecisionGovernance } from '../../assets/homepage/precision-governance-feature.svg'
import { ReactComponent as PoweredBySynapse } from '../../assets/homepage/powered-by-synapse-feature.svg'
import { ReactComponent as GeneComparison } from '../../assets/homepage/gene-comparison-tool-feature.svg'
// import { ReactComponent as Explore } from '../../assets/homepage/explore-feature.svg'

import { useTheme, useMediaQuery } from '@mui/material'

export type SynapseFeaturesProps = {}

export const SynapseFeatures: React.FunctionComponent<
  SynapseFeaturesProps
> = ({}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isLg = useMediaQuery(theme.breakpoints.up('lg'))
  // TODO: If mobile, show image below feature items
  return (
    <Box sx={{ position: 'relative' }}>
      <SynapseFeatureItem
        icon={<SeamlessIntegration />}
        title="Seamless Integrations"
        description="Synapse provides you with APIs to access or query your data from your web browser, or programmatically  via R, Python, and the command line."
      />
      <SynapseFeatureItem
        icon={<ResearchCredit />}
        title="Research Credit"
        description="Synapse records and displays the provenance of your analysis at every step. Analyses, data and code can all be referenced through DOIs (Digital Object Identifiers)."
      />
      <SynapseFeatureItem
        icon={<PrecisionGovernance />}
        title="Precision Governance"
        description='Ethical openness is our top priority. Your sensitive data is safeguarded by a complete process of access controls, audits and privacy-enhancing technologies. Protect the data, protect the patient [Highlight "compliance" standards (HIPAA + fedRAMP)].'
      />
      <SynapseFeatureItem
        icon={<PoweredBySynapse />}
        title="Powered by Synapse"
        description="Synapse portals are the front door to innovation. Vibrant research communities exchange data, tools and ideas to accelerate biomedical progress."
      />
      <Box
        sx={{
          position: isMobile ? 'relative' : 'absolute',
          top: -120,
          right: isLg || isMobile ? 0 : -600,
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'right',
          zIndex: -1,
        }}
      >
        <Box>
          {/* TODO: Add CSS Transition, and timer to switch graphic, or is it by hovering over items?  Probably only mount this when inView */}
          {/* for our animation of layers, I think we will want to modify these values, eventually ending on the following:
     opacity: 1;
      filter: blur(0px);
      transform: translateZ(0px) translateX(0px); */}

          <GeneComparison />
        </Box>
      </Box>
    </Box>
  )
}
