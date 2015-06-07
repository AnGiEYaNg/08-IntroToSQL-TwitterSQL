//Answer:
var router = require('express').Router();

var tweetBank = require('../tweetBank');

var models = require('../models')

function routes (io) {
	router.get('/', function (req, res) {
		// send the index.html
		var allTweetsPromise = models.Tweet.findAll({include: [models.User]})

		allTweetsPromise.then(function(allTweets) {
			console.log(JSON.stringify(allTweets, null, 2))
			res.render('index', {
				title: 'Twitter.js - all tweets',
				showForm: true,
				tweets: allTweets
			});
		})

	});

	router.get('/users/:name', function (req, res) {
		var userName = req.params.name,
				user;
		
		models.User
		  .find({ where: { name: userName } })
		  .then(function(user_) {
		  	user = user_
		  	return user.getTweets()
		  })
		  .then(function(tweets) {

		  	tweets = tweets.map(function(tweet) {
		  		tweet.User = user
		  		return tweet
		  	})

				res.render('index', {
					title: 'Posts by - ' + userName,
					showForm: true,
					tweets: tweets
				});
		  })

	});

	router.get('/users/:name/tweets/:id', function (req, res) {
		var tweetId = parseInt(req.params.id)

		models.Tweet
			.findAll({
				where: { id: tweetId },
				include: [models.User]
			})
			.then(function(tweets) {
				res.render('index', {
					title: 'Tweet ' + tweetId + ' by ',
					tweets: tweets
				});
			})

	});

	router.post('/submit', function (req, res) {
		var tweetName = req.body.name,
			tweetText = req.body.text;

		models.User
		  .findOrCreate({ where: { name: tweetName } }, { })
		  .spread(function(user) {
		  	return models.Tweet.create({
		  		UserId: user.id,
		  		tweet: tweetText
		  	})//user.addTweet({ tweet: tweetText })
		  })
		  .then(function(tweet) {
		  	res.redirect('/')
		  })

		// var allTweets = tweetBank.list(),
		// 	newTweet = allTweets[allTweets.length - 1];
		// io.sockets.emit('new_tweet', newTweet);
		// res.redirect('/');
	});

	return router;
}


module.exports = routes;

// var router = require('express').Router();

// var User = require('../models').User;
// var Tweet = require('../models').Tweet;

// // User.find(1).then(function(user) {
// //     user.getTweets().then(function(tweets) {
// //         allTweets.push(tweets[0]['dataValues']['tweet']);
// //   });
// // });


// function routes (io) {
// 	router.get('/', function (req, res) {
// 		// send the index.html
// 		// var allTweets = tweetBank.list();
// 		// var allTweets=[];
// 		//var dataArray=[];
// 	//var tempObj={};
// 	  /*Tweet.findAll({include:[User]}).then(function(tweets) {
		
// 			 tweets.map(function( tweet){
// 				var tempObj={};
					
// 					 tempObj['name']= tweet.dataValues.User.dataValues.name;
// 					  tempObj['tweet']=tweet.dataValues.tweet;
//                  dataArray.push(tempObj);
//       // console.log(dataArray);

// 			});
// 			 //return dataArray;
//            console.log(dataArray);
// 			 res.render('index', {
// 			title: 'Twitter.js - all tweets',
// 			showForm: true,
// 			tweets: dataArray

//   		});

// 	});	*/

// 		var allTweetsPromise=Tweet.findAll({include:[models.User]})

// 		allTweetsPromise.then(function(allTweets){
// 			console.log(JSON.stringify(allTweets,null, 2))
// 		})

		
// 	});

// 	router.get('/users/:name', function (req, res) {
// 		var userName = req.params.name;
// 		var dataArray=[];
// 			//userTweets = tweetBank.find({name: userName});
// 	  User.find({where: {name:userName}}).then(function(user) {
// 		user.getTweets().then(function(tweets) {

//         	res.render('index', {
// 				title: 'Posts by - ' + userName,
// 				showForm: true,
// 				tweets: tweets
// 			});
//         });

// 		 });
// 	});

// 	router.get('/users/:name/tweets/:id', function (req, res) {
// 		var userName = req.params.name,
// 			tweetId = parseInt(req.params.id);
// 			//userTweets = tweetBank.find({id: tweetId});
// 	  	User.find({where: {name:userName}}).then(function(user) {
// 		user.getTweets({where:{id:tweetId}, include:[User]}).then(function(tweets) {

//         	res.render('index', {
// 				title: 'Tweet ' + tweetId + ' by ' + userName,
// 				tweets: tweets
// 			});
//         });

// 		 });
// 		// res.render('index', {
// 		// 	title: 'Tweet ' + tweetId + ' by ' + userName,
// 		// 	tweets: userTweets
// 		// });
// 	});

// 	router.post('/submit', function (req, res) {
// 		//if name exist then add tweet with name, else create name, create tweet
// 		var tweetName = req.body.name,
// 			tweetText = req.body.text;
// 		User
// 		.findOrCreate({where:{name:tweetName}},{})
// 		.then(function(){

// 		})

		
// 		io.sockets.emit('new_tweet', newTweet);
// 		res.redirect('/');
// 	});

// 	return router;
// }


// module.exports = routes;