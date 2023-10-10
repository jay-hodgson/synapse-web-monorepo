import { SynapseConfig } from 'types/portal-config'
import {
  cohortBuilderFilesSql,
  cohortBuilderSql,
  defaultSearchConfiguration,
} from '../resources'
import {
  handleParticipantsToFiles,
  handleSelectedParticipantsToFiles,
} from './handleParticipantsToFiles'
import {
  handleFilesToParticipants,
  handleSelectedFilesToParticipants,
} from './handleFilesToParticipants'
import { QueryWrapperSynapsePlotProps } from 'synapse-react-client/src/components/QueryWrapperPlotNav/QueryWrapperSynapsePlot'
import { SynapseUtilityFunctions } from 'synapse-react-client'

const rgbIndex = 1
const getPlotConfig = (tableId: string) => {
  const plotConfig: QueryWrapperSynapsePlotProps = {
    title: 'Age Distribution',
    query: `SELECT cast((case when maxAge >= 0 and maxAge < 10  then ' 0 - 10 ' 
    when maxAge >= 10 and maxAge < 20  then ' 10 - 20 '
    when maxAge >= 20 and maxAge < 30  then ' 20 - 30 ' 
    when maxAge >= 30 and maxAge < 40  then ' 30 - 40 ' 
    when maxAge >= 40 and maxAge < 50  then ' 40 - 50 ' 
    when maxAge >= 50 and maxAge < 60  then ' 50 - 60 '
    when maxAge >= 60 and maxAge < 70  then ' 60 - 70 ' 
    when maxAge >= 70 and maxAge < 80  then ' 70 - 80 '
    when maxAge >= 80 and maxAge < 90  then ' 80 - 90 '
    when maxAge >= 90 and maxAge < 100  then ' 90 - 100 '
    else '100+' END) AS STRING) AS bucket,
          count(*) AS totalWithinRange
            FROM ${tableId}
            GROUP BY 1
            ORDER BY bucket`,
    type: 'bar',
    // xaxistype: ''
    xtitle: 'Age (years)',
    ytitle: '',
    // barmode: ''
    showlegend: 'false',
  }
  return plotConfig
}
const participantsTableId =
  SynapseUtilityFunctions.parseEntityIdFromSqlStatement(cohortBuilderSql)
export const individualsView: SynapseConfig = {
  name: 'QueryWrapperPlotNav',
  props: {
    rgbIndex,
    name: 'Participants',
    visibleColumnCount: 10,
    facetsToPlot: ['Sex', 'dataTypes', 'Assays', 'Diagnosis', 'fileFormat'],
    isRowSelectionVisible: true,
    rowSelectionPrimaryKey: ['individualID'],
    combineRangeFacetConfig: {
      label: 'Age',
      minFacetColumn: 'minAge',
      maxFacetColumn: 'maxAge',
    },
    synapsePlots: [getPlotConfig(participantsTableId)],
    tableConfiguration: {
      showAccessColumn: false,
      showDownloadColumn: false,
      columnLinks: [
        {
          matchColumnName: 'study',
          isMarkdown: false,
          baseURL: 'Explore/Studies/DetailsPage',
          URLColumnName: 'studyKey',
          wrapValueWithParens: false,
        },
      ],
    },
    additionalFiltersLocalStorageKey: 'cohort-builder-individuals-perspective',
    customControls: [
      {
        buttonText: 'View files in selection',
        onClick: (event) => {
          handleSelectedParticipantsToFiles(event)
        },
        isRowSelectionSupported: true,
      },
      {
        buttonText: 'View associated files',
        onClick: (event) => {
          handleParticipantsToFiles(event)
        },
        isRowSelectionSupported: false,
      },
    ],
    sql: cohortBuilderSql,
    shouldDeepLink: true,
    searchConfiguration: defaultSearchConfiguration,
  },
}

const filesTableId = SynapseUtilityFunctions.parseEntityIdFromSqlStatement(
  cohortBuilderFilesSql,
)
export const filesView: SynapseConfig = {
  name: 'QueryWrapperPlotNav',
  props: {
    rgbIndex,
    name: 'Data',
    showExportToCavatica: true,
    fileIdColumnName: 'fileId',
    fileNameColumnName: 'fileId',
    fileVersionColumnName: 'currentVersion',
    cavaticaHelpURL: '/Limited%20Data%20Commons',
    visibleColumnCount: 10,
    isRowSelectionVisible: true,
    rowSelectionPrimaryKey: ['fileId'],
    additionalFiltersLocalStorageKey: 'cohort-builder-files-perspective',
    combineRangeFacetConfig: {
      label: 'Age',
      minFacetColumn: 'minAge',
      maxFacetColumn: 'maxAge',
    },
    synapsePlots: [getPlotConfig(filesTableId)],
    tableConfiguration: {
      showAccessColumn: true,
      showDownloadColumn: true,
      columnLinks: [
        {
          matchColumnName: 'study',
          isMarkdown: false,
          baseURL: 'Explore/Studies/DetailsPage',
          URLColumnName: 'studyKey',
        },
      ],
    },
    sql: cohortBuilderFilesSql,

    customControls: [
      {
        buttonText: 'View participants in selection',
        onClick: (event) => {
          handleSelectedFilesToParticipants(event)
        },
        isRowSelectionSupported: true,
      },
      {
        buttonText: 'View associated participants',
        onClick: (event) => {
          handleFilesToParticipants(event)
        },
        isRowSelectionSupported: false,
      },
    ],
    shouldDeepLink: true,
    searchConfiguration: defaultSearchConfiguration,
  },
}
