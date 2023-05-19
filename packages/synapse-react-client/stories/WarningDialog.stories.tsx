import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  WarningDialog,
  WarningDialogProps,
} from '../src/components/SynapseForm/WarningDialog'

const meta = {
  title: 'UI/WarningDialog',
  component: WarningDialog,
  render: args => {
    return <WarningDialog {...args} />
  },
} satisfies Meta<WarningDialogProps>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  args: {
    open: true,
    title: 'Approve Request',
    content: 'Are you sure you want to approve this request?',
    onConfirmCallbackArgs: [],
  },
}

export const AccessTokenCardWarningDialog: Story = {
  render: args => (
    <WarningDialog
      {...args}
      content={
        <>
          <p>
            If you delete this token, any applications using it will stop
            working. This action cannot be undone.
          </p>
          <p className="SRC-boldText">
            Are you sure you want to delete this token?
          </p>
        </>
      }
    />
  ),
  args: {
    ...Demo.args,
    title: 'Confirm Deletion',
    confirmButtonText: 'Delete Token',
    confirmButtonColor: 'error',
  },
}
