
/*
 * GET about page.
 */

exports.show = function(req, res) {
  res.render('profile', {
    user : req.user,
    data_page: 'profile'
  });
};
