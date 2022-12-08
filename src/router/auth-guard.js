const isAuthenticated = localStorage.getItem('token');

export default function (to, from, next) {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' });
  else next();
}