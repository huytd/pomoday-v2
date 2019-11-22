export const fetchFromDB = (server, token) => {
  const url = server.replace(/\/$/, '') + '/list';
  return fetch(url, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  }).then(r => r.json());
};

export const syncToDB = (tasks, server, token) => {
  const url = server.replace(/\/$/, '') + '/list';
  const data = JSON.stringify({ tasks: tasks });
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    method: 'PUT',
    body: data,
  }).then(r => r.json());
};

export const authenticateUser = (username, password, server) => {
  const url = server.replace(/\/$/, '') + '/list';
  const token = btoa(`${username}:${password}`);
  const auth = `Basic ${token}`;
  return fetch(url, {
    headers: {
      Authorization: auth,
    },
  })
    .then(r => r.json())
    .then(() => {
      return token;
    });
};
