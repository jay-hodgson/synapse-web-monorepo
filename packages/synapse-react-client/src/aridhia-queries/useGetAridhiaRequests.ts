import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { FairRequestsGet200Response } from '@sage-bionetworks/aridhia-client/generated/models'
import { RequestsApi } from '@sage-bionetworks/aridhia-client/generated/apis'
import { useAridhiaContextOptional } from '@/utils/context/AridhiaContext'
import { useSynapseContext } from '@/utils/context/SynapseContext'
import { createAridhiaApiConfiguration } from './aridhiaTokenExchange'

export const ARIDHIA_REQUESTS_QUERY_KEY = ['aridhia', 'requests'] as const

/**
 * Hook to fetch data access requests from Aridhia FAIR API
 * Exchanges the Synapse ID token for an Aridhia token on each request
 */
export function useGetAridhiaRequests(
  options?: Partial<
    UseQueryOptions<
      FairRequestsGet200Response,
      Error,
      FairRequestsGet200Response
    >
  >,
): UseQueryResult<FairRequestsGet200Response, Error> {
  const aridhiaContext = useAridhiaContextOptional()
  const { idToken: synapseIdToken } = useSynapseContext()

  return useQuery<
    FairRequestsGet200Response,
    Error,
    FairRequestsGet200Response
  >({
    enabled: !!synapseIdToken && !!aridhiaContext,
    ...options,
    queryKey: ARIDHIA_REQUESTS_QUERY_KEY,
    queryFn: async (): Promise<FairRequestsGet200Response> => {
      if (!synapseIdToken) {
        throw new Error('Synapse ID token is not available')
      }

      if (!aridhiaContext) {
        throw new Error(
          'AridhiaContext is not available. Make sure to wrap your component with AridhiaContextProvider',
        )
      }

      // Exchange Synapse ID token for Aridhia token and create API configuration
      // All FAIR API calls go through the gateway with /fair prefix
      const configuration = await createAridhiaApiConfiguration(
        synapseIdToken,
        aridhiaContext.apiBasePath,
        aridhiaContext.authenticationRequest,
      )

      const requestsApi = new RequestsApi(configuration)
      return await requestsApi.fairRequestsGet()
    },
  })
}
