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

        const number = parseFloat( value );

        if( number !== number ){
            throw new Error( 'typecast: Unable to cast to Number' );
        }

        return number;

    },

};