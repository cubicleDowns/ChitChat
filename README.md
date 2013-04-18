ChitChat
========

ChitChat is a lighweight simple JavaScript library that uses the HTML5 postMessage feature to communicate messages across iframes in a single window.

###ChitChat library goals:###
1. lightweight
2. consumers can self-register with provider
3. consumers can subscribe to a single broadcast type
4. At the consumer, the message listening function passes the message to a local function.   Aptly called, localFunc.

Download the [minified library]() and include it in your html.

You'll need to initiate the provider in the parent frame.

[Examples](https://github.com/cubicleDowns/ChitChat/examples/dynamic-concumers/) — [Documentation](https://github.com/cubicleDowns/ChitChat/docs/)

##Provider Init##
```html
<script src="js/chitchat.js"></script>

<script defer>
    var provider = new ChitChat.Provider();
</script>
```

Once the provider is initialized, consumers register a subscription type.   When a consumer posts a message, it will be passed along to all consumers with the target subscription.

##Consumer Init##
```html
<script src="js/chitchat.js"></script>

<script defer>
   // subscribing to 'book' messages
    var consumer = new ChitChat.Consumer('book');
</script>
```

Communication in ChitChat is defined by packets.   Packets provide a basic structure for routing and registration.   Here is an example of 

##ChitChat Packet Init##
```html
<script>
    var pkt = new ChitChat.Packet({message: msg, target: this.sub });
</script>
```

Place your JS Object onto the message parameter or extend the Packet with your own parameters.

##ChitChat Packet##
```html
<script>
ChitChat.Packet = function (params) {
    this.who = params ? params.who : undefined;

    // types:  reg || framework
    this.type = params ? params.type : undefined;

    // payload
    this.message = params ? params.message : undefined;

    // the targeted subscription type
    this.target = params ? params.target : 'default';

    // Add additional parameters below
};
</script>
```
