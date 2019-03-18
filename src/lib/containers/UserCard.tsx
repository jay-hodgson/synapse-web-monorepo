import * as React from 'react'
import { getUserProfileWithProfilePic } from './getUserData'
import UserCardViewSwitch from './UserCardViewSwitch'
import { getPrincipalAliasRequest } from '../utils/SynapseClient'
import { MenuAction } from './UserCardContextMenu'
import { UserProfile } from '../utils/jsonResponses/UserProfile'

type UserBadgeState = {
  userProfile: UserProfile | undefined
  isLoading: boolean
}

// add comments
type UserBadgeProps = {
  userProfile?: UserProfile
  loadingBar?: JSX.Element
  alias?: string
  ownerId?: string
  size: string
  token?: string
  hideText?: boolean
  profileClickHandler?: (userProfile: UserProfile) => void
  menuActions? : MenuAction[]
}

export default class UserProfileSmall extends React.Component<UserBadgeProps, UserBadgeState> {
  constructor(props: any) {
    super(props)
    this.state = { userProfile: undefined, isLoading: true }
    this.getUserProfile = this.getUserProfile.bind(this)
  }

  public componentDidMount() {
    const { userProfile, ownerId, alias, token } = this.props
    if (userProfile) {
      return
    }
    if (alias) {
      getPrincipalAliasRequest(token, alias, 'USER_NAME')
      .then(
        (aliasData: any) => {
          this.getUserProfile(aliasData.principalId!)
        }
      )
    } else {
      this.getUserProfile(ownerId!)
    }
  }

  public getUserProfile(ownerId: string) {
    getUserProfileWithProfilePic(ownerId!, this.props.token)
    .then(
      (data) => {
        this.setState({ userProfile: data, isLoading: false })
      }
    ).catch(
      (err) => {
        console.log('failed to get user bundle ', err)
      }
    )
  }
  public render() {
    const { userProfile, loadingBar = <span/>, ...rest } = this.props
    let userProfileAtRender
    if (!userProfile) {
      // userProfile wans't passed in from props
      if (this.state.isLoading) {
        // still making the API call
        return loadingBar
      }
      userProfileAtRender = this.state.userProfile
    } else {
      // otherwise we have the profile from props
      userProfileAtRender = userProfile
    }
    return (
      <UserCardViewSwitch
        userProfile={userProfileAtRender!}
        {...rest}
      />
    )
  }
}
