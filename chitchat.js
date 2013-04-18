/**
 * https://github.com/cubicleDowns/ChitChat
 */

/**
 * Initialize a new ChitChat Cross Document Messaging
 * @class
 */
var ChitChat = ChitChat || {};

/**
 * Create a new ChitChat packet.
 * @constructor
 * @param {[type]} params [description]
 */
ChitChat.Packet = function (params) {

    this.who = params ? params.who : undefined;

    // types:  reg || framework
    this.type = params ? params.type : undefined;

    // payload
    this.message = params ? params.message : undefined;

    // operation type
    // this.op = params ? params.op : undefined;

    // the targeted subscription type
    this.target = params ? params.target : 'default';

    // Add additional parameters below

};

/**
 * Initialize a new ChitChat provider
 * @constructor
 */
ChitChat.Provider = function () {

    this.id = 'parent';

    this.consumers = [];
    this.origin = undefined;

    // a few example children to reference in an iframe.
    this.demosite = 'chitchat_consumer.html';

    this.init();
};

ChitChat.Provider.prototype = {

    /**
     * Initialize
     * @return {[type]} [description]
     */
    init: function () {
        this.listener();
    },

    /**
     * Registers a consumer.
     * @param {[type]} frameId [description]
     */
    addConsumer: function (e) {
        var pkt = new ChitChat.Packet(),
            domFrame,
            consumer;

        domFrame = $('#' + e.data.message).get(0).contentWindow;
        consumer = { frame: domFrame, origin: e.origin, sub: e.data.target };

        this.consumers.push(consumer);
    },

    /**
     * Send a message to a server side object/controller
     * @return {[type]} [description]
     */
    msgToFramework: function (e) {
        var pkt = new ChitChat.Packet();

    },

    /**
     * Initialize the event listener.  Callback is parseMessage()
     * @return {EventListener} message
     */
    listener: function () {
        window.addEventListener('message', this.routeMessage, false);
    },

    /**
     * Routes a message to consumers subscripted to event target.
     * @param  {Object} e postMessage event object.
     * @return {[type]}   [description]
     */
    routeMessage: function (e) {

        if (e.data.type === 'reg') {
            provider.addConsumer(e);
        } else if (e.data.type === 'framework') {

        } else {
            // not all messages pass operations
            var pkt = new ChitChat.Packet({message: e.data.message}),
                length = provider.consumers.length,
                i = 0;

            for (i = 0; i < length; i++) {
                if (provider.consumers[i].sub === e.data.target) {
                    provider.consumers[i].frame.postMessage(pkt, provider.consumers[i].origin);
                }
            }
        }
    }
};

/**
 * Creates a new postMessage consumer.
 * @class Creates a new Consumer.
 * @param {[type]} params [description]
 */
ChitChat.Consumer = function (sub) {

    this.sub = sub || 'default';

    //NOTE:  This approach may need to change for web-workers.
    this.name = window.frameElement.id;

    this.init();

};

ChitChat.Consumer.prototype = {

    /**
     * Initialize 
     * @return {[type]} [description]
     */
    init: function () {
        this.listeners();
        this.register();
    },

    /**
     * Register this consumer and subscription.
     * @return {[type]} [description]
     */
    register: function () {
        var pkt = new ChitChat.Packet({type: 'reg', message: window.frameElement.id, target: this.sub});
        window.parent.postMessage(pkt, 'http://localhost');
    },

    /**
     * Sends postMessage
     * @param  {String} msg Message for target subscriptors.
     * @return {[type]}     [description]
     */
    sendMessage: function (msg) {
        var pkt = new ChitChat.Packet({message: msg, target: this.sub });
        window.parent.postMessage(pkt, 'http://localhost');
    },

    /**
     * Event listener for postMessage
     * @return {[type]} [description]
     */
    listeners: function () {
        window.addEventListener('message', this.getParentMessage, false);
    },

    /**
     * Gets postMessage and calls local function to handle message
     * @param  {Object} e postMessage event object
     * @return {[type]}   [description]
     */
    getParentMessage: function (e) {

        if (typeof localFunc === 'function') {
            localFunc(e.data.message);
        } else {
            console.error('no local func defined on end point');
        }
    }
};