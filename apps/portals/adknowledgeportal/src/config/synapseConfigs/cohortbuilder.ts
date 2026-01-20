import { QueryWrapperPlotNavProps } from 'synapse-react-client'
import {
  cavaticaConnectAccountURL,
  cohortBuilderFilesSql,
  cohortBuilderSql,
  enabledAnalysisPlatforms,
} from '../resources'
import { handleSelectedFilesToParticipants } from './handleFilesToParticipants'
import { handleSelectedParticipantsToFiles } from './handleParticipantsToFiles'

const rgbIndex = 1

const defaultSearchConfiguration = {
  searchable: [
    'id',
    'study',
    'dataType',
    'assay',
    'organ',
    'tissue',
    'species',
    'diagnosis',
    'sex',
    'consortium',
    'grant',
    'modelSystemName',
    'treatmentType',
    'specimenID',
    'individualID',
    'individualIdSource',
    'specimenIdSource',
    'resourceType',
    'dataSubtype',
    'metadataType',
    'assayTarget',
    'analysisType',
    'cellType',
    'nucleicAcidSource',
    'fileFormat',
    'group',
    'name',
    'isModelSystem',
    'isConsortiumAnalysis',
    'isMultiSpecimen',
    'metaboliteType',
    'chromosome',
  ],
}
export const individualsViewQueryWrapperPlotNavProps: QueryWrapperPlotNavProps =
  {
    rgbIndex,
    name: 'Participants',
    visibleColumnCount: 10,
    facetsToPlot: ['Sex', 'dataTypes', 'Assays', 'Diagnosis', 'fileFormat'],
    isRowSelectionVisible: true,
    hideCopyToClipboard: true, //PORTALS-3212
    rowSelectionPrimaryKey: ['individualID'],
    helpConfiguration: [
      {
        columnName: 'individualID',
        helpText:
          'A unique identifier that represents a study participant in this system. Individual IDs in our system do not match study-specific participant IDs.',
      },
    ],
    combineRangeFacetConfig: {
      label: 'Age',
      minFacetColumn: 'minAge',
      maxFacetColumn: 'maxAge',
    },
    tableConfiguration: {
      showAccessColumn: false,
      showDownloadColumn: false,
      columnLinks: [
        {
          matchColumnName: 'Study',
          isMarkdown: false,
          baseURL: 'Explore/Studies/DetailsPage',
          URLColumnName: 'studyKey',
        },
      ],
    },
    additionalFiltersSessionStorageKey:
      'cohort-builder-individuals-perspective',
    customControls: [
      {
        buttonText: 'View associated files',
        onClick: event => {
          handleSelectedParticipantsToFiles(event)
        },
        buttonID: 'ViewAllFilesButton',
      },
    ],
    sql: cohortBuilderSql,
    shouldDeepLink: false,
    searchConfiguration: defaultSearchConfiguration,
  }

export const filesViewQueryWrapperPlotNavProps: QueryWrapperPlotNavProps = {
  rgbIndex,
  name: 'Data',
  enabledExternalAnalysisPlatforms: enabledAnalysisPlatforms,
  fileIdColumnName: 'id',
  fileNameColumnName: 'fileName',
  fileVersionColumnName: 'fileVersion',
  cavaticaConnectAccountURL: cavaticaConnectAccountURL,
  visibleColumnCount: 10,
  isRowSelectionVisible: true,
  hideCopyToClipboard: true, //PORTALS-3212
  rowSelectionPrimaryKey: ['id'],
  additionalFiltersSessionStorageKey: 'cohort-builder-files-perspective',
  tableConfiguration: {
    showAccessColumn: true,
    showAccessColumnHeader: true,
    showDownloadColumn: true,
    columnLinks: [
      {
        matchColumnName: 'Study',
        isMarkdown: false,
        baseURL: 'Explore/Studies/DetailsPage',
        URLColumnName: 'studyKey',
      },
    ],
  },
  sql: cohortBuilderFilesSql,

  customControls: [
    {
      buttonText: 'View associated participants',
      onClick: event => {
        handleSelectedFilesToParticipants(event)
      },
    },
  ],
  shouldDeepLink: false,
  searchConfiguration: defaultSearchConfiguration,
}
