import App from '@sage-bionetworks/synapse-portal-framework/App'
import ELBetaLaunchBanner from '@sage-bionetworks/synapse-portal-framework/components/elportal/ELBetaLaunchBanner'
import ELBrowseToolsPage from '@sage-bionetworks/synapse-portal-framework/components/elportal/ELBrowseToolsPage'
import ExploreWrapper from '@sage-bionetworks/synapse-portal-framework/components/Explore/ExploreWrapper'
import { SectionLayout } from '@sage-bionetworks/synapse-portal-framework/components/SectionLayout'
import sharedRoutes from '@sage-bionetworks/synapse-portal-framework/shared-config/sharedRoutes'
import React from 'react'
import { RouteObject } from 'react-router-dom'
import { Markdown } from 'synapse-react-client'
import HomePage from '../pages/HomePage'
import ProjectDetailsPage from '../pages/ProjectDetailsPage'
import StudyDetailsPage, {
  studyDetailsPageRoutes,
} from '../pages/StudyDetailsPage'
import explorePageRoutes from './explorePageRoutes'
import { computationalSql } from './resources'

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <App>
        <ELBetaLaunchBanner />
      </App>
    ),
    children: [
      ...sharedRoutes,
      { index: true, element: <HomePage /> },
      {
        path: 'Browse Tools',
        element: (
          <ELBrowseToolsPage
            popularSearchesSql={''}
            toolsSql={computationalSql}
          />
        ),
      },
      {
        path: 'Explore',
        element: <ExploreWrapper explorePaths={explorePageRoutes} />,
        children: explorePageRoutes,
      },
      {
        path: 'Explore/Projects/DetailsPage',
        element: <ProjectDetailsPage />,
      },
      {
        path: 'Explore/Studies/DetailsPage',
        element: <StudyDetailsPage />,
        children: studyDetailsPageRoutes,
      },
      {
        path: 'Analysis Platforms',
        element: (
          <SectionLayout title={'Analysis Platforms'}>
            <Markdown
              ownerId="syn27229419"
              wikiId="621275"
              loadingSkeletonRowCount={10}
            />
          </SectionLayout>
        ),
      },
      {
        path: 'Data Access',
        element: (
          <SectionLayout title={'Data Access'}>
            <Markdown
              ownerId="syn27229419"
              wikiId="621276"
              loadingSkeletonRowCount={10}
            />
            <Markdown
              ownerId="syn27229419"
              wikiId="622372"
              loadingSkeletonRowCount={10}
            />
          </SectionLayout>
        ),
      },
    ],
  },
]

export default routes
