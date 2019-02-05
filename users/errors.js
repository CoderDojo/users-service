class NoUserFound extends Error {
  constructor() {
    super();
    this.message = 'Invalid userId';
    this.status = 404;
  }
}
class NoProfileFound extends Error {
  constructor() {
    super();
    this.message = 'Invalid user: missing profile';
    this.status = 500;
  }
}
module.exports = {
  NoUserFound: new NoUserFound(),
  NoProfileFound: new NoProfileFound(),
};
