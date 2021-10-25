import Plotly from 'plotly.js-basic-dist'
import * as React from 'react'
import createPlotlyComponent from 'react-plotly.js/factory'

// We must use the createPlotlyComponent factory method because we use plotly.js-basic-dist and not plotly.js
const Plot = createPlotlyComponent(Plotly)

export type PlotlyWrapperProps = {
  data: Plotly.Data[]
  layout?: Partial<Plotly.Layout>
  config?: Partial<Plotly.Config>
  className?: string
  containerWidth?: number
}

const PlotlyWrapper: React.FC<PlotlyWrapperProps> = props => {
  const { data, layout, config, className, containerWidth } = props
  const hasData = !!(data && data.length)

  return (<div className={className}>
    {
      !hasData &&
      <>
        <div
          className={"chart-nodata"}
          style={{width: containerWidth}}>
          <span>Data Unavailable</span>
        </div>
      </>
    }
    {
      hasData &&
      <Plot
        data={data}
        layout={layout ?? {}}
        config={config}
      />
    }

  </div>)
}

export default PlotlyWrapper
