import { CTASectionWrapper, PortalSectionHeader } from 'synapse-react-client'

function AMPALSPublishingRequirements() {
  const content = (
    <PortalSectionHeader
      centered
      reverseButtonAndText
      title="Publishing Requirements"
      summaryText={
        <>
          If you use AMP-ALS Knowledge Portal data in your manuscript, you must
          first submit it to us for review.
          {/* Todo */}
          {/* Use our {''}
          <Link
            href="https://example.com/path-to-publication-review-form"
            sx={{
              color: '#FFF !important',
              whiteSpace: 'nowrap',
              '&:hover': { textDecorationColor: '#FFF' },
            }}
          >
            publication review form
          </Link>{' '}
          to send your manuscript. */}
        </>
      }
      // Todo
      // buttonText="Learn more"
      // link="Resources/Publishing Requirements"
      sx={{
        h2: {
          color: 'primary.contrastText',
          fontSize: '24px',
          fontWeight: 600,
          borderColor: 'rgba(255, 255, 255, 0.40)',
        },
        '.MuiButton-root': {
          border: '1px solid rgba(255, 255, 255, 0.50)',
          boxShadow: 'none',
        },
        '& p': {
          fontSize: '16px',
          paddingBottom: '10px',
          color: 'primary.contrastText',
          width: '480px',
          lineHeight: '22.4px',
        },
      }}
    />
  )
  return <CTASectionWrapper content={content} themeMode="dark" />
}

export default AMPALSPublishingRequirements
