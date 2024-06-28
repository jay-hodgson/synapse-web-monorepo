import { Meta, StoryObj } from '@storybook/react'
import { SynapseHomepageV2 } from './SynapseHomepageV2'

const meta = {
  title: 'Synapse/HomePage',
  component: SynapseHomepageV2,
  parameters: {
    chromatic: { viewports: [600, 1200] },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const DemoVersion2: Story = {
  args: {
    projectViewId: 'syn23593547.3',
  },
}
