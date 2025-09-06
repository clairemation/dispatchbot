const createChangeListener = require("./database/change-listener");

const changeListener = createChangeListener();

changeListener.start();
changeListener.addSubscriber(console.log);