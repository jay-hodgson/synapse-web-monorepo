import 'whatwg-fetch'
import 'raf/polyfill' // polyfill for requestAnimationFrame
import '@testing-library/jest-dom'
import crypto from 'crypto'
import { ResizeObserver } from '@juggle/resize-observer'
import { setupIntersectionMocking } from 'react-intersection-observer/test-utils'
import { faker } from '@faker-js/faker'
import { configure } from '@testing-library/dom'

/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be require's and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 *
 * Consider migrating to a more modern test runner if
 * you don't want to deal with this.
 */
const { TextDecoder, TextEncoder } = require('node:util')
const { ReadableStream, TransformStream } = require('node:stream/web')

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
})

const { Blob, File } = require('node:buffer')
const { fetch, Headers, FormData, Request, Response } = require('undici')

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
})
/** END injecting Node.js globals as polyfills **/

// Set a constant seed for faker so the generated data doesn't change
beforeAll(() => {
  faker.seed(12345)
})

// MarkdownSynapse dependencies below --
// When using the component in production it relies on these imports being globals,
// however, the testing environment doesn't have a browser loading CDNs, so we
// import it below. This also means that these dependencies are required in package.json
global.ResizeObserver = ResizeObserver

setupIntersectionMocking(jest.fn)

const oldWindowLocation = window.location
const oldWindowOpen = window.open

/**
 * Mock `window.location` so we can verify interactions in tests
 * See https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
 */
beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - TS doesn't allow us to delete location. Not an issue because we're immediately replacing it with the mock
  delete window.location
  window.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldWindowLocation),
      // Each method must be manually mocked
      assign: {
        configurable: true,
        value: jest.fn(),
      },
      replace: {
        configurable: true,
        value: jest.fn(),
      },
    },
  ) as Location

  delete window.open
  window.open = jest.fn()
})
afterAll(() => {
  // restore `window.location` to the original `jsdom`
  // `Location` object
  window.location = oldWindowLocation
  window.open = oldWindowOpen
})

// Synapse API calls may take longer than 5s (typically if a dependent call is taking much longer than normal)
jest.setTimeout(30000)
// Bump `waitFor` timout from 1000ms to 5000ms in CI
configure({ asyncUtilTimeout: process.env.CI ? 5000 : 1000 })

// JSDOM doesn't support createObjectURL and revokeObjectURL, so we shim them
// https://github.com/jsdom/jsdom/issues/1721
window.URL.createObjectURL = jest
  .fn()
  .mockReturnValue('blob:mockBlobUrlConfiguredInTestSetup')
window.URL.revokeObjectURL = jest.fn()
window.scrollTo = jest.fn()

Element.prototype.scrollTo = jest.fn()

// crypto.getRandomValues polyfill for JSDOM
Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
})
