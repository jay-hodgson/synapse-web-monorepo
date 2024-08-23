import React, { useState } from 'react'
import { ReactComponent as MaintenanceSvg } from '../../assets/icons/error_page/maintenance.svg'
import { ReactComponent as NoAccessSvg } from '../../assets/icons/error_page/no-access.svg'
import { ReactComponent as UnavailableSvg } from '../../assets/icons/error_page/unavailable.svg'
import { Box, Link, Typography } from '@mui/material'
import { useSynapseContext } from 'src/utils'
import SendMessageToEntityOwnerDialog from './SendMessageToEntityOwnerDialog'

export type ErrorPageProps = {
  type: SynapseErrorType
  message?: string // custom message to report
  entityId?: string
  gotoPlace: (href: string) => void
}

export enum SynapseErrorType {
  DOWN = 'DOWN',
  ACCESS_DENIED = 'ACCESS_DENIED',
  NOT_FOUND = 'NOT_FOUND',
}

const getImage = (type: SynapseErrorType) => {
  switch (type) {
    case SynapseErrorType.DOWN:
      return <MaintenanceSvg role="img" title={SynapseErrorType.DOWN} />
    case SynapseErrorType.ACCESS_DENIED:
      return <NoAccessSvg role="img" title={SynapseErrorType.ACCESS_DENIED} />
    case SynapseErrorType.NOT_FOUND:
      return <UnavailableSvg role="img" title={SynapseErrorType.NOT_FOUND} />
    default:
      return <></>
  }
}
const getTitle = (type: SynapseErrorType) => {
  switch (type) {
    case SynapseErrorType.DOWN:
      return 'Synapse is down for maintenance.'
    case SynapseErrorType.ACCESS_DENIED:
      return 'You don’t have permission to view this.'
    case SynapseErrorType.NOT_FOUND:
      return 'This page isn’t available.'
    default:
      return ''
  }
}

type ErrorPageAction = {
  linkText: string
  onClick: () => void
  description: string
}

const ErrorPage: React.FunctionComponent<ErrorPageProps> = props => {
  const { type, entityId, message, gotoPlace } = props
  const [isSendMessageToAdminDialogOpen, setSendMessageToAdminDialogOpen] =
    useState<boolean>(false)
  const { accessToken } = useSynapseContext()
  const isLoggedIn = !!accessToken
  const image = getImage(type)
  const title = getTitle(type)
  const messages: string[] = []
  const actions: ErrorPageAction[] = []

  switch (type) {
    case SynapseErrorType.ACCESS_DENIED:
      if (!isLoggedIn) {
        messages.push(
          'Try logging in. If you still see this message after logging in, you have not been granted access to view this resource.',
        )
        actions.push({
          linkText: 'Log in to Synapse',
          onClick: () => gotoPlace('/LoginPlace:0'),
          description:
            'Try logging in. If you still see this message after logging in, you have not been granted access to view this resource.',
        })
      } else {
        messages.push(
          'This account has not been granted access to view this resource. ',
        )
        if (!!entityId) {
          actions.push({
            linkText: 'Leave a message in the Help Forum',
            onClick: () => gotoPlace('/SynapseForum:default'),
            description:
              'Please remember that all messages left in the forum are public.',
          })
          actions.push({
            linkText: 'Contact the Administrator',
            onClick: () => {
              setSendMessageToAdminDialogOpen(true)
            },
            description:
              'Write a message to the owner of the resource asking for permission to view.',
          })
        }
      }
      break
    case SynapseErrorType.NOT_FOUND:
      messages.push(
        'The link you followed may be broken, or the page may have been removed.',
      )
  }
  if (message) {
    messages.push(message)
  }
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          columnGap: '80px',
          gridTemplateColumns: '40% 60%',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            justifySelf: 'end',
            alignSelf: 'center',
            '& svg': {
              height: '360px',
              maxWidth: '300px',
            },
          }}
        >
          {image}
        </Box>
        <Box
          sx={{
            justifySelf: 'start',
            alignSelf: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            mr: '100px',
          }}
        >
          <Typography sx={{ fontSize: '30px', fontWeight: 700 }}>
            {title}
          </Typography>
          {messages.map(message => {
            return (
              <Typography variant="body1" key={message}>
                {message}
              </Typography>
            )
          })}
          {actions.map(action => {
            const { onClick, linkText, description } = action
            return (
              <Box key={linkText}>
                <Link sx={{ fontSize: '16px' }} onClick={onClick}>
                  {linkText}
                </Link>
                <Typography variant="body1">{description}</Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
      {entityId && (
        <SendMessageToEntityOwnerDialog
          isOpen={isSendMessageToAdminDialogOpen}
          onHide={() => setSendMessageToAdminDialogOpen(false)}
          entityId={entityId}
        />
      )}
    </>
  )
}

export default ErrorPage
