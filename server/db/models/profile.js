const db = require('../mysql');
const ApiError = require('../../utils/apiError');

const DataTypes = db.Sequelize;

const Profile = db.defineModel('profile', {
  name: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, defaultValue: '' },
  gender: { type: DataTypes.INTEGER, defaultValue: 0 }, // 1 male, 2 female, 0未知
  birth: { type: DataTypes.BIGINT, defaultValue: 0 },
  avatar: { type: DataTypes.STRING(512), defaultValue: '' },
  mobile: { type: DataTypes.STRING(11), defaultValue: '' },
  info: { type: DataTypes.STRING, defaultValue: '' },
  roles: { type: DataTypes.JSON, defaultValue: [] },
  status: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0 init, 1 active, 2 inactive
}, {
  indexes: [
    {
      unique: false,
      fields: ['mobile'],
    },
  ],
  hooks: {
    beforeCreate(profile) {
      profile.roles = ['user'];
    },
  },
});

/* class methods */
Profile.loadInfo = (id) => Profile.findOne({
  where: {
    id,
  },
}).then((instance) => {
  if (!instance) {
    throw new ApiError(`user ${id} not found`);
  }
  return instance;
});

module.exports = Profile;
