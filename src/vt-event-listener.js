const { nodeRedAdapter } = require('./node-red-adapter');

var moduleName = 'vt-test';

module.exports = function(RED) {
  'use strict';

  // The main node definition - most things happen in here
  function nodeGo(config) {
    // Create a RED node
    RED.nodes.createNode(this,config);

    // Store local copies of the node configuration (as defined in the .html)
    this.topic = config.topic;
    this.input = config.input || 'payload'; // where to take the input from

    // copy "this" object in case we need it in context of callbacks of other functions.
    var node = this;

    // respond to inputs....
    node.on('input', function (msg) {
      'use strict'; // We will be using eval() so lets get a bit of safety using strict

      console.log('input ->', this.input);
      node.log('input ->', this.input);

      // get input settings
      var v = msg.payload.hasOwnProperty(this.input) ? msg.payload[this.input] : msg.payload;

      console.log('v ->', v);
      node.log('v ->', v);

      nodeRedAdapter(node, msg);
    });

  } // ---- end of nodeGo function ---- //

  // Register the node by name. This must be called before overriding any of the
  // Node functions.
  RED.nodes.registerType(moduleName,nodeGo);
};
