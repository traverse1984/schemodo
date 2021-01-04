const validators = require('../validators'),
      messages = require('../messages');

module.exports = {

    validators: {
        length: validators.length,
        enum: validators.enum,
        match: validators.match,
    },

    messages: {
        length: messages.length,
        enum: messages.enum,
        match: messages.match,
    },

    typecast( prop, value ){

        const type = typeof value;

        if(
            type === 'number' ||
            type === 'bigint' ||
            type === 'boolean' ||
            value instanceof Date
        ){
                
                value = value.toString();

        } else if( type !== 'string' ){

            throw new Error( 'typecast: Unable to cast to string' );

        }
        
        if( prop.trim ){
            value = value.trim();
        }

        if( prop.lower ){
            value = value.toLowerCase();
        }
        else if( prop.upper ){
            value = value.toUpperCase();
        }

        return value;
        

    },

};