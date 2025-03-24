import React, { useState } from 'react'
import { Button } from '@mui/material'
import { FolderDownloadConfirmation } from '../download_list/FolderDownloadConfirmation'
import { TableQueryDownloadConfirmation } from '../download_list/TableQueryDownloadConfirmation'
import { DEFAULT_PAGE_SIZE } from '../../utils/SynapseConstants'
import { SynapseConstants } from '../../utils'
import { QueryBundleRequest } from '@sage-bionetworks/synapse-types'
import { QueryWrapper } from '../QueryWrapper'
import { QueryWrapperErrorBoundary } from '../QueryWrapperErrorBoundary'
import { GetAppTwoTone } from '@mui/icons-material'
import { useGetEntity } from '../../synapse-queries/'

/**
 * Props for the AddToDownloadCartButton component.
 *
 * @property entityId - The ID of the entity to be added to the download cart.
 * @property buttonText - Optional text to display on the button. Defaults to a standard label if not provided.
 */
export type AddToDownloadCartButtonProps = {
  entityId: string
  buttonText?: string
}

const TableTsx: React.FC<{
  entityId: string
}> = ({ entityId }) => {
  const initQueryRequest: QueryBundleRequest = {
    concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
    entityId: entityId,
    query: {
      sql: `select * from ${entityId}`,
      limit: DEFAULT_PAGE_SIZE,
      sort: undefined,
      additionalFilters: undefined,
    },
    partMask: SynapseConstants.BUNDLE_MASK_QUERY_RESULTS,
  }

  return (
    <QueryWrapper initQueryRequest={initQueryRequest}>
      <QueryWrapperErrorBoundary>
        <TableQueryDownloadConfirmation />
      </QueryWrapperErrorBoundary>
    </QueryWrapper>
  )
}

export function AddToDownloadCartButton({
  entityId,
  buttonText = 'Download',
}: AddToDownloadCartButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { data: entity, isLoading } = useGetEntity(entityId)
  const entityConcreteType = entity?.concreteType

  const handleClose = () => {
    setShowConfirmation(false)
  }

  const onAddClick = () => {
    setShowConfirmation(true)
  }

  return (
    <div>
      <div>
        <Button
          onClick={onAddClick}
          variant="outlined"
          startIcon={<GetAppTwoTone />}
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      </div>
      <div>
        {showConfirmation &&
          (entityConcreteType === 'org.sagebionetworks.repo.model.Folder' ? (
            <FolderDownloadConfirmation
              folderId={entityId}
              fnClose={handleClose}
            />
          ) : (
            <TableTsx entityId={entityId} />
          ))}
      </div>
    </div>
  )
}

export default AddToDownloadCartButton
