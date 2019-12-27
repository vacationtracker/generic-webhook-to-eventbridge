import { EventBridgeRepository } from '../event-bridge-repository'

describe('Event Bridge Repository', () => {
  describe('unit', () => {
    it('should set an event bus name and event source', () => {
      const notifiction = new EventBridgeRepository('testBusName', 'eventSource')
      expect(notifiction.eventBusName).toBe('testBusName')
      expect(notifiction.eventSource).toBe('eventSource')
    })

    it('should set an SNS library', () => {
      const eventBusMock = {
        putEvents: jest.fn(),
      }
      const notifiction = new EventBridgeRepository('testBusName', 'eventSource', eventBusMock)
      expect(notifiction.eventBus).toBe(eventBusMock)
    })

    it('should send a message to an event bus', async () => {
      const eventBusMock = {
        putEvents: jest.fn().mockReturnValue({ promise: () => Promise.resolve() }),
      }
      const notifiction = new EventBridgeRepository('testBusName', 'eventSource', eventBusMock)
      await notifiction.send('test')
      expect(eventBusMock.putEvents).toHaveBeenCalledTimes(1)
      expect(eventBusMock.putEvents).toHaveBeenCalledWith({
        Entries: [{
          Detail: '"test"',
          DetailType: 'Webhook, source: eventSource',
          EventBusName: 'testBusName',
          Source: 'eventSource',
        }],
      })
    })

    it('should stringify an object when send as a message', async () => {
      const eventBusMock = {
        putEvents: jest.fn().mockReturnValue({ promise: () => Promise.resolve() }),
      }
      const notifiction = new EventBridgeRepository('testBusName', 'eventSource', eventBusMock)
      await notifiction.send({ test: true })
      expect(eventBusMock.putEvents).toHaveBeenCalledTimes(1)
      expect(eventBusMock.putEvents).toHaveBeenCalledWith({
        Entries: [{
          Detail: '{"test":true}',
          DetailType: 'Webhook, source: eventSource',
          EventBusName: 'testBusName',
          Source: 'eventSource',
        }],
      })
    })
  })
})
