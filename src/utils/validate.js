// 过滤特殊字符

// export function stripscript(str) {
//   var pattern = new RegExp(
//     "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
//   );
//   var rs = "";
//   for (var i = 0; i < str.length; i++) {
//     rs = rs + str.substr(i, 1).replace(pattern, "");
//   }
//   return rs;
// }

//邮箱验证
export function validateEmail(value) {
  let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  return !reg.test(value) ? true : false;
}
//密码验证
export function validatePassword(value) {
  let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
  return !reg.test(value) ? true : false;
}

//验证码验证
export function validatecode(value) {
  let reg = /^[a-z0-9]{6}$/;
  return !reg.test(value) ? true : false;
}
