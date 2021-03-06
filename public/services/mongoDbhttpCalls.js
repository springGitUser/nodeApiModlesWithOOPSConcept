
let REQURIED_MODULE = require('../services/nodemodules.js');

exports.createRecord = (url, dataBase, collection, data, cb) => {
	//console.log('URL'+ url+"dbName"+dataBase);

	REQURIED_MODULE.MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

		let dbo = db.db(dataBase);
		let myobj = data;
		let backStatus;
		dbo.collection(collection).insertOne(myobj, function (err, res) {
			if (err) {

				backStatus = {
					code: 400,
					message: "Oops!.. somthing went wrong " + err
				}

				cb(null, backStatus);
			} else {
				if (res.result.ok == 1) {
					console.log("inside if ");
					backStatus = {
						code: 201,
						message: "Data submitted successfully."
					}
					cb(null, backStatus);
				}
			};
			db.close();
		});
	});
};

exports.fetchLoginData = (url, dataBase, collection, data, cb) => {

	//console.log(url,data,dataBase,collection);
	REQURIED_MODULE.MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

		let dbo = db.db(dataBase);
		let myobj = { _id: data };
		let backStatus;

		dbo.collection(collection).findOne(myobj, function (err, res) {
			if (err) {

				backStatus = {
					code: 400,
					message: "Oops!.. somthing went wrong " + err
				}

				cb(null, backStatus);
			} else {

				//console.log('res',res);
				backStatus = {
					code: 200,
					message: res
				}
				cb(null, backStatus);
			}

			db.close();
		});
	});


};


exports.getAllRecords = (url, dataBase, collection, cb) => {

	
	console.log("get all");
	REQURIED_MODULE.MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
		//console.log('why this calling ');
		if (err) throw err;
		var dbo = db.db(dataBase);
		var cursor = dbo.collection(collection).find();

		// Execute the each command, triggers for each document
		let FinalData = [];
		cursor.each(function (err, item) {

			if (item !== null) {
				FinalData.push(item);
				//console.log('still pushing....');
			} else {
				console.log('no more records')
				backStatus = {
					code: 200,
					message: FinalData
				}
				cb(null, backStatus);
			}
			db.close();
		});


		// If the item not is null then the cursor is exhausted/empty and closed

	});
};

exports.updateData = (url, dataBase, collection,id,data, cb) => {
	console.log('updating');
	REQURIED_MODULE.MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dataBase);
		// this is the  existing name feild  
		var myquery = { _id:id };
		// new values passing to the db and updating. 
		var newvalues = { $set: data};
		dbo.collection(collection).updateOne(myquery, newvalues, function(err, res) {
		  if (err) throw err;
		  console.log("1 document updated");
		  backStatus = {
			code: 200,
			message: 'updated'
		}
		  cb(null,backStatus)
		  db.close();
		});
	  });

}

exports.delete = (url, dataBase, collection,id, cb)=>{
	
	console.log('delete');

	REQURIED_MODULE.MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dataBase);
		var myquery = { _id: id };
		dbo.collection(collection).deleteOne(myquery, function(err, obj) {
		  if (err) throw err;
		  console.log("1 document deleted");
		  backStatus = {
			code: 200,
			message: 'Deleted'
		}
		  cb(null,backStatus)
		  db.close();
		});
	 });

}
//Ravi new method
exports.checkUserExists = (url, dataBase, collection, data, cb) => {
	console.log("user exits or not");
	REQURIED_MODULE.MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

		let dbo = db.db(dataBase);
		let myobj = { _id: data };
		let backStatus;

		//To Return Only Specific Field from Mongodb Use Projection
		dbo.collection(collection).findOne(myobj,{projection: { _id: true }}, function (err, res) {
			if (err) {
				backStatus = {
					code: 400,
					message: "Oops!.. somthing went wrong " + err
				}
				cb(null, backStatus);
			} else {
				console.log('resPonse-->',res);
				backStatus = {
					code: 200,
					message: res
				}
				cb(null, backStatus);
			}
			db.close();
		});
	});
};

exports.activateUserEmail = (url, dataBase, collection,data, cb) => {
	console.log('updating');
	REQURIED_MODULE.MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dataBase);
		// this is the  existing name feild  
		// new values passing to the db and updating the emailVerfied Field to True. 
		var myquery = { _id:data._id };
		console.log('Updating...'+data._id);
		var newvalues = { $set: {emailVerified:true} };
		dbo.collection(collection).updateOne(myquery, newvalues, function(err, res) {
		  if (err) throw err;
		  console.log("1 document updated");
		  backStatus = {
			code: 200,
			message: 'updated'
		}
		  cb(null,backStatus)
		  db.close();
		});
	  });

}

exports.fetchTheUserData =  (url, dataBase,id,collection, cb)=>{
	console.log('fetch the data ',dataBase,id,collection );
	REQURIED_MODULE.MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
		//console.log('why this calling ');
		if (err) throw err;
		var dbo = db.db(dataBase);
		var cursor = dbo.collection(collection).find();

		// Execute the each command, triggers for each document
		let FinalData = [];
		cursor.each(function (err, item) {

			if (item !== null) {
				if(item.contactBelongsTo == id){
					FinalData.push(item);
				}
			
				//console.log('still pushing....');
			} else {
				console.log('no more records')
				backStatus = {
					code: 200,
					message: FinalData
				}
				cb(null, backStatus);
			}
			db.close();
		});


		// If the item not is null then the cursor is exhausted/empty and closed

	});

}