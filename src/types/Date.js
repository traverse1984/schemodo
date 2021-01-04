module.exports = {

    typecast( prop, value ){

        value = new Date( value );

        const dateValue = value.valueOf();

        if( dateValue !== dateValue ){
            throw new Error( 'typecast: Unable to cast to Date' );
        }

        return value;

    },

};