class MessageBus:
    def __init__(self):
        self.events = {}

    def publish(self, event_name, payload):
        self.events[event_name] = payload

    def get(self, event_name):
        return self.events.get(event_name)
