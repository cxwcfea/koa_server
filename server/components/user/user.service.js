const _ = require('lodash');

class UserService {
  constructor({
    db, logger, utils, currentUser,
  }) {
    this.db = db;
    this.logger = logger;
    this.utils = utils;
    this.currentUser = currentUser;
  }

  async updateProfile(data) {
    const newProfile = _.omit(data, ['id', 'roles', 'status', 'created_at', 'updated_at', 'version']);
    const profile = await this.db.models.Profile.loadInfo(this.currentUser.profileId);
    return profile.update(newProfile);
  }
}

module.exports = UserService;
