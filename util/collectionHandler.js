const builderHandler = require('./builderHandler');

module.exports = Model => (req, res, next) => {
  builderHandler(Model)(req, res, () => {
    const qb = res.locals.qb;
    if (req.query.page) {
      qb.page(req.query.page - 1, req.query.pageSize || 50);
    } else {
      qb.page(0, 'NULL');
    }
    next();
  });
};
