import React, { useEffect, useRef } from 'react'
import { Alert, Box, ListItem, ListItemText, Typography } from '@mui/material'
import { useTheme } from '@mui/material'
import { ColorPartial } from '@mui/material/styles/createPalette'
import { SkeletonParagraph } from '../Skeleton'
import { SmartToyTwoTone } from '@mui/icons-material'
import { SynapseSpinner } from '../LoadingScreen/LoadingScreen'
import MarkdownSynapse from '../Markdown/MarkdownSynapse'

export type SynapseChatInteractionProps = {
  userMessage: string
  progressMessage?: string
  chatResponseText?: string
  scrollIntoView?: boolean
  chatErrorReason?: string
}

export const SynapseChatInteraction: React.FunctionComponent<
  SynapseChatInteractionProps
> = ({
  userMessage,
  progressMessage,
  chatResponseText,
  chatErrorReason,
  scrollIntoView = false,
}) => {
  const theme = useTheme()
  const ref = useRef<HTMLLIElement | null>(null)
  useEffect(() => {
    // on mount, scroll into view if instructed
    if (scrollIntoView) {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [ref])

  return (
    <>
      <ListItem
        ref={ref}
        sx={{
          alignSelf: 'flex-end',
          backgroundColor: (theme.palette.secondary as ColorPartial)[100],
          borderRadius: '24px',
          maxWidth: '70%',
          display: 'block',
          mb: '5px',
          p: '8px 12px',
          wordWrap: 'break-word',
          width: 'auto',
        }}
      >
        <ListItemText primary={userMessage} />
      </ListItem>
      {chatResponseText && (
        <ListItem
          sx={{
            display: 'grid',
            gridTemplateColumns: '50px auto',
            columnGap: '0px',
            justifyItems: 'center',
            alignItems: 'start',
            p: '0px',
          }}
        >
          <Box
            sx={{
              p: '3px',
              mt: '10px',
              height: '31px',
              borderRadius: '50%',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderColor: 'grey.300',
            }}
          >
            <SmartToyTwoTone sx={{ color: 'secondary.main' }} />
          </Box>
          <Box
            sx={{
              borderRadius: '10px',
              padding: '10px',
              maxWidth: '100%',
            }}
          >
            <MarkdownSynapse markdown={chatResponseText} />
          </Box>
        </ListItem>
      )}
      {chatErrorReason && (
        <Alert severity={'error'} sx={{ my: 2 }}>
          {chatErrorReason}
        </Alert>
      )}
      {!chatResponseText && !chatErrorReason && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ textAlign: 'center' }} variant="body1Italic">
            {progressMessage ?? 'Processing...'}
          </Typography>
          <SynapseSpinner size={40} />
          <SkeletonParagraph numRows={3} />
        </Box>
      )}
    </>
  )
}

export default SynapseChatInteraction
