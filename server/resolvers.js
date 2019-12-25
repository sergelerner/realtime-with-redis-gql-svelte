const pubsub = require("./pubsub");
const { get, set } = require("./redis");

const COMPONENTS = {
  WHITE_LIST: "wl",
};

const publishRandomData = async (generator, component) => {
  const data = generator();
  pubsub.publish(component, { [component]: data });
  await set(component, data);
  return data;
};

module.exports = {
  Query: {
    wl: () => [
      { name: 'android_ios_onelink_install_cuid', all: true, list: ['one', 'two'] },
      { name: 'fraud_bad_model', all: true, list: ['one', 'two'] },
      { name: 'ms-B', all: true, list: ['one', 'two'] },
    ], //get(COMPONENTS.WHITE_LIST),
  },
  Mutation: {
    wl: () => true,
  },
  Subscription: {
    wl: {
      subscribe: () => pubsub.asyncIterator(COMPONENTS.WHITE_LIST)
    },
  }
};
