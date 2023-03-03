interface PubSub {
  publish: (message: string, data: any) => boolean;
  publishSync: (message: string, data: any) => boolean;
  subscribe: (message: string, func: (any: any) => any) => string;
  unsubscribe: (message: string) => boolean;
  subscribeOnce: (message: string, func: (any: any) => any) => PubSub;
  subscribeAll: (func: (any: any) => any) => boolean;
  clearAllSubscriptions: () => {};
  clearSubscriptions: () => {};
  getSubscriptions: () => [];
}
