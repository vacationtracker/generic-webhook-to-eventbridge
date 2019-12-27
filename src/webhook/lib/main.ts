import { APIGatewayProxyEvent } from 'aws-lambda'

interface INotificationRepository {
  send: (message: Object) => Promise<any>
}

export async function sendWebhookEvent(event: APIGatewayProxyEvent, notification: INotificationRepository) {
  try {
    const eventCopy = Object.assign({}, event)
    if (eventCopy.body && /^application\/json($|;)/.test(eventCopy.headers['Content-Type'])) {
      eventCopy.body = JSON.parse(eventCopy.body)
    }

    return await notification.send(eventCopy)
  } catch (err) {
    return await notification.send(event)
  }
}
