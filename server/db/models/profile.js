const db = require('../mysql');
const ApiError = require('../../utils/apiError');

const DataTypes = db.Sequelize;

const Profile = db.defineModel('profile', {
  name: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, defaultValue: '' },
  gender: { type: DataTypes.INTEGER, defaultValue: 0 }, // 1 male, 2 female, 0未知
  birth: { type: DataTypes.INTEGER, defaultValue: 0 },
  avatar: { type: DataTypes.STRING(512), defaultValue: '' },
  mobile: { type: DataTypes.STRING(11), defaultValue: '' },
  info: { type: DataTypes.STRING, defaultValue: '' },
  roles: DataTypes.JSON,
  status: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0 init, 1 active, 2 inactive
}, {
  hooks: {
    beforeValidate(profile) {
      profile.roles = ['user'];
    },
  },
});

/* class methods */
Profile.loadInfo = (pid) => Profile.findOne({
  where: {
    profile_id: pid,
  },
}).then((instance) => {
  if (!instance) {
    throw new ApiError(`user ${pid} not found`);
  }
  return instance;
});

module.exports = Profile;
