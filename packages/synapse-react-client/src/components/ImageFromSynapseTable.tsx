import React, { CSSProperties } from 'react'
import { SynapseQueries } from 'synapse-react-client'
import {
  FileHandleAssociateType,
  FileHandleAssociation,
} from '@sage-bionetworks/synapse-types'

export type ImageFromSynapseTableProps = {
  tableId: string
  fileHandleId: string | null
  friendlyName?: string
  style?: CSSProperties
}

const ImageFromSynapseTable: React.FC<ImageFromSynapseTableProps> = (
  props: ImageFromSynapseTableProps,
) => {
  const { tableId, fileHandleId, friendlyName, style } = props
  const fha: FileHandleAssociation = {
    associateObjectId: tableId,
    associateObjectType: FileHandleAssociateType.TableEntity,
    fileHandleId: fileHandleId ?? '',
  }
  const stablePresignedUrl = SynapseQueries.useGetStablePresignedUrl(
    fha,
    true,
    {
      enabled: !!fileHandleId,
    },
  )

  const dataUrl = stablePresignedUrl?.dataUrl
  const error = stablePresignedUrl?.queryResult?.error

  if (error || !dataUrl) {
    return <></>
  }
  return (
    <img
      style={style}
      alt={friendlyName ? `${friendlyName}` : 'Image from table'}
      src={dataUrl}
    />
  )
}

export default ImageFromSynapseTable
