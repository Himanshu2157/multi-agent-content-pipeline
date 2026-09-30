import { EventEmitter } from 'events';

class GenerationEventBus extends EventEmitter {}

export const generationEvents = new GenerationEventBus();
// Increase listener limit for concurrent connections
generationEvents.setMaxListeners(100);
