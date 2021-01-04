const validators = require('../validators'),
      messages = require('../messages');

module.exports = {

    validators: {
        size: validators.size.number,
    },

    messages: {
        size: messages.size.number,
    },

    typecast( prop, value ){

        try {
            return BigInt( parseInt(value) );
        }
        catch( err ){
            throw new Error( 'typecast: Unable to cast to BigInt' );
        }

    },

};