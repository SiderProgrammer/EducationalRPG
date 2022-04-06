let instance;

export class EventManager extends Phaser.Events.EventEmitter {
  constructor() {
    super();
    if (instance == null) {
      instance = this;
    }
  }

  static getInstance(newInstance) {
    if (instance == null || newInstance) {
      instance = new EventManager();
    }
    return instance;
  }
}
