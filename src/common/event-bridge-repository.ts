import EventBridge from 'aws-sdk/clients/eventbridge'
const eventBridge = new EventBridge()

interface IEventBridgeLib {
  putEvents: Function
}

export class EventBridgeRepository {
  public eventBusName: string
  public eventSource: string
  public eventBus: IEventBridgeLib

  constructor(eventBusName: string, eventSource: string, notificationLib?: IEventBridgeLib) {
    this.eventBusName = eventBusName
    this.eventSource = eventSource
    this.eventBus = notificationLib || eventBridge
  }

  public async send(message: Object) {
    const params: EventBridge.PutEventsRequest = {
      Entries: [{
        Source: this.eventSource,
        DetailType: `Webhook, source: ${this.eventSource}`,
        EventBusName: this.eventBusName,
        Detail: JSON.stringify(message),
      }],
    }

    return this.eventBus.putEvents(params).promise()
  }
}
