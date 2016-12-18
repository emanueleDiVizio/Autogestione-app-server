/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

  /***************************************************************************
  *                                                                          *
  * Your app's default connection. i.e. the name of one of your app's        *
  * connections (see `config/connections.js`)                                *
  *                                                                          *
  ***************************************************************************/
  // connection: 'localDiskDb',

  /***************************************************************************
  *                                                                          *
  * How and whether Sails will attempt to automatically rebuild the          *
  * tables/collections/etc. in your schema.                                  *
  *                                                                          *
  * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html  *
  *                                                                          *
  ***************************************************************************/
   migrate: 'safe',
    connection: 'mongoDb',
	
	updateOrCreate: function(criteria, values, cb){
		var self = this; // reference for use by callbacks
		// If no values were specified, use criteria
		if (!values) values = criteria.where ? criteria.where : criteria;
		
		this.findOne(criteria, function (err, result){
			if(err) return cb(err, false);
			
			if(result){
				self.update(criteria, values, cb);
			}else{
				self.create(values, cb);
			}
		});
	}

};
