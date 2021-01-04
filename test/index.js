const path = require('path'),
      fs = require('fs'),
      sm = require('../src/schemodo');

sm.Schema.defaults.execAsync = false;

describe( 'Native Types', function(){

    const types = path.resolve( __dirname, 'types' );

    fs.readdirSync(types).forEach( unit => {
        require(`${types}/${unit}`);
    } );

} );

require('./schema/schemodo');
require('./schema/props');
require('./schema/root');
require('./schema/native-types');
require('./schema/stacks');
require('./schema/subschemas');
require('./schema/or');
require('./schema/custom-types');