type EventHandler = (evt?: any) => void;
type WildcardHandler = (type: string, evt?: any) => void;
type EventMap = Record<string, (EventHandler | WildcardHandler)[]>;

export const events = Events();

function Events(all?: EventMap) {
  all = all || Object.create(null);

  return {
    on(type: string, handler: EventHandler | WildcardHandler) {
      (all![type] || (all![type] = [])).push(handler);
    },

    off(type: string, handler: EventHandler | WildcardHandler) {
      if (all![type]) {
        all![type].splice(all![type].indexOf(handler) >>> 0, 1);
      }
    },

    emit(type: string, evt?: any) {
      (all![type] || []).slice().map((handler: EventHandler) => {
        handler(evt);
      });

      (all!["*"] || []).slice().map((handler: WildcardHandler) => {
        handler(type, evt);
      });
    },
  };
}
