module.exports = function(app, passport) {

  //load routes
  var index = require('./index.js');
  var login = require('./login.js');
  var signup = require('./signup.js');
  var events = require('./events.js');
  var reward = require('./reward.js');
  var about = require('./about.js');
  var profile = require('./profile.js');
  var customers = require('./customers.js');

  /////////////////////////////////Home Page///////////////////////////////////////////
  app.get('/', index.show);

  /////////////////////////////////Login///////////////////////////////////////////////
  app.get('/login', login.normal_login);
  app.get('/login/:event_code', login.reward_login);
  app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
      }), login.process);

  /////////////////////////////////SIGNUP///////////////////////////////////////////////
  app.get('/signup', signup.show);
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/signup', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  ////////////////////////////////Verify Email ///////////////////////////////////////////
  app.get('/activate/:activate_code', signup.verify);

  /////////////////////////////////FORGOT PASSWORD///////////////////////////////////////////////
  app.get('/forgotpw', login.forgotpw);

  ///////////////////////////////////////ABOUT////////////////////////////////////////////
  app.get('/about', about.show);

  ///////////////////////////////////////EVENTS////////////////////////////////////////////
  app.get('/events', events.list);
  app.get('/eventdetail/:event_code_view', events.showDetail);
  app.get('/myevents', isLoggedIn, events.mylist);
  app.get('/myeventdetail/:event_code_view', events.showMyDetail);
  app.get('/myevents/add', isLoggedIn, events.add);
  app.post('/myevents/add', isLoggedIn, events.save);
  /////////////////////////////////PROFILE///////////////////////////////////////////////
  app.get('/profile', isLoggedIn, profile.show);

  ////////////////////////////////Get Reward ///////////////////////////////////////////
  app.get('/reward/:event_code', reward.process);

  app.get('/customers', customers.list);
  app.get('/customers/add', customers.add);
  app.post('/customers/add', customers.save);
  app.get('/customers/delete/:id', customers.delete_customer);
  app.get('/customers/edit/:id', customers.edit);
  app.post('/customers/edit/:id',customers.save_edit);

  /////////////////////////////////LOG OUT///////////////////////////////////////////////
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  if(req.params.event_code != null && req.params.event_code.length>0)
    res.redirect('/login/'+req.params.event_code);
  else
    res.redirect('/login');
}

