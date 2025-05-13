<template>
  <div class="login-page">
    <div class="login-card">
      <img src="../assets/logo_transparent.png" alt="Meeple Icon" class="login-icon" />
      <h2 class="login-title">Ready to play?</h2>
      <p class="login-subtext">Log in to get personalized board game recommendations!</p>

      <form class="login-form" @submit="handleLogin">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />

        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />

        <button type="submit" class="login-button">Login</button>
      </form>

      <p class="login-footer">
        New here?
        <router-link to="/register" class="register-link">Create an account</router-link>
      </p>
      <p class="login-quote">🎲 "Life’s a game, play it well!"</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleLogin(event) {
      event.preventDefault();
      try {
        const response = await axios.post('http://localhost:5001/login', {
          email: this.email,
          password: this.password
        });

        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        this.$router.push('/');
      } catch (err) {
        alert(err.response?.data?.message || 'Login failed');
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-color: #fdf8f1;
  min-height: 80vh;
}

.login-card {
  background-color: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-icon {
  width: 100px;
  margin-bottom: 10px;
}

.login-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #5e3c2b;
}

.login-subtext {
  font-size: 0.95rem;
  color: #7a5a44;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.login-form label {
  margin: 10px 0 5px;
  color: #5e3c2b;
  font-weight: 600;
}

.login-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.login-button {
  background-color: #f4c959;
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #e0b94e;
}

.login-footer {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #5e3c2b;
}

.register-link {
  color: #f4c959;
  font-weight: bold;
  text-decoration: none;
  margin-left: 5px;
}

.login-quote {
  margin-top: 20px;
  font-style: italic;
  color: #8a6f56;
  font-size: 0.85rem;
}

@media (max-width: 500px) {
  .login-title {
    font-size: 1.5rem;
  }
  .login-card {
    padding: 20px;
  }
}
</style>
