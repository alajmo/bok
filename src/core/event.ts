export const events = Events();

function Events(all: any) {
  all = all || Object.create(null);

  return {
    on(type, handler) {
      (all[type] || (all[type] = [])).push(handler);
    },

    off(type, handler) {
      if (all[type]) {
        all[type].splice(all[type].indexOf(handler) >>> 0, 1);
      }
    },

    emit(type: string, evt?: any) {
      (all[type] || []).slice().map((handler) => {
        handler(evt);
      });

      (all["*"] || []).slice().map((handler) => {
        handler(type, evt);
      });
    },
  };
}
