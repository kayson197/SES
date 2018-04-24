
/*
 * GET home page.
 */

exports.show = function(req, res){
  var event_code = req.flash('event_code');
  var reward_point = 0;

  if(event_code!= null  && event_code.length>0){
    if(event_code=='-1'){
      res.render('reward', {
        user : req.user, // get the user out of session and pass to template
        data_page : 'index',
        reward_point: reward_point,
        event_code: event_code,
        message: 'This event does not exits, not yet opened, or expired!'
      });
    }else {
      var username = req.user.username;
      reward_point = req.flash('reward_point');
      req.getConnection(function (err, connection) {
        connection.query('select * from ses_event_detail WHERE event_code = ? and username = ?',[event_code, username], function(err, rows)
        {
          if(err)
            console.log("Error selecting : %s ",err );
          if (rows.length) {
            res.render('reward', {
              user : req.user, // get the user out of session and pass to template
              data_page : 'reward',
              reward_point: reward_point,
              event_code: event_code,
              message: 'You got reward of this event already!'
            });
          } else {
            var insertEventDetail = "INSERT INTO ses_event_detail ( event_code, username, status, created_time) values (?,?,?,now())";
            connection.query(insertEventDetail, [event_code, username, '1'], function (err, rows) {
              if(err)
                console.log("Error Inserting Event Detail : %s ",err );
              else{
                var creditReward = "UPDATE ses_users set balance = balance + ? where username = ?";
                connection.query(creditReward, [reward_point, username], function (err, rows) {
                  if(err)
                    console.log("Error credit coins : %s ",err );
                  var updateCounter = "update ses_event set participants_joined_count = participants_joined_count+1 where event_code = ?"
                  connection.query(updateCounter, [event_code], function (err, rows) {
                    if (err)
                      console.log("Error update participants_joined_count : %s ",err );

                    });
                  req.user.balance = parseFloat(req.user.balance)+parseFloat(reward_point);
                  res.render('reward', {
                    user : req.user, // get the user out of session and pass to template
                    data_page : 'reward',
                    reward_point: reward_point,
                    event_code: event_code,
                    message: ''
                  });
                });
              }
            });
          }
        });
      });
    }
  }else{
    res.render('index', {
      user : req.user,
      data_page : 'index',
      title: 'Singtel Staff Engagement'
      //reward_code: req.flash('reward_code')
    });
  }
};



