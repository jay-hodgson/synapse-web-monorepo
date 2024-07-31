import React, { useEffect, useState } from 'react'
import { MuiContainer, SynapseComponents } from 'synapse-react-client'
import { Paper } from '@mui/material'
import useFetch from './useFetch'

export const GovernanceMarkdownPage: React.FC<{ url: string }> = ({ url }) => {
  const [markdown, setMarkdown] = useState<string | undefined>(undefined)
  const data = useFetch(url)
  useEffect(() => {
    const getData = async () => {
      const newMarkdown = await data
      setMarkdown(newMarkdown)
    }
    getData()
  }, [data])
  return (
    <div className="blue-background">
      <MuiContainer style={{ padding: '40px' }}>
        <Paper sx={{ padding: '35px' }}>
          {markdown && <SynapseComponents.Markdown markdown={markdown} />}
        </Paper>
      </MuiContainer>
    </div>
  )
}
