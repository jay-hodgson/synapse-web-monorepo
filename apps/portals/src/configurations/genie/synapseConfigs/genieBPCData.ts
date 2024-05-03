import { SynapseConfig } from 'types/portal-config'
import { genieBPCSql } from '../resources'

const rgbIndex = 0

const genieBPCData: SynapseConfig = {
  name: 'QueryWrapperPlotNav',
  props: {
    rgbIndex,
    sql: genieBPCSql,
    name: 'Files',
    showExportToCavatica: true,
    isRowSelectionVisible: true,
    rowPrimaryKey: 'id',
    rowVersionKey: 'currentVersion',
    visibleColumnCount: 6,
    tableConfiguration: {
      showAccessColumn: true,
    },
    defaultShowPlots: false,
  },
}

export default genieBPCData
