<template>
  <div class="register-page">
    <div class="register-card">
      <img src="../assets/logo_transparent.png" alt="Meeple Icon" class="register-icon" />
      <h2 class="register-title">Join the Game!</h2>
      <p class="register-subtext">Create your account to start discovering your next favorite board game</p>

      <form class="register-form" @submit.prevent="handleSubmit">
        <label for="firstname">First Name</label>
        <input type="text" id="firstname" v-model="firstname" required />

        <label for="lastname">Last Name</label>
        <input type="text" id="lastname" v-model="lastname" required />

        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required />

        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />

        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />

        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />

        <button type="submit" class="register-button" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="register-footer">
        Already have an account?
        <router-link to="/login" class="link">Login</router-link>
      </p>
      <p class="register-quote">🃏 "The best strategy is to just begin!"</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      errorMessage: '' // Store error messages here
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = ''; // Clear previous error messages
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords don't match!";
        return;
      }
      if (!this.firstname || !this.lastname || !this.username || !this.email || !this.password) {
        this.errorMessage = "All fields are required!";
        return;
      }
      this.loading = true;
      try {
        await axios.post('http://localhost:5001/register', {
          firstname: this.firstname,
          lastname: this.lastname,
          username: this.username,
          email: this.email,
          password: this.password
        });
        this.$router.push('/'); // Redirect to the home page
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Registration failed.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

  
  <style scoped>
  .register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background-color: #fdf8f1;
    min-height: 85vh;
  }
  
  .register-card {
    background-color: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px;
    text-align: center;
  }
  
  .register-icon {
    width: 100px;
    margin-bottom: 10px;
  }
  
  .register-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #5e3c2b;
    margin-bottom: 10px;
  }
  
  .register-subtext {
    font-size: 0.95rem;
    color: #7a5a44;
    margin-bottom: 20px;
  }
  
  .register-form {
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  
  .register-form label {
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: 600;
    color: #5e3c2b;
  }
  
  .register-form input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  .register-button {
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
  
  .register-button:disabled {
    background-color: #e0b94e;
    cursor: not-allowed;
  }
  
  .register-button:hover:not(:disabled) {
    background-color: #e0b94e;
  }
  
  .register-footer {
    margin-top: 20px;
    font-size: 0.9rem;
    color: #5e3c2b;
  }
  
  .link {
    color: #f4c959;
    font-weight: bold;
    text-decoration: none;
    margin-left: 5px;
  }
  
  .register-quote {
    margin-top: 20px;
    font-style: italic;
    color: #8a6f56;
    font-size: 0.85rem;
  }
  
  @media (max-width: 500px) {
    .register-title {
      font-size: 1.5rem;
    }
  
    .register-card {
      padding: 20px;
    }
  }

  .error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 10px;
  }
  
  </style>
