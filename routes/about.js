
/*
 * GET about page.
 */

exports.show = function(req, res) {
  res.render('about', {
    user : req.user,
    data_page: 'about'
  });
};
