const isAuthenticated = localStorage.getItem('token');

function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  const padded = padding ? base64 + '==='.slice(padding) : base64;
  return atob(padded);
}

function decodeJwt(token) {
  const [header, payload, signature] = token.split('.');

  try {
    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    return { header: decodedHeader, payload: decodedPayload };
  } catch (error) {
    console.error('Token decoding error:', error.message);
    throw error;
  }
}

const decodedResult = isAuthenticated ? decodeJwt(isAuthenticated) : null;

export default function (to, from, next) {
  if (to.name !== 'Login' && (!isAuthenticated || isTokenExpired(decodedResult))) {
    next({ name: 'Login' });
  } else {
    next();
  }
}

function isTokenExpired(decodedResult) {
  if (!decodedResult || !decodedResult.payload || !decodedResult.payload.exp) {
    return true;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  return decodedResult.payload.exp < currentTimestamp;
}
