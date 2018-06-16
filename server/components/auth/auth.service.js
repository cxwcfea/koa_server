const ApiError = require('../../utils/apiError');
const { getErrorMessage } = require('../../utils');

class AuthService {
  constructor({ db, logger }) {
    this.db = db;
    this.logger = logger;
  }

  register(name, password) {
    return new Promise((resolve, reject) => {
      this.db.sequelize.transaction((t) => this.db.models.Account
        .create({ name, password }, { transaction: t })
        .then((account) => {
          const profile = this.db.models.Profile.build({ name });
          account.profile_id = profile.id;
          return Promise.all([
            account.save({ transaction: t }),
            profile.save({ transaction: t }),
          ]);
        })
        .then((result) => resolve(result[0].generateJwt()))
        .catch((error) => {
          if (error.name === 'SequelizeUniqueConstraintError') {
            reject(new ApiError(getErrorMessage('userExists', 'Use already exists!'), 409, 'auth:use_exist'));
          } else {
            reject(error);
          }
        }));
    });
  }

  login(name, password) {
    return new Promise((resolve, reject) => {
      this.db.models.Account
        .findOne({
          where: {
            name,
          },
        })
        .then((account) => {
          if (!account) {
            reject(new ApiError(getErrorMessage('userNotFound', 'User not found!'), 404, 'auth:no_user'));
            return false;
          }
          return Promise.all([account.authenticate(password), account]);
        })
        .then((result) => {
          if (!result[0]) {
            reject(new ApiError(getErrorMessage('incorrectPassword', 'Incorrect password!'), 403, 'auth:incorrect_passwd'));
            return;
          }
          resolve(result[1].generateJwt());
        })
        .catch((error) => reject(error.message));
    });
  }
}

module.exports = AuthService;
