import { ref } from 'vue';

export const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true'); // 响应式状态

export const login = () => {
  isAuthenticated.value = true;
  localStorage.setItem('isAuthenticated', 'true');  // 持久化登录状态
};

export const logout = () => {
  isAuthenticated.value = false;
  localStorage.removeItem('isAuthenticated');  // 清除登录状态
};
