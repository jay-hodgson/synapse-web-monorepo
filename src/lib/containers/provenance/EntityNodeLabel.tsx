import React from 'react'
import { Handle, Position } from 'react-flow-renderer'
import { useGetEntity } from '../../utils/hooks/SynapseAPI'
import { Reference } from '../../utils/synapseTypes'
import Typography from '../../utils/typography/Typography'

export type EntityNodeLabelProps = Reference

export const EntityNodeLabel = (data: EntityNodeLabelProps) => {
  const { targetId, targetVersionNumber } = data
  const { data: entity } = useGetEntity(targetId, targetVersionNumber)
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Typography variant="headline3">Entity</Typography>
      <div>{entity?.name}</div>
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </>
  )
}
