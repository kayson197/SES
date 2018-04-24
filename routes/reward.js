
/*
 * GET home page.
 */


exports.process = function(req, res) {
  var event_code = req.params.event_code;
  var reward_point = 0;
  req.getConnection(function (err, connection) {
    connection.query('select * from ses_event WHERE event_code = ? and status = ? and open_time <= now() and closed_time >= now()',[event_code, '1'], function(err, rows)
    {
      if(err)
        console.log("Error getting event : %s ",err );
      else{
        if (rows.length) {
          if (req.isAuthenticated()){
            req.flash('event_code', event_code);
            req.flash('reward_point', rows[0].reward);
            res.redirect('/');
          } else{
            req.flash('reward_point', rows[0].reward);
            req.flash('activateMessage', 'Please login to get reward');
            res.redirect('/login/'+event_code);
          }
        }else {
          req.flash('event_code', '-1');
          res.redirect('/');
        }
      }
    });
  });

};



