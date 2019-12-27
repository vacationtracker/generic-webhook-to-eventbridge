import { sendWebhookEvent } from '../lib/main'

const ApiGwRequest = {
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  body: '{"sample":"event"}',
  path: '',
  pathParameters: {},
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  stageVariables: {},
  requestContext: {
    accountId: '',
    apiId: '',
    httpMethod: '',
    path: '',
    stage: '',
    requestId: '',
    requestTimeEpoch: 123,
    resourceId: '',
    resourcePath: '',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      userArn: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '',
      user: null,
      userAgent: null,
    },
  },
  resource: '',
}

describe('Send webhook event', () => {
  describe('unit', () => {
    it('should invoke notification.send', async () => {
      const notificationMock = {
        send: jest.fn(),
      }
      await sendWebhookEvent(ApiGwRequest, notificationMock)
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith(ApiGwRequest)
    })

    it('should pass text if a request Content-Type is not application/json', async () => {
      const notificationMock = {
        send: jest.fn(),
      }
      await sendWebhookEvent(ApiGwRequest, notificationMock)
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith(ApiGwRequest)
    })

    it('should parse JSON body if a request Content-Type is application/json', async () => {
      const notificationMock = {
        send: jest.fn(),
      }
      const ApiGwJson = Object.assign({}, ApiGwRequest, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ test: true }) })
      const ApiGwJsonResponse = Object.assign({}, ApiGwRequest, { headers: { 'Content-Type': 'application/json' }, body: { test: true } })
      await sendWebhookEvent(ApiGwJson, notificationMock)
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith(ApiGwJsonResponse)
    })

    it('should parse JSON body if a request Content-Type is application/json with charset', async () => {
      const notificationMock = {
        send: jest.fn(),
      }
      const ApiGwJson = Object.assign({}, ApiGwRequest, { headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ test: true }) })
      const ApiGwJsonResponse = Object.assign({}, ApiGwRequest, { headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: { test: true } })
      await sendWebhookEvent(ApiGwJson, notificationMock)
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith(ApiGwJsonResponse)
    })

    it('should fall back to the original body if parsing JSON fails', async () => {
      const notificationMock = {
        send: jest.fn(),
      }
      const ApiGwJson = Object.assign({}, ApiGwRequest, { headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: 'not a JSON' })
      await sendWebhookEvent(ApiGwJson, notificationMock)
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith(ApiGwJson)
    })
  })
})
