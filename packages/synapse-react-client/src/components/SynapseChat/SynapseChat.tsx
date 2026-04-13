import { ChatState, useChatState } from '@/components/SynapseChat/useChatState'
import {
  useCreateAgentSession,
  useUpdateAgentSession,
} from '@/synapse-queries/chat/useChat'
import { useSynapseContext } from '@/utils'
import { ArrowUpward } from '@mui/icons-material'
import {
  Alert,
  Box,
  IconButton,
  List,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { Color } from '@mui/material/styles'
import { GridAgentSessionContext } from '@sage-bionetworks/synapse-client'
import {
  AgentAccessLevel,
  AgentSession,
  TraceEvent,
} from '@sage-bionetworks/synapse-types'
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { SkeletonParagraph } from '../Skeleton'
import { displayToast } from '../ToastMessage'
import AccessLevelMenu from './AccessLevelMenu'
import SynapseChatInteraction from './SynapseChatInteraction'
import SynapseChatMessage from './SynapseChatMessage'

export type SynapseChatProps = {
  initialMessage?: string //optional initial message
  agentRegistrationId?: string // if provided, use this agent
  chatbotName?: string // optional name of this chatbot agent
  hideTitle?: boolean
  textboxPositionOffset?: string // when embedded in a form, the textbox (form) stuck to the bottom may need to be offset due to container padding (dialog content for example!)
  /* optional session context for the agent session */
  sessionContext?: GridAgentSessionContext
  /* The current session, if state is lifted out of this component */
  externalSession?: AgentSession
  /* A callback invoked to bootstrap the current session, if state is to be lifted out of this component */
  setExternalSession?: (s: AgentSession | undefined) => void
  /* The current chat history, if state is lifted out of this component */
  externalChatState?: ChatState
  // default access level for the agent session.
  defaultAgentAccessLevel?: AgentAccessLevel
  // Whether to show the access level menu for the agent session.
  showAccessLevelMenu?: boolean
  /**
   * Optional callback invoked once when a chat response is received from the server.
   * Use this for side effects such as navigation based on the response content.
   * Called in the mutation onSuccess handler so it runs exactly once per response.
   */
  onChatResponse?: (responseText: string) => void
}

export type ChatInteraction = {
  userMessage: string
  chatResponseText?: string
  chatErrorReason?: string
  chatResponseTrace?: TraceEventWithFriendlyMessage[]
}

export type TraceEventWithFriendlyMessage = {
  friendlyMessage?: string
} & TraceEvent

export function SynapseChat({
  initialMessage,
  agentRegistrationId,
  chatbotName = 'SynapseChat',
  hideTitle = false,
  textboxPositionOffset = '0px',
  sessionContext,
  externalSession,
  setExternalSession,
  externalChatState,
  showAccessLevelMenu = true,
  onChatResponse,
}: SynapseChatProps) {
  const { accessToken } = useSynapseContext()
  const [localAgentSession, setLocalAgentSession] = useState<AgentSession>()
  const agentSession = externalSession ?? localAgentSession
  const setAgentSession = setExternalSession ?? setLocalAgentSession

  const { mutate: createAgentSession, error: createAgentSessionError } =
    useCreateAgentSession({
      onSuccess: newAgentSession => setAgentSession(newAgentSession),
    })

  const { mutate: updateAgentSession } = useUpdateAgentSession({
    onSuccess: updatedAgentSession => setAgentSession(updatedAgentSession),
    onError: err =>
      displayToast(
        `Unable to update the agent session: ${err.message}`,
        'danger',
      ),
  })
  const theme = useTheme()
  const [agentAccessLevel, setAgentAccessLevel] = useState<AgentAccessLevel>(
    sessionContext
      ? AgentAccessLevel.WRITE_YOUR_PRIVATE_DATA
      : AgentAccessLevel.PUBLICLY_ACCESSIBLE,
  )

  const internalChatState = useChatState(agentSession, onChatResponse)
  const chatState = externalChatState ?? internalChatState
  const { pendingMessage, chatJobIds, sendChat } = chatState

  // Keep track of the text that the user is currently typing into the textfield
  const [userChatTextfieldValue, setUserChatTextfieldValue] = useState('')
  const [initialMessageProcessed, setInitialMessageProcessed] = useState(false)
  const scrollAnchorRef = useRef<HTMLDivElement>(null)
  const chatBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Walk up the DOM starting from the outer Box ref to find the first ancestor
    // that is actually overflowing. Using a ref on the outer Box (rather than
    // anchor.parentElement) is more reliable. Using instant scrollTop avoids
    // smooth-scroll racing against async content loading in SynapseChatMessage.
    // Triggered on both chatJobIds (response received) and pendingMessage (message sent)
    // so the new item is always brought into view.
    let el: Element | null = chatBoxRef.current
    while (el && el !== document.body) {
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop = el.scrollHeight
        return
      }
      el = el.parentElement
    }
    scrollAnchorRef.current?.scrollIntoView()
  }, [chatJobIds, pendingMessage])

  // Restore chat session history, if exists.
  // TODO: currently only a single page is restored.  Add support for multiple pages (and detect the user scrolling up to restore the next page of results older)
  // const {
  //   data: sessionHistoryInfiniteData,
  // } = //, hasNextPage: hasMoreSessionHistory, fetchNextPage: fetchNextSessionHistoryPage, isLoading: isSessionHistoryLoading } =
  //   useGetAgentChatSessionHistoryInfinite(
  //     {
  //       sessionId: agentSession?.sessionId,
  //     },
  //     {
  //       enabled: !!agentSession,
  //     },
  //   )

  // const sessionHistory = useMemo(
  //   () =>
  //     sessionHistoryInfiniteData?.pages
  //       .flatMap(page => page.page)
  //       /* Note: session history is ordered from most recent to least recent in each page, so reverse the order when restoring the chat interface */
  //       .reverse() ?? [],
  //   [sessionHistoryInfiniteData],
  // )

  useEffect(() => {
    // on mount, create a new agent session!
    if (createAgentSession && !agentSession) {
      createAgentSession({
        agentAccessLevel,
        agentRegistrationId,
        sessionContext,
      })
    }
  }, [
    createAgentSession,
    agentSession,
    accessToken,
    sessionContext,
    agentAccessLevel,
    agentRegistrationId,
  ])

  useEffect(() => {
    // on mount, resolve the initial message chat interaction (if set)
    if (agentSession && initialMessage && !initialMessageProcessed) {
      sendChat(initialMessage)
      setInitialMessageProcessed(true)
    }
  }, [agentSession, initialMessage, initialMessageProcessed, sendChat])

  const handleSendMessage = () => {
    if (userChatTextfieldValue.trim()) {
      sendChat(userChatTextfieldValue.trim())
      setUserChatTextfieldValue('')
    }
  }

  const isDisabled =
    !agentSession || !userChatTextfieldValue || !!pendingMessage

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    if (!isDisabled && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const sendMessageButtonColor = (
    theme.palette.secondary as unknown as Color
  )[300]
  if (createAgentSessionError) {
    return (
      <Alert severity={'error'} sx={{ my: 2 }}>
        {createAgentSessionError.reason}
      </Alert>
    )
  }

  return (
    <Box
      ref={chatBoxRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        maxWidth: '1100px',
        mx: 'auto',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {!hideTitle && (
        <Typography
          variant="headline1"
          sx={{
            p: '20px',
            borderBottom: '1px solid',
            borderColor: 'grey.300',
            position: 'sticky',
            top: '0px',
            backgroundColor: 'white',
            zIndex: 1,
          }}
        >
          {chatbotName}
        </Typography>
      )}
      {showAccessLevelMenu && (
        <AccessLevelMenu
          initAccessLevel={agentAccessLevel}
          onChange={newAccessLevel => {
            setAgentAccessLevel(newAccessLevel)
            updateAgentSession({
              agentAccessLevel: newAccessLevel,
              sessionId: agentSession!.sessionId,
            })
          }}
        />
      )}
      {!agentSession && <SkeletonParagraph numRows={10} />}
      {agentSession && (
        <Box sx={{ flexGrow: 1 }}>
          <List
            sx={{
              flex: 1,
              pt: '20px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* {sessionHistory &&
            sessionHistory.map((interaction, index) => {
              return (
                <SynapseChatInteraction
                  key={index}
                  userMessage={interaction.usersRequestText}
                  chatResponseText={interaction.agentResponseText}
                />
              )
            })} */}
            {chatJobIds.map(jobId => {
              return (
                <SynapseChatMessage
                  key={jobId}
                  chatJobId={jobId}
                  onSendChat={sendChat}
                />
              )
            })}
            {pendingMessage && (
              <SynapseChatInteraction
                userMessage={pendingMessage}
                chatResponseText={''}
                chatErrorReason={''}
                onSendChat={sendChat}
              />
            )}
          </List>
        </Box>
      )}
      <Box
        sx={{
          position: 'sticky',
          bottom: textboxPositionOffset,
          backgroundColor: 'white',
        }}
      >
        <Box
          component="form"
          sx={{
            pt: '8px',
            mt: '5px',
            pb: '10px',
            position: 'sticky',
            borderTop: '1px solid',
            borderColor: 'grey.400',
          }}
          onSubmit={handleSendMessage}
        >
          <TextField
            fullWidth
            value={userChatTextfieldValue}
            onChange={e => setUserChatTextfieldValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${chatbotName}`}
            slotProps={{
              input: {
                sx: { borderRadius: 96.6 },
                endAdornment: (
                  <IconButton
                    disabled={isDisabled}
                    onClick={handleSendMessage}
                    sx={{
                      ml: '7px',
                      mr: '-8px',
                      color: sendMessageButtonColor,
                      borderStyle: 'solid',
                      borderWidth: isDisabled ? '1px' : '2px',
                      borderColor: isDisabled ? 'gray' : sendMessageButtonColor,
                    }}
                  >
                    <ArrowUpward />
                  </IconButton>
                ),
              },
            }}
          />
          <Typography
            variant="smallText1"
            sx={{ pt: '8px', textAlign: 'center' }}
          >
            {chatbotName} can make mistakes.
          </Typography>
        </Box>
      </Box>
      <div className="scroll-anchor" ref={scrollAnchorRef} />
    </Box>
  )
}

export default SynapseChat
