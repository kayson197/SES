
/*
 * GET home page.
 */

exports.normal_login = function(req, res) {
  var event_code = req.flash('event_code');
  if(event_code.length>0){
    res.redirect('/login/'+event_code);
  }
  else{
    // render the page and pass in any flash data if it exists
    res.render('login', {
      user : req.user,
      data_page: 'login',
      message: req.flash('loginMessage'),
      activate_message: req.flash('activateMessage'),
      username: req.flash('username'),
      event_code: ''
    });
  }
};

exports.reward_login = function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login', {
    user : req.user,
    data_page: 'login',
    message: req.flash('loginMessage'),
    activate_message: req.flash('activateMessage'),
    username: req.flash('username'),
    event_code: req.params.event_code
  });
};

exports.process = function(req, res) {
  console.log("hello"+req.body);
  if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
  res.redirect('/');
};


exports.forgotpw = function(req, res){
  res.render('forgot_password',{
    user : req.user,
    data_page: 'login'
  });
};



