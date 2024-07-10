import React from 'react'
import { Box } from '@mui/material'
import { SynapsePlan } from './SynapsePlan'
import { SynapsePlanContent } from './SynapsePlanContent'

export const SynapsePlans: React.FunctionComponent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <SynapsePlan
        title="Free"
        description="Our basic plan"
        ctaText="Register Now"
        ctaLink="https://accounts.synapse.org/register1"
        backgroundColor="#f5f9f9"
      >
        <SynapsePlanContent
          category="Explore Data"
          items={[
            '<100 GB of content',
            'Sage managed shared storage',
            '4TB/year of data egress',
          ]}
        />
        <SynapsePlanContent
          category="Free Synapse Features"
          items={[
            'DOIs for publications & grants*',
            'Online documentation & tutorials*',
            'Project wikis*',
            'Discussion forums*',
          ]}
          asteriskNote="*Items are included in all plans"
        />
      </SynapsePlan>
      <SynapsePlan
        title="Managed"
        description="Our upgraded plan"
        ctaText="Contact us"
        ctaLink="https://sagebionetworks.jira.com/servicedesk/customer/portal/9/group/26/create/162"
        backgroundColor="#e9f2f1"
      >
        <SynapsePlanContent
          category="Explore More Data"
          items={[
            '<500 GB of content',
            'Secure cloud storage',
            '<20 TB/year of data egress',
          ]}
        />
        <SynapsePlanContent
          category="More Synapse Features"
          items={[
            'Project assistance',
            'Governance consulting',
            'NIH Data Management Sharing Plan Support',
            'Help Desk Support',
            'Sharing Content Through Controlled Access',
          ]}
        />
      </SynapsePlan>
      <SynapsePlan
        title="Data Coordination"
        description="Our customized plan"
        ctaText="Contact us"
        ctaLink="https://sagebionetworks.jira.com/servicedesk/customer/portal/9/group/26/create/162"
        backgroundColor="#dae9e7"
      >
        <SynapsePlanContent
          category="Explore the Most Data"
          items={[
            'Unlimited data allowance',
            'Custom data storage locations',
            'Fully managed project set up, access and documentation',
            'Tailor-made portal interface',
            'Data integration with existing tools and workflows',
            'Customized governance support',
            'Dedicated Sage Bionetworks point of contact',
            'Unlimited end-to-end support',
          ]}
        />
      </SynapsePlan>
    </Box>
  )
}
