import React from 'react'
import { useGetFullTableQueryResults } from '../../synapse-queries'
import { BUNDLE_MASK_QUERY_RESULTS } from '../../utils/SynapseConstants'
import hardcodedPhasesQueryResponseData, {
  phaseObservationIndex,
  phaseObservationTimeMaxIndex,
  phaseObservationTimeMaxUnitsIndex,
  phaseSpeciesIndex,
} from './phasesQueryResponseData'
import TimelinePhase from './TimelinePhase'
import getColorPalette from '../ColorGradient/ColorGradient'
import { Box } from '@mui/system'
import { ColumnSingleValueFilterOperator } from '@sage-bionetworks/synapse-types'
import { ObservationCardSchema } from '../row_renderers/ObservationCard'
import { parseEntityIdFromSqlStatement } from '../../utils/functions'

const OBSERVATION_PHASE_COLUMN_NAME = 'phase'
const OBSERVATION_TIME_COLUMN_NAME = 'time'
const OBSERVATION_TIME_UNITS_COLUMN_NAME = 'timeunits'
const OBSERVATION_SUBMITTER_NAME_COLUMN_NAME = 'submittername'
const OBSERVATION_TEXT_COLUMN_NAME = 'text'
const OBSERVATION_TYPE_COLUMN_NAME = 'tag'
const OBSERVATION_SUBMITTER_USER_ID_COLUMN_NAME = 'submitteruserid'

type TimelinePlotProps = {
  species: string
  resourceId: string
  observationsSql: string
}
const TimelinePlot = ({
  observationsSql,
  species,
  resourceId,
}: TimelinePlotProps) => {
  // Fetch the table data
  const eventsTableId = parseEntityIdFromSqlStatement(observationsSql)
  const eventTableQuery = useGetFullTableQueryResults({
    entityId: eventsTableId,
    query: {
      sql: `${observationsSql} WHERE observationTime IS NOT NULL`,
      additionalFilters: [
        {
          columnName: 'resourceId',
          concreteType:
            'org.sagebionetworks.repo.model.table.ColumnSingleValueQueryFilter',
          values: [resourceId],
          operator: ColumnSingleValueFilterOperator.EQUAL,
        },
        {
          columnName: 'species',
          concreteType:
            'org.sagebionetworks.repo.model.table.ColumnSingleValueQueryFilter',
          values: [species],
          operator: ColumnSingleValueFilterOperator.EQUAL,
        },
      ],
    },

    partMask: BUNDLE_MASK_QUERY_RESULTS,
    concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
  })

  const { data: eventsData, isLoading } = eventTableQuery

  if (isLoading) {
    return <></>
  }
  const observationPhaseIndex =
    eventsData?.queryResult?.queryResults.headers.findIndex(
      header => header.name.toLowerCase() === OBSERVATION_PHASE_COLUMN_NAME,
    )!
  const observationTimeIndex =
    eventsData?.queryResult?.queryResults.headers.findIndex(
      header => header.name.toLowerCase() === OBSERVATION_TIME_COLUMN_NAME,
    )!
  const observationTimeUnitIndex =
    eventsData?.queryResult?.queryResults.headers.findIndex(
      header =>
        header.name.toLowerCase() === OBSERVATION_TIME_UNITS_COLUMN_NAME,
    )!
  const observationSubmitterNameIndex =
    eventsData?.queryResult?.queryResults.headers.findIndex(
      header =>
        header.name.toLowerCase() === OBSERVATION_SUBMITTER_NAME_COLUMN_NAME,
    )!
  const observationTextIndex =
    eventsData?.queryResult?.queryResults.headers.findIndex(
      header => header.name.toLowerCase() === OBSERVATION_TEXT_COLUMN_NAME,
    )!
  const observationTypeIndex =
    eventsData?.queryResult?.queryResults.headers.findIndex(
      header => header.name.toLowerCase() === OBSERVATION_TYPE_COLUMN_NAME,
    )!
  const submitterUserIdIndex =
    eventsData?.queryResult?.queryResults.headers.findIndex(
      header =>
        header.name.toLowerCase() === OBSERVATION_SUBMITTER_USER_ID_COLUMN_NAME,
    )!

  // filter the phases query response data to the specific species
  const phasesForTargetSpecies =
    hardcodedPhasesQueryResponseData.queryResult?.queryResults.rows.filter(
      row => {
        return row.values[phaseSpeciesIndex] == species
      },
    )
  // then walk through the phases and create a plot for each (iff event data exists for that phase!)

  if (!phasesForTargetSpecies || phasesForTargetSpecies.length == 0) {
    return <></>
  }
  return (
    <Box sx={{ display: 'flex' }}>
      {/* TODO: Add legend */}
      {phasesForTargetSpecies.map((phaseRow, index) => {
        const { colorPalette } = getColorPalette(index, 1)
        const phaseEventRows =
          eventsData?.queryResult?.queryResults.rows.filter(row => {
            return (
              row.values[observationPhaseIndex] ==
              phaseRow.values[phaseObservationIndex]
            )
          })
        const schema: ObservationCardSchema = {
          submitterName: observationSubmitterNameIndex,
          submitterUserId: submitterUserIdIndex,
          tag: observationTypeIndex,
          text: observationTextIndex,
          time: observationTimeIndex,
          timeUnits: observationTimeUnitIndex,
        }
        const isPhaseEvents =
          phaseEventRows?.length && phaseEventRows?.length > 0
        if (isPhaseEvents) {
          return (
            <TimelinePhase
              key={phaseRow.rowId}
              name={phaseRow.values[phaseObservationIndex]!}
              color={colorPalette[0]}
              timeMax={parseInt(phaseRow.values[phaseObservationTimeMaxIndex]!)}
              timeUnits={phaseRow.values[phaseObservationTimeMaxUnitsIndex]!}
              rowData={phaseEventRows}
              schema={schema}
            />
          )
        } else return <></>
      })}
    </Box>
  )
}

export default TimelinePlot