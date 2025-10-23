import { useGetPortalComponentSearchParams } from '@/utils/UseGetPortalComponentSearchParams'
import { Container } from '@mui/material'
import MarkdownSynapse from 'synapse-react-client/components/Markdown/MarkdownSynapse'
import ErrorPage from './ErrorPage'

function WikiPage() {
  const searchParams = useGetPortalComponentSearchParams()
  const entityId = searchParams?.entityId
  const wikiId = searchParams?.wikiId

  if (!entityId || !wikiId) {
    return <ErrorPage />
  }
  return (
    <Container sx={{ '& .component-container': { flex: 1 }, py: 4 }}>
      <MarkdownSynapse ownerId={entityId} wikiId={wikiId} />
    </Container>
  )
}

export default WikiPage
