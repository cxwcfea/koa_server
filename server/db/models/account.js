const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment');

const db = require('../mysql');
const regex = require('../../utils/regex');
const config = require('../../config');

const DataTypes = db.Sequelize;

const Account = db.defineModel('account', {
  profile_id: { type: DataTypes.UUID, allowNull: true },
  mobile: {
    type: DataTypes.STRING(11),
    is: regex.mobile,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
}, {
  hooks: {
    beforeCreate(user) {
      return bcrypt.hash(user.password, 10).then((hashedPasswd) => {
        user.password = hashedPasswd;
      });
    },
    beforeUpdate(user, options) {
      const { fields } = options;
      if (_.includes(fields, 'password')) {
        return bcrypt.hash(user.password, 10).then((hashedPw) => {
          user.password = hashedPw;
        });
      }
      return true;
    },
  },
});

/* instance methods */
Account.prototype.authenticate = function authenticate(password) {
  return bcrypt.compare(password, this.password);
};

Account.prototype.generateJwt = function generateJwt() {
  return jwt.sign({
    sub: this.profile_id,
    mobile: this.mobile,
    ltype: 0,
    iss: config.jwtIssuer,
    iat: moment().unix(),
    exp: moment().add(3, 'days').unix(),
  }, config.jwtSecret);
};

module.exports = Account;
