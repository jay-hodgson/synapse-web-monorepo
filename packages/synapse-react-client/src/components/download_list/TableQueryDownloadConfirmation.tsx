import React, { useMemo } from 'react'
import { SynapseConstants, useSynapseContext } from '../../utils'
import {
  useAddQueryToDownloadList,
  useGetQueryResultBundleWithAsyncStatus,
} from '../../synapse-queries'
import { displayToast } from '../ToastMessage'
import { DownloadConfirmationUI } from './DownloadConfirmationUI'
import { useQueryContext } from '../QueryContext'
import { useQueryVisualizationContext } from '../QueryVisualizationWrapper'
import { displayFilesWereAddedToDownloadListSuccess } from './DownloadConfirmationUtils'
import { getPrimaryKeyINFilter } from '../../utils/functions/QueryFilterUtils'
import { useAtomValue } from 'jotai'
import { tableQueryDataAtom } from '../QueryWrapper/QueryWrapper'
import {
  hasSelectedRowsAtom,
  rowPrimaryKeyColumnIdAtom,
  rowVersionColumnIdAtom,
  selectedRowsAtom,
} from '../QueryWrapper/TableRowSelectionState'

export function TableQueryDownloadConfirmation() {
  const { getCurrentQueryRequest } = useQueryContext()
  const data = useAtomValue(tableQueryDataAtom)
  const hasSelectedRows = useAtomValue(hasSelectedRowsAtom)
  const selectedRows = useAtomValue(selectedRowsAtom)
  const rowPrimaryKeyColumnId = useAtomValue(rowPrimaryKeyColumnIdAtom)
  const rowVersionColumnId = useAtomValue(rowVersionColumnIdAtom)
  const { setShowDownloadConfirmation } = useQueryVisualizationContext()
  const queryBundleRequest = useMemo(() => {
    const requestCopy = getCurrentQueryRequest()
    requestCopy.partMask =
      SynapseConstants.BUNDLE_MASK_QUERY_COUNT |
      SynapseConstants.BUNDLE_MASK_SUM_FILES_SIZE_BYTES
    if (rowPrimaryKeyColumnId) {
      requestCopy.query.selectFileColumn = Number(rowPrimaryKeyColumnId)
    }
    if (rowVersionColumnId) {
      requestCopy.query.selectFileVersionColumn = Number(rowVersionColumnId)
    }
    if (hasSelectedRows && rowPrimaryKeyColumnId && data?.selectColumns) {
      const primaryKeyINFilter = getPrimaryKeyINFilter(
        rowPrimaryKeyColumnId,
        selectedRows,
        data.selectColumns,
      )
      requestCopy.query.additionalFilters = [
        ...(requestCopy.query.additionalFilters || []),
        primaryKeyINFilter,
      ]
    }
    return requestCopy
  }, [
    data?.columnModels,
    getCurrentQueryRequest,
    hasSelectedRows,
    rowPrimaryKeyColumnId,
    selectedRows,
  ])
  const { downloadCartPageUrl } = useSynapseContext()

  function onClose() {
    setShowDownloadConfirmation(false)
  }

  const { mutate: addToDownloadList, isPending: isAddingToDownloadCart } =
    useAddQueryToDownloadList({
      onSuccess: () => {
        displayFilesWereAddedToDownloadListSuccess(downloadCartPageUrl)
        onClose()
      },
      onError: error => {
        displayToast(error.reason, 'danger')
        onClose()
      },
    })

  const { data: queryResultResponse, isLoading: isLoadingStats } =
    useGetQueryResultBundleWithAsyncStatus(queryBundleRequest)

  const fileCount = queryResultResponse?.responseBody?.queryCount ?? 0
  const fileSizeTotal = queryResultResponse?.responseBody?.sumFileSizes
    ?.greaterThan
    ? undefined
    : queryResultResponse?.responseBody?.sumFileSizes?.sumFileSizesBytes

  // PORTALS-3071: if the version
  const useVersionNumber = rowPrimaryKeyColumnId == undefined
  return (
    <DownloadConfirmationUI
      onAddToDownloadCart={() =>
        addToDownloadList({
          query: queryBundleRequest?.query,
          concreteType:
            'org.sagebionetworks.repo.model.download.AddToDownloadListRequest',
          useVersionNumber: useVersionNumber,
        })
      }
      fileCount={fileCount}
      fileSize={fileSizeTotal}
      isAddingToDownloadCart={isAddingToDownloadCart}
      isLoadingStats={isLoadingStats}
      onCancel={onClose}
    />
  )
}
