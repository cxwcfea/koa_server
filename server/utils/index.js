exports.getErrorMessage = (type, defaultMessage) => {
  if (type === 'password') {
    return '请输入有效的密码';
  }
  if (type === 'mobile') {
    return '请输入有效的手机号';
  }
  if (type === 'captcha') {
    return '请输入6位验证码';
  }
  if (type === 'captchaNotFound') {
    return '请先获取短信验证码';
  }
  if (type === 'captchaNotMatch') {
    return '验证码不匹配';
  }
  if (type === 'userExists') {
    return '该用户已经存在';
  }
  if (type === 'userNotFound') {
    return '该手机号码未注册';
  }
  if (type === 'incorrectPassword') {
    return '密码不正确';
  }
  if (type === 'notOwnerWhenRemoveGroupMember') {
    return '您不是该共享组的创建者';
  }
  return defaultMessage;
};
