const map = require('./Map');

module.exports = {

    init( value ){

        if( value.constructor === undefined ){
            return Object.create(null);
        }
        
        return {};

    },

    get( target, key ){
        return target[key];
    },

    set( target, key, value ){
        target[key] = value;
    },

    assert( value ){

        if( ! value || typeof value !== 'object' ){
            return false;
        }

        return value.constructor === Object 
            || value.constructor === undefined;

    },

    normalize( defn ){

        defn = { ...defn, };

        if( 'type' in defn ){

            return defn;

        } else {

            const prop = { type: defn.constructor, };

            if( Object.keys(defn).length ){
                prop.props = defn;
            }
            
            return prop;

        }

    },

    prepare( prop, name, path ){
        
        return map.prepare.call( this, prop, name, path );

    },

};



