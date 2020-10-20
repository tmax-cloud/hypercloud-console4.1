export const getAccessToken = function() {
  return sessionStorage.getItem('accessToken');
};
// HyperAuth 연동 후, 사용하지 않음
export const getRefreshToken = function() {
  return sessionStorage.getItem('refreshToken');
};

export const getId = function() {
  return sessionStorage.getItem('id');
};

export const setAccessToken = function(at) {
  sessionStorage.setItem('accessToken', at);
  return;
};
// HyperAuth 연동 후, 사용하지 않음
export const setRefreshToken = function(rt) {
  sessionStorage.setItem('refreshToken', rt);
  return;
};

export const setId = function(id) {
  sessionStorage.setItem('id', id);
  return;
};

// 로그아웃 시 사용
export const resetLoginState = function() {
  sessionStorage.clear();
  return;
};
