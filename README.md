ChitChat
========

ChitChat is a lighweight simple JavaScript library that uses the HTML5 postMessage feature to communicate messages across iframes in a single window.

###ChitChat library goals:###
1. lightweight
2. consumers can self-register with provider
3. will provide following 'comm channels':
    * provider::consumer
    * provider::consumers
    * provider::server-side framework
    * consumer::parent
    * consumer::(provider)::consumer
    * consumer::(provider)::consumers
    * consumer::(provider)::server-side framework

Download the [minified library]() and include it in your html.

You'll need to initiate the provider in the parent frame.

[Examples](https://github.com/cubicleDowns/ChitChat/examples/dynamic-concumers/) — [Documentation](https://github.com/cubicleDowns/ChitChat/docs/)

##Provider Init##
```html
<script src="js/chitchat.min.js"></script>

<script defer>
    var provider = new ChitChat.Provider();
</script>
```

Once the provider is initialized, Consumers that register to the parent will receive a response with an array of registered Consumers.  Consumers can use this for Consumer to Consumer registration.

##Consumer Init##
```html
<script src="js/chitchat.min.js"></script>

<script defer>
    var consumer = new ChitChat.Consumer();
</script>
```

Communication in ChitChat is defined by packets.   Packets provide a basic structure for routing and registration.   Here is an example of 

##ChitChat Packet Init##
```html
var pkt = new ChitChat.Packet({type: 'c2e', message: message});
```

Place your JS Object onto the message parameter or extend the Packet with your own parameters.

##ChitChat Packet##
```html
ChitChat.Packet = function (params) {

    this.who = params ? params.who : undefined;

    // types:  reg || c2p || c2c || c2e || c2f || update(consumers)
    this.type = params ? params.type : undefined;
    this.message = params ? params.message : undefined;
    this.op = params ? params.op : undefined;

    // Add additional parameters below
};
```
