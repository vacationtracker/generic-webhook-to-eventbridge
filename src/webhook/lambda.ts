// Allow CloudWatch to read source maps
import 'source-map-support/register'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { EventBridgeRepository } from '../common/event-bridge-repository'
import { sendWebhookEvent } from './lib/main'

export async function handler(event: APIGatewayProxyEvent) {
  console.log('event: ', JSON.stringify(event))

  const eventBusName = process.env.EVENT_BUS_NAME
  const eventSource = process.env.EVENT_SOURCE

  if (!eventBusName) {
    throw new Error('Webhook URL is required as "process.env.EVENT_BUS_NAME"')
  }

  if (!eventSource) {
    throw new Error('Event source is required as "process.env.EVENT_SOURCE"')
  }

  const notification = new EventBridgeRepository(eventBusName, eventSource)
  await sendWebhookEvent(event, notification)

  return {
    statusCode: 204,
    body: null,
  }
}
