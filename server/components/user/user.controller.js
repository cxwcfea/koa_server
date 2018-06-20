class UserController {
  constructor({ logger, utils, userService }) {
    this.logger = logger;
    this.utils = utils;
    this.userService = userService;
  }

  async updateProfile(ctx) {
    this.logger.debug(ctx.state.reqParams);
    const result = await this.userService.updateProfile(ctx.state.reqParams);
    ctx.body = result;
  }
}

module.exports = UserController;
