import { Box, Chip, Link, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import ImageFromSynapseTable from '../ImageFromSynapseTable'
import { EastTwoTone } from '@mui/icons-material'
import { useInView } from 'react-intersection-observer'

export type SynapseInActionItemProps = {
  tableId: string
  friendlyName: string
  title: string
  description: string
  tags?: string[] | null
  logoFileHandleId: string
  link: string
  primaryColor: string
  secondaryColor: string
  onInView: () => void
}

export const SynapseInActionItem: React.FunctionComponent<
  SynapseInActionItemProps
> = ({
  tableId,
  friendlyName,
  title,
  description,
  tags,
  logoFileHandleId,
  link,
  onInView,
}) => {
  const { ref, inView } = useInView({ threshold: 0.9 }) //do not report this is in view until it is almost entirely shown (90%)
  useEffect(() => {
    if (inView) {
      onInView()
    }
  }, [inView])
  return (
    <Box
      sx={{
        padding: '15px',
      }}
      ref={ref}
    >
      <Box>
        {tags &&
          tags.map(tag => {
            return (
              <Chip
                key={tag}
                sx={{
                  marginRight: '5px',
                  color: '#38756A',
                  backgroundColor: '#DAE9E7',
                }}
                label={tag}
              />
            )
          })}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: '32px',
            lineHeight: '40px',
            marginTop: '32px',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '24px',
            marginTop: '32px',
            marginBottom: '32px',
          }}
        >
          {description}
        </Typography>
        <ImageFromSynapseTable
          tableId={tableId}
          fileHandleId={logoFileHandleId}
          friendlyName={`${friendlyName} logo`}
          style={{ height: '40px' }}
        />
        <Box sx={{ marginTop: '32px' }}>
          <Link href={link} target="_blank">
            View {friendlyName.endsWith('Portal') ? 'the' : ''} {friendlyName}{' '}
            <EastTwoTone sx={{ marginBottom: '-8px', marginLeft: '6px' }} />
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
