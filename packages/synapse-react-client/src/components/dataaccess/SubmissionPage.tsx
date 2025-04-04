import {
  useGetAccessRequirementACL,
  useGetAccessRequirements,
  useGetAccessRequirementWikiPageKey,
} from '@/synapse-queries/dataaccess/useAccessRequirements'
import useGetDataAccessSubmission, {
  useUpdateDataAccessSubmissionState,
} from '@/synapse-queries/dataaccess/useDataAccessSubmission'
import { formatDate } from '@/utils/functions/DateFormatter'
import { ACT_TEAM_ID } from '@/utils/SynapseConstants'
import { Button, Skeleton, Typography } from '@mui/material'
import {
  ACCESS_TYPE,
  FileHandleAssociateType,
  ManagedACTAccessRequirement,
  SubmissionState,
} from '@sage-bionetworks/synapse-types'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { isEmpty, toLower, upperFirst } from 'lodash-es'
import { Fragment, useMemo, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { SynapseErrorBoundary } from '../error/ErrorBanner'
import MarkdownSynapse from '../Markdown/MarkdownSynapse'
import WarningDialog, { WarningDialogProps } from '../SynapseForm/WarningDialog'
import { UserBadge } from '../UserCard/UserBadge'
import UserOrTeamBadge from '../UserOrTeamBadge/UserOrTeamBadge'
import { FileHandleLink } from '../widgets/FileHandleLink'
import RejectDataAccessRequestModal from './RejectDataAccessRequestModal'

dayjs.extend(duration)

export type SubmissionPageProps = {
  /** The ID of the submission to view */
  submissionId: string | number
}

function DataAccessSubmissionFileHandleLink(props: {
  submissionId: string
  fileHandleId: string
}) {
  const { submissionId, fileHandleId } = props
  const fileHandleAssociation = useMemo(
    () => ({
      fileHandleId: fileHandleId,
      associateObjectId: submissionId,
      associateObjectType:
        FileHandleAssociateType.DataAccessSubmissionAttachment,
    }),
    [fileHandleId, submissionId],
  )
  return (
    <FileHandleLink
      key={fileHandleId}
      showDownloadIcon={true}
      fileHandleAssociation={fileHandleAssociation}
    />
  )
}

function ApproveConfirmationModal(
  props: Pick<WarningDialogProps, 'open' | 'onConfirm' | 'onCancel'>,
) {
  return (
    <WarningDialog
      open={props.open}
      title="Approve Request?"
      content={
        <>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>
            Approving the request will grant access to controlled data.
          </Typography>
          <Typography variant="body1">
            In addition, the user will receive an email notification alerting
            them that the request has been granted.
          </Typography>
        </>
      }
      onConfirm={props.onConfirm}
      onConfirmCallbackArgs={[]}
      onCancel={props.onCancel}
      confirmButtonText="Approve"
    />
  )
}

type AccessRequirementWikiType = {
  accessRequirementId: string
}

function AccessRequirementWiki(props: AccessRequirementWikiType) {
  const { data: wikiPageKey } = useGetAccessRequirementWikiPageKey(
    props.accessRequirementId,
    {
      throwOnError: true,
    },
  )

  return wikiPageKey ? (
    <div className="AccessRequirementWikiContainer">
      <div className="AccessRequirementWikiContent">
        <Typography variant="headline1">Access Requirement</Typography>
        <hr />
        <MarkdownSynapse
          wikiId={wikiPageKey?.wikiPageId}
          ownerId={wikiPageKey?.ownerObjectId}
          objectType={wikiPageKey?.ownerObjectType}
        />
      </div>
    </div>
  ) : (
    <Skeleton width={'100%'} height={'600px'} />
  )
}

/**
 * Page for a Data Access Submission that a designated reviewer can view, and choose to approve or reject.
 */
export default function SubmissionPage(props: SubmissionPageProps) {
  const { submissionId } = props
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)

  const handleError = useErrorHandler()
  const { data: submission, refetch } = useGetDataAccessSubmission(
    submissionId,
    { throwOnError: true },
  )

  const { mutateAsync } = useUpdateDataAccessSubmissionState()

  const { data: accessRequirement } =
    useGetAccessRequirements<ManagedACTAccessRequirement>(
      parseInt(submission?.accessRequirementId!),
      { enabled: !!submission },
    )

  const { data: acl, isLoading: isLoadingACL } = useGetAccessRequirementACL(
    submission?.accessRequirementId!,
    { enabled: !!submission, throwOnError: true },
  )

  const [showApprovalConfirmation, setShowApprovalConfirmation] =
    useState(false)

  function approveSubmission() {
    return mutateAsync({
      submissionId: submission?.id ?? '',
      newState: SubmissionState.APPROVED,
    })
  }

  const reviewerIds = acl?.resourceAccess
    .filter(ra => ra.accessType.includes(ACCESS_TYPE.REVIEW_SUBMISSIONS))
    .map(ra => ra.principalId)

  return (
    <div className="SubmissionPage">
      <ApproveConfirmationModal
        open={showApprovalConfirmation}
        onCancel={() => {
          setShowApprovalConfirmation(false)
        }}
        onConfirm={async () => {
          try {
            await approveSubmission()
          } catch (e) {
            handleError(e)
          }
          setShowApprovalConfirmation(false)
          refetch()
        }}
      />
      {showRejectionDialog && (
        <RejectDataAccessRequestModal
          // Previously, we used a 'key' prop to reset the modal form when it was opened,
          // but removing the key and re-rendering the JSX achieves the same functionality in a more straightforward way.
          submissionId={submissionId}
          open={showRejectionDialog}
          onClose={() => setShowRejectionDialog(false)}
        />
      )}
      <div className="SubmissionSummary">
        <Typography variant="dataFieldKey">Status</Typography>
        <Typography variant="headline3">
          {submission ? submission.state : <Skeleton width={100} />}
        </Typography>
        <br />
        {submission ? (
          submission.state === SubmissionState.SUBMITTED && (
            <div className="ButtonContainer">
              <Button
                onClick={() => {
                  setShowApprovalConfirmation(true)
                }}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  setShowRejectionDialog(true)
                }}
                color="error"
                variant="contained"
              >
                Reject
              </Button>
            </div>
          )
        ) : (
          <Skeleton width={200} />
        )}
        <Typography variant="dataFieldKey">Access Requirement Name</Typography>
        <Typography variant="smallText1">
          {accessRequirement?.name ?? <Skeleton width={100} />}
        </Typography>
        <br />
        <Typography variant="dataFieldKey">Assigned Reviewer</Typography>
        <Typography variant="smallText1">
          {isLoadingACL && <Skeleton width={100} />}
          {!isLoadingACL &&
            !isEmpty(reviewerIds) &&
            reviewerIds!.map(id => {
              return <UserOrTeamBadge key={id} principalId={id} />
            })}
          {!isLoadingACL && isEmpty(reviewerIds) && (
            <UserOrTeamBadge principalId={ACT_TEAM_ID} />
          )}
        </Typography>
        <br />
        <Typography variant="dataFieldKey">Conditions</Typography>
        {accessRequirement ? (
          <Typography variant="smallText1" component={'div'}>
            <ul>
              <li>
                Expiration period:{' '}
                {dayjs
                  .duration({
                    milliseconds: accessRequirement.expirationPeriod,
                  })
                  .asDays()}{' '}
                day(s)
                {accessRequirement.expirationPeriod === 0 && ' (no expiration)'}
              </li>

              {accessRequirement.isCertifiedUserRequired && (
                <li>User must be Certified</li>
              )}
              {accessRequirement.isValidatedProfileRequired && (
                <li>User Profile must be Validated</li>
              )}
              {accessRequirement.isDUCRequired && <li>DUC is required</li>}
              {accessRequirement.isIDURequired && <li>IDU is required</li>}
              {accessRequirement.isIDUPublic && (
                <li>IDU will be made public</li>
              )}
              {accessRequirement.isIRBApprovalRequired && (
                <li>IRB Approval is required</li>
              )}
              {accessRequirement.areOtherAttachmentsRequired && (
                <li>Other attachments are required</li>
              )}
            </ul>
          </Typography>
        ) : (
          <Skeleton width={100} />
        )}
        <br />
        <div className="SubmissionSummaryGrid">
          <Typography variant="dataFieldKey">Submitted By</Typography>
          <Typography variant="smallText1">
            {submission ? (
              <UserBadge userId={submission.submittedBy} />
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
          <Typography variant="dataFieldKey">Submitted On</Typography>
          <Typography variant="smallText1">
            {submission ? (
              formatDate(dayjs(submission.submittedOn))
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
          <Typography variant="dataFieldKey">Modified By</Typography>
          <Typography variant="smallText1">
            {submission ? (
              <UserBadge userId={submission.modifiedBy} />
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
          <Typography variant="dataFieldKey">Modified On</Typography>
          <Typography variant="smallText1">
            {submission ? (
              formatDate(dayjs(submission.modifiedOn))
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
          <Typography className="Key" variant="dataFieldKey">
            Data Requesters
            {`${submission ? ` (${submission.accessorChanges.length})` : ''}`}
          </Typography>
          {submission ? (
            submission.accessorChanges.map(accessorChange => (
              <Fragment key={accessorChange.userId}>
                <Typography className="Key DataAccessor" variant="smallText1">
                  <span style={{ whiteSpace: 'nowrap' }}>
                    <UserBadge
                      key={accessorChange.userId}
                      userId={accessorChange.userId}
                    />
                  </span>
                </Typography>
                <Typography className="Value DataAccessor" variant="smallText1">
                  {upperFirst(
                    toLower(
                      accessorChange.type.substring(
                        0,
                        accessorChange.type.indexOf('_'),
                      ),
                    ),
                  )}
                </Typography>
              </Fragment>
            ))
          ) : (
            <Skeleton width={100} />
          )}
          <Typography className="Key" variant="dataFieldKey">
            Institution
          </Typography>
          <Typography className="Value" variant="smallText1">
            {submission ? (
              submission.researchProjectSnapshot.institution
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
          <Typography className="Key" variant="dataFieldKey">
            Project Lead
          </Typography>
          <Typography className="Value" variant="smallText1">
            {submission ? (
              submission.researchProjectSnapshot.projectLead
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
        </div>
      </div>
      <div className="SubmissionRightPane">
        <SynapseErrorBoundary>
          {submission ? (
            <AccessRequirementWiki
              accessRequirementId={submission.accessRequirementId}
            />
          ) : (
            <></>
          )}
        </SynapseErrorBoundary>
        <div>
          {submission?.rejectedReason && (
            <>
              <Typography variant="headline1">
                Reason for rejection given by reviewer
              </Typography>
              <hr />
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                {submission.rejectedReason}
              </Typography>
            </>
          )}
          <Typography variant="headline1">
            Contents of the Access Request
          </Typography>
          <hr />
          {submission?.researchProjectSnapshot?.intendedDataUseStatement && (
            <>
              <Typography variant="headline2">
                Intended Data Use Statement
              </Typography>
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                {submission.researchProjectSnapshot.intendedDataUseStatement}
              </Typography>
            </>
          )}
          <Typography variant="headline2">Documents</Typography>
          {submission?.ducFileHandleId && (
            <>
              <Typography variant="smallText2">
                Data Use Certificate (DUC)
              </Typography>
              <DataAccessSubmissionFileHandleLink
                submissionId={submission.id}
                fileHandleId={submission.ducFileHandleId}
              />
            </>
          )}
          {submission?.irbFileHandleId && (
            <>
              <Typography variant="smallText2">IRB Approval Letter</Typography>
              <DataAccessSubmissionFileHandleLink
                submissionId={submission.id}
                fileHandleId={submission.irbFileHandleId}
              />
            </>
          )}
          {submission?.attachments && (
            <>
              <Typography variant="smallText2">Other Attachments</Typography>
              {submission.attachments.map(fileHandleId => (
                <Fragment key={fileHandleId}>
                  <DataAccessSubmissionFileHandleLink
                    submissionId={submission.id}
                    fileHandleId={fileHandleId}
                  />
                  <br />
                </Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
