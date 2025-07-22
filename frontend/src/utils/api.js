class Api {
    constructor(baseUrl) {
      this._baseUrl = baseUrl;
    }
  
    _getHeaders() {
      const token = localStorage.getItem('jwt');
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    }
  
    _checkResponse(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }
  
    getUserInfo() {
      return fetch(`${this._baseUrl}/users/me`, {
        headers: this._getHeaders(),
      }).then(this._checkResponse);
    }
  
    updateUserInfo(data) {
      return fetch(`${this._baseUrl}/users/me`, {
        method: 'PATCH',
        headers: this._getHeaders(),
        body: JSON.stringify(data),
      }).then(this._checkResponse);
    }
  
    updateAvatar(avatarUrl) {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: this._getHeaders(),
        body: JSON.stringify({ avatar: avatarUrl }),
      }).then(this._checkResponse);
    }
  
    // 🔴 No implementes getInitialCards porque el backend de TripleTen no lo tiene
  }
  
  const api = new Api('https://se-register-api.en.tripleten-services.com/v1');
  export default api;





// class Api {
//     constructor(baseUrl) {
//         this._baseUrl = baseUrl;
//     }

//     _getHeaders() {
//         const token = localStorage.getItem('jwt');
//         return {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//         };
//     }

//     _checkResponse(res) {
//         if (res.ok) {
//             return res.json();
//         }
//         return Promise.reject(`Error: ${res.status}`);
//     }

//     getUserInfo() {
//         return fetch(`${this._baseUrl}/users/me`, {
//             headers: this._getHeaders(),
//         }).then(this._checkResponse);
//     }

//     updateUserInfo(data) {
//         return fetch(`${this._baseUrl}/users/me`, {
//             method: 'PATCH',
//             headers: this._getHeaders(),
//             body: JSON.stringify(data),
//         }).then(this._checkResponse);
//     }

//     getInitialCards() {
//         return fetch(`${this._baseUrl}/cards`, {
//             headers: this._getHeaders(),
//         }).then(this._checkResponse);
//     }

//     addCard(data) {
//         return fetch(`${this._baseUrl}/cards`, {
//             method: 'POST',
//             headers: this._getHeaders(),
//             body: JSON.stringify(data),
//         }).then(this._checkResponse);
//     }

//     deleteCard(cardId) {
//         return fetch(`${this._baseUrl}/cards/${cardId}`, {
//             method: 'DELETE',
//             headers: this._getHeaders(),
//         }).then(this._checkResponse);
//     }

//     updateAvatar(avatarUrl) {
//         return fetch(`${this._baseUrl}/users/me/avatar`, {
//             method: 'PATCH',
//             headers: this._getHeaders(),
//             body: JSON.stringify({ avatar: avatarUrl }),
//         }).then(this._checkResponse);
//     }

//     addLike(cardId) {
//         return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
//             method: 'PUT',
//             headers: this._getHeaders(),
//         }).then(this._checkResponse);
//     }

//     removeLike(cardId) {
//         return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
//             method: 'DELETE',
//             headers: this._getHeaders(),
//         }).then(this._checkResponse);
//     }

//     changeLikeCardStatus(cardId, like) {
//         return like ? this.addLike(cardId) : this.removeLike(cardId);
//     }
// }

// const api = new Api('https://se-register-api.en.tripleten-services.com/v1');

// export default api;