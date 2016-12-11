/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
        name: {
            type: 'string',
            required: true    
        },
        surname: {
            type: 'string',
            required: true    
        },
        class: {
            type: 'string',
            required: true    
        },
        email: {
            type: 'email',
            required: true
        },
        password: {
            type: 'string',
            required: true    
        }

    },

    signup: function(inputs, cb){
        User.create({
            name: inputs.name,
            surname: inputs.surname,
            class: inputs.class,
            email: inputs.email,
            password: inputs.password,
        })
        .exec(cb);
    },
    
    attemptLogin: function(inputs, cb){
        User.findOne({
            email: inputs.email,
            password: inputs.password
        })
        .exec(cb);
    }
};

