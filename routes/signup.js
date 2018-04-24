
/*
 * GET home page.
 */


exports.show = function(req, res){
  res.render('signup', {
    user : req.user,
    data_page: 'signup',
    message: req.flash('signupMessage'),
    signup_success: req.flash('signupSuccess')
  });
};

exports.verify = function(req, res) {
  var activate_code = req.params.activate_code;
  req.getConnection(function (err, connection) {
    connection.query('select * from ses_activation WHERE activate_code = ? and status = ? and expired_time > now()',[activate_code, '1'], function(err, rows)
    {
      if(err)
        console.log("Error getting activation : %s ",err );
      if (rows.length) {
        var username = rows[0].username;
        var activateAccount = "update ses_users set status = ?, activated_time = now() where username = ?";
        connection.query(activateAccount, ['1', username], function (err, rows) {
          if(err)
            console.log("Error activate account : %s ",err );
          else{
            var deactiveActivateLink = "update ses_activation set status = ? where activate_code = ?";
            connection.query(deactiveActivateLink, ['0', activate_code], function (err, rows) {
              if (err)
                console.log("Error deactive activate link : %s ", err);
              else{
                req.flash('activateMessage', 'Your account is actived, please login now');
                req.flash('username', username);
                res.redirect('/login');
              }
            });
          }
        });
      }else {
        res.send('aaa');
      }
    });
  });
};



