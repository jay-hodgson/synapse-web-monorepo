import { Box, Chip, Link, Typography } from '@mui/material'
import React from 'react'
import ImageFromSynapseTable from '../ImageFromSynapseTable'
import { EastTwoTone } from '@mui/icons-material'

export type SynapseInActionItemProps = {
  tableId: string
  friendlyName: string
  title: string
  description: string
  tags?: string[] | null
  imageFileHandleId: string
  logoFileHandleId: string
  link: string
  primaryColor: string
  secondaryColor: string
}

export const SynapseInActionItem: React.FunctionComponent<
  SynapseInActionItemProps
> = ({
  tableId,
  friendlyName,
  title,
  description,
  tags,
  imageFileHandleId,
  logoFileHandleId,
  link,
}) => {
  return (
    <Box
      sx={{
        padding: '15px',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <ImageFromSynapseTable
        tableId={tableId}
        fileHandleId={imageFileHandleId}
        style={{
          position: 'absolute',
          right: 0,
          top: -40,
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'right',
          zIndex: -1,
        }}
      />
      <Box sx={{ maxWidth: '530px' }}>
        {tags &&
          tags.map((tag, index) => {
            return (
              <Chip
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
        <Box sx={{ marginTop: '32px', marginBottom: '200px' }}>
          <Link href={link}>
            View {friendlyName.endsWith('Portal') ? 'the' : ''} {friendlyName}{' '}
            <EastTwoTone sx={{ marginBottom: '-8px', marginLeft: '6px' }} />
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
