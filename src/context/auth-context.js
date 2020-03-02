import React from 'react';

export default React.createContext({
    token: null,
    user_id: null,
    login: (email, user_id, token, scope, name) => {},
    logout: () => {}
});