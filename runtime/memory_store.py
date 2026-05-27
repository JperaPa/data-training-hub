class MemoryStore:
    def __init__(self):
        self.store = {}

    def save(self, key, value):
        self.store[key] = value

    def get(self, key, default=None):
        return self.store.get(key, default)
