module.exports = {

    typecast( prop, value ){

        if( prop.parse !== false ){

            if( value === 'no' || value === 'false' || value === '0' ){
                return false;
            }

        }

        if( prop.strict ){

            if( value === true || value === false ){

                return value;

            } else if( prop.parse !== false ){

                if( value === 0 ){
                    return false;
                }

                if( value === 'yes' || value === 'true' || value === '1' || value === 1 ){
                    return true;
                }

            }
            
            throw new Error( 'typecast: Did not pass strict boolean checking' );
            
        }

        return !! value;

    },

};