const types = module.exports = new Map(),
      $validators = require('../validators'),
      $messages = require('../messages');

const _set = types.set.bind( types );

types.set = function set( construct, type ){

    const { validators, messages } = type;

    type.validators = Object.create({
        required: $validators.required,
        type: $validators.type,
    });

    type.messages = Object.create({
        $default: $messages.$default,
        $or: $messages.$or,
        required: $messages.required,
        type: $messages.type,
    });

    Object.assign( type.validators, validators || {} );
    Object.assign( type.messages, messages || {} );

    _set( construct, type );

};

types.set( null,     require('./null')     );
types.set( Function, require('./Function') );
types.set( Object,   require('./Object')   ); 
types.set( Map,      require('./Map')      ); 
types.set( Array,    require('./Array')    ); 
types.set( Set,      require('./Set')      );
types.set( Boolean,  require('./Boolean')  );
types.set( String,   require('./String')   );
types.set( Number,   require('./Number')   );
types.set( BigInt,   require('./BigInt')   );
types.set( Date,     require('./Date')     );
types.set( RegExp,   require('./RegExp')   );
types.set( Symbol,   require('./Symbol')   );