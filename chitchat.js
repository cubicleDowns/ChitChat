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

    // types:  reg || c2p || c2c || c2e || c2f || update(consumers)
    this.type = params ? params.type : undefined;
    this.message = params ? params.message : undefined;
    this.op = params ? params.op : undefined;

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
        consumer = { name: e.data.message, frame: domFrame, origin: e.origin };

        this.consumers.push(consumer);

        var consumers = this.consumers;

        this.sendUpdatedConsumers();
    },

    /**
     * Remove the iframe element.   Remove the element consumer array reference as well.
     * @param  {[type]} name iframe ID
     * @return {Boolean}      True if successful.
     */
    removeConsumer: function (name) {

        var index = this.findConsumer(name),
            consumer = (index !== -1) ? this.consumers[index] : false;

        if (consumer) {
            // removng iFrame reference from register
            this.consumers.splice(index, 1);
            $('#' + name).remove();
            console.info(name + ' removed');
            return true;
        } else {
            console.error(name + ' not found in provider register');
            return false;
        }
    },

    /**
     * Finds the consumer object in the consumers array by name.
     * @param  {String} name Name of the iFrame you're trying to find.
     * @return {Object || Bool}  Returns the object or false; 
     */
    findConsumer: function (name) {
        var length = this.consumers.length,
            i;

        for (i = 0; i < length; i++) {
            if (this.consumers[i].name === name) {
                return this.consumers[i];
            }
        }

        return false;
    },

    /**
     * Send a message to a single consumer.
     * @param  {String} destination ID value of the destination frame.
     * @param  {String} msg    Message payload.
     * @return {[type]}        [description]
     */
    msgToConsumer: function (e) {
        var consumer = this.findConsumer(e.data.who),
            pkt = new ChitChat.Packet({who: e.data.who, message: e.data.message, type: 'c2c'});

        if (consumer) {
            consumer.frame.postMessage(pkt, consumer.origin);
        } else {
            console.error('Couldnt find destination consumer: ' + e.data.who);
        }
    },

    /**
     * Sends a message to all consumers.
     * @param  {String} msg Message to send to everyone.
     * @return {[type]}     [description]
     */
    msgToConsumers: function (e) {

        // not all messages pass operations
        var op = e.data.op || '';

        var pkt = new ChitChat.Packet({type: 'c2e', message: e.data.message, op: op}),
            length = this.consumers.length,
            i = 0;

        for (i = 0; i < length; i++) {
            this.consumers[i].frame.postMessage(pkt, this.consumers[i].origin);
        }
    },

    /**
     * Send a message to a server side object/controller
     * @return {[type]} [description]
     */
    msgToFramework: function () {

    },

    /**
     * Current hte parent simply logs the sent message
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    msgToParent: function (msg) {
        $('#log').text(msg);
    },

    /**
     * Initialize the event listener.  Callback is parseMessage()
     * @return {EventListener} message
     */
    listener: function () {
        window.addEventListener('message', this.parseMessage, false);
    },

    /**
     * Initialize an iframe consumer on the provider page.
     * @return {[type]} [description]
     */
    createConsumer: function () {

        var source = $("#iframe-template").html(),
            template = Handlebars.compile(source),
            context = {nextframe: this.consumers.length + 1, src: this.demosite},
            html = template(context);

        $('body').append(html);
        $('#consume' + context.nextframe).draggable({grid: [20, 20], handle: "div"});

    },

    /**
     * Whenever a new consumer is added to the controller, the updated
     * list must be sent to the consumers.  This allows consumers to specify a new destination.
     * @return {[type]} [description]
     */
    sendUpdatedConsumers: function () {
        var consumers = [],
            length = this.consumers.length,
            pkt = new ChitChat.Packet(),
            i;

        for (i = 0; i < length; i++) {
            consumers.push(this.consumers[i].name);
        }

        pkt.type = 'update';
        pkt.message = consumers;

        for (i = 0; i < length; i++) {
            this.consumers[i].frame.postMessage(pkt, this.consumers[i].origin);
        }

    },

    /**
     * Parses message from consumer and redirects appropriately
     * @param  {Event} e Post message container.
     * @return {[type]}   [description]
     */
    parseMessage: function (e) {
    //reg || c2p || c2c || c2e || c2f
        var pkt;

        switch (e.data.type) {
            case 'reg':
                provider.addConsumer(e);
                break;
            case 'c2e':
                provider.msgToConsumers(e);
                break;
            case 'c2c':
                provider.msgToConsumer(e);
                break;
            case 'c2p':
                provider.msgToParent(e.data.message);
                break;
            case 'c2f':
                provider.msgToFramework(e.data.message);
                break;
            default:
                console.error('Incorrect message type from consumer');
        }
    }
};
/**
 * Creates a new postMessage consumer.
 * @class Creates a new Consumer.
 * @param {[type]} params [description]
 */
ChitChat.Consumer = function () {

    //NOTE:  By default, the
    this.name = window.frameElement.id;
    this.who = undefined;
    this.messageBox = $('message');

    this.peers = [];

    this.init();

};

ChitChat.Consumer.prototype = {

    /**
     * Initialize 
     * @return {[type]} [description]
     */
    init: function () {
        this.listeners();
        this.registerWithProvider();
    },

    updateConsumerList: function (peers) {
        var length = peers.length,
            i;
        this.peers = peers;

        $('#consumers').empty();

        for (i = 0; i < length; i++) {
            $('#consumers').append($('<option></option>').attr("value", peers[i]).text(peers[i]));
        }

    },

    registerWithProvider: function () {
        var pkt = new ChitChat.Packet({type: 'reg', message: window.frameElement.id});
        this.sendMessage(pkt);
    },

    sendMessage: function (msg) {
        window.parent.postMessage(msg, 'http://localhost');
    },

    //c2e
    msgEveryone: function (message) {
        var pkt = new ChitChat.Packet({type: 'c2e', message: message});
        this.sendMessage(pkt);
    },

    msgCustom: function (pkt) {
        this.sendMessage(pkt);
    },

    // c2f
    msgFramework: function (message) {
        var pkt = new ChitChat.Packet({type: 'c2f', message: message});
        this.sendMessage(pkt);
    },

    //c2c
    msgConsumer: function (consumerId, message) {
        var pkt = new ChitChat.Packet({type: 'c2c', who: consumerId, message: message});
        this.sendMessage(pkt);
    },

    msgParent: function (message) {
        var pkt = new ChitChat.Packet();
        pkt.type = 'c2p';
        pkt.message = message;
        this.sendMessage(pkt);
    },

    listeners: function () {
        window.addEventListener('message', this.getParentMessage, false);
    },

    onSelectChange: function () {
        var dest = $('#consumers option:selected').text();
        consumer.msgConsumer(dest, 'msg from ' + consumer.name);
    },

    getParentMessage: function (e) {
        if (e.data.type === 'update') {
            $('#log').text('parent update received');
            consumer.updateConsumerList(e.data.message);
        } else if (e.data.op === 'select') {
            // calls local function
            $('#log').text(e.data.message);

            if (typeof localFunc == 'function') {
                localFunc(e.data.message);
            }

        } else {
            $('#log').text(e.data.message);
        }
    }
};