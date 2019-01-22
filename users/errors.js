class NoUserFound extends Error {
  constructor() {
    super();
    this.message = 'Invalid userId';
    this.status = 404;
  }
}

module.exports = {
  NoUserFound: new NoUserFound(),
};
