const { LargeObjectManager } = require('pg-large-object');
const { Model } = require('objection');

class AvatarModel {
  constructor(oid) {
    this.oid = oid;
  }
  async delete() {
    const knex = Model.knex();
    const conn = await knex.client.acquireConnection();
    const manager = new LargeObjectManager(conn);
    await manager.unlink(this.oid);
    return knex.client.releaseConnection(conn);
  }
}
module.exports = AvatarModel;
