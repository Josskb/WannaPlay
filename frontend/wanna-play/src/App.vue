<!-- App.vue -->
<template>
  <div id="app">
    <header class="app-header">
      <div class="logo-wrapper">
        <img src="../public/logo_transparent.png" alt="Logo" class="logo" />
        <h1>Wanna Play?</h1>
      </div>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/find">Find a game</router-link>
        <router-link to="/list">Your game list</router-link>
        <router-link to="/login" class="login-button">Login</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="footer-column">
        <strong>Wanna Play ?</strong>
        <div class="socials">
          <i class="fab fa-facebook"></i>
          <i class="fab fa-instagram"></i>
        </div>
      </div>
      <div class="footer-column">
        <strong>Pages</strong>
        <p>Home</p>
        <p>Find a game</p>
        <p>Your game list</p>
      </div>
      <div class="footer-column">
        <strong>Contact us</strong>
        <p>Email us</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// nothing to declare
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

#app {
  font-family: 'Fredoka', sans-serif;
  background-color: #fdf8f1;
  color: #5e3c2b;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f6f1e7;
  padding: 10px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  height: 40px;
}

.app-header h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #5e3c2b;
}

nav a {
  margin-left: 20px;
  color: #5e3c2b;
  text-decoration: none;
  font-weight: 600;
}

nav a:hover {
  color: #d49d00;
}

.login-button {
  background-color: #f4c959;
  padding: 5px 15px;
  border-radius: 5px;
  color: white;
}

main {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.app-footer {
  display: flex;
  justify-content: space-around;
  background-color: #f6f1e7;
  padding: 30px 0;
  font-size: 14px;
  margin-top: 50px;
}

.footer-column {
  text-align: center;
}

.socials i {
  margin: 5px;
  font-size: 18px;
  color: #5e3c2b;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    text-align: center;
  }
  .logo-wrapper {
    justify-content: center;
  }
  nav {
    margin-top: 10px;
  }
  nav a {
    margin-left: 10px;
    font-size: 0.9rem;
  }
  .app-footer {
    flex-direction: column;
    text-align: center;
  }
  .footer-column {
    margin-bottom: 20px;
  }
}
</style>
