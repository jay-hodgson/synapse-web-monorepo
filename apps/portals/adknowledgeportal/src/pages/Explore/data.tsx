import { filesViewQueryWrapperPlotNavProps } from '@/config/synapseConfigs/cohortbuilder'
import QueryWrapperPlotNav from 'synapse-react-client/components/QueryWrapperPlotNav/QueryWrapperPlotNav'

function ExploreData() {
  return <QueryWrapperPlotNav {...filesViewQueryWrapperPlotNavProps} />
}

export default ExploreData
