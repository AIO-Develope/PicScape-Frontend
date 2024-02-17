<template>
  <div class="auth-form-container">
    <form @submit.prevent="submitForm" v-if="isRegistering" class="register-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <div class="error-message-group">
        <span v-if="passwordMismatch" class="error-message">Passwords do not match</span>
      </div>
      <div class="success-message-group">
        <span v-if="registerdSuccessfully" class="success-message">registerd successfully</span>
      </div>


      <button type="submit" class="submit-button">Register</button>
      <div class="toggle-auth-option">
        <span>Already have an account?</span>
        <button @click="toggleAuthOption">Login</button>
      </div>
    </form>

    <form @submit.prevent="submitForm" v-show="!isRegistering && !isLoggedIn" class="login-form">
      <div class="form-group">
        <label for="loginUsername">Username:</label>
        <input type="text" id="loginUsername" v-model="loginUsername" required>
      </div>

      <div class="form-group">
        <label for="loginPassword">Password:</label>
        <input type="password" id="loginPassword" v-model="loginPassword" required>
      </div>

      <div class="error-message-group">
        <span v-if="wrongCredentials" class="error-message">wrong password or username</span>

      </div>

      <button type="submit" class="submit-button">Login</button>
      <div class="toggle-auth-option">
        <span>Don't have an account yet?</span>
        <button @click="toggleAuthOption">Register</button>
      </div>
    </form>

    <button v-if="isLoggedIn" @click="logout" class="submit-button">Logout</button>
  </div>
</template>

<script>
import { API_URL } from '../../config';

export default {
  data() {
    return {
      isRegistering: false,
      username: '',
      password: '',
      confirmPassword: '',
      passwordMismatch: false,
      wrongCredentials: false,
      registerdSuccessfully: false,
      loginUsername: '',
      loginPassword: '',
      isLoggedIn: false
    };
  },
  async mounted() {
    this.isLoggedIn = await this.checkLoggedIn();
  },
  methods: {

    async submitForm() {

      if (this.isRegistering) {
        if (this.password !== this.confirmPassword) {
          this.passwordMismatch = true;
          return;
        }
        try {
          const formData = new FormData();
          formData.append('username', this.username);
          formData.append('password', this.password);

          const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            this.username = '';
            this.password = '';
            this.confirmPassword = '';
            this.passwordMismatch = false;
            this.registerdSuccessfully = true;
          } else {
            alert('Registration failed!');
          }
        } catch (error) {
          console.error('Registration failed:', error);
          alert('Registration failed. Please try again.');
        }
      } else {
        try {
          const formData = new FormData();
          formData.append('username', this.loginUsername);
          formData.append('password', this.loginPassword);

          const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const responseData = await response.json();
            this.saveTokenInCookies(responseData.token, responseData.uuid);

            this.loginUsername = '';
            this.loginPassword = '';
          } else {
            this.wrongCredentials = true;
            this.loginPassword = '';
          }
        } catch (error) {
          console.error('Login failed:', error);
          alert('Login failed. Please try again.');
        }
      }
    },
    async saveTokenInCookies(token, uuid) {
      document.cookie = `token=${token}; expires=${new Date(Date.now() + 86400e3).toUTCString()}; path=/`;
      document.cookie = `uuid=${uuid}; expires=${new Date(Date.now() + 86400e3).toUTCString()}; path=/`;

      this.isLoggedIn = true;
      location.reload();

    },
    toggleAuthOption() {
      this.isRegistering = !this.isRegistering;
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
      this.passwordMismatch = false;
      this.wrongCredentials = false;
      this.registerdSuccessfully = false;
      this.loginUsername = '';
      this.loginPassword = '';
    },
    async checkLoggedIn() {
      const token = this.getCookie('token');

      if (!token) {
        return false;
      }

      try {
        const response = await fetch(`${API_URL}/api/verifyToken`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        });

        if (response.ok) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    logout() {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'uuid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      this.isLoggedIn = false;
      location.reload();

    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
  }
};
</script>

<style scoped>
input[type="text"],
input[type="password"] {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}

.auth-form-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #99aab5;
  border-radius: 8px;
  background-color: #2c2f33;
}

.auth-form {
  display: grid;
  grid-gap: 10px;
}

.form-group {
  display: grid;
  grid-template-columns: 160px auto;
  align-items: center;
  margin-bottom: 10px;
}

label {
  font-weight: bold;
  text-align: left;
  padding-bottom: 7px;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}

.error-message-group {
  margin: 20px;
}

.success-message-group {
  margin: 20px;
}

.toggle-auth-option {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toggle-auth-option button {
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
  margin-left: 5px;
}

.toggle-auth-option button:hover {
  color: #0056b3;
}
</style>
