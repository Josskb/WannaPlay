<template>
    <div class="home">
  
      <!-- Welcome Block -->
      <section class="card welcome-card animate-fade-in">
        <h2 class="card-title">Welcomeee,</h2>
        <p class="card-text">Find the game that correspond to you.</p>
        <button class="card-button" @click="handleButtonClick">Let's gooo</button>
        <img src="../assets/logo_sans_texte.png" alt="icon" class="icon-floating" />
      </section>
  
      <!-- Game Database Block -->
      <section class="game-section animate-slide-in">
        <img src="../assets/gameset.png" alt="gameset" class="game-image" />
        <div class="card database-card">
          <h2 class="card-title">The GAME Database,</h2>
          <p class="card-subtext">Our algorithm analyzes the games you like to recommend the ones you'll love.</p>
          <p class="card-text-bold">The more you like, the better we get at finding the games you’ll love!</p>
        </div>
      </section>
  
      <!-- Action Cards -->
      <section class="action-cards">
        <div class="action-card animate-zoom-in">
          <img src="../assets/findgame.jpg" alt="Find a game" class="card-image" />
          <h3 class="action-title">Find a game</h3>
          <router-link to="/find" class="card-link">Go find a game</router-link>
        </div>
        <div class="action-card animate-zoom-in">
          <img src="../assets/gamelist.jpg" alt="Game list" class="card-image" />
          <h3 class="action-title">Your game list</h3>
          <router-link to="/gamelist" class="card-link">Go to your game list</router-link>
        </div>
      </section>
  
      <!-- Most Liked Game Block -->
      <section v-if="mostLikedGame" class="card most-liked-card animate-slide-in">
        <h2 class="card-title">Most Liked Game</h2>
        <img :src="mostLikedGame.thumbnail" alt="Most Liked Game" class="game-image" />
        <h3 class="game-name">{{ mostLikedGame.name }}</h3>
      </section>
  
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Home',
    data() {
      return {
        mostLikedGame: null,
      };
    },
    methods: {
      async fetchMostLikedGame() {
        try {
          const response = await axios.get('http://localhost:5001/most-liked-game');
          this.mostLikedGame = response.data.game;
        } catch (error) {
          console.error('Error fetching the most liked game:', error);
        }
      },
      handleButtonClick() {
        const user = localStorage.getItem('user');
        if (user) {
          this.$router.push('/find'); // Redirect to "Find a game" if logged in
        } else {
          this.$router.push('/login'); // Redirect to login if not logged in
        }
      },
    },
    mounted() {
      this.fetchMostLikedGame();
    },
  }
  </script>
  
  <style scoped>
  .home {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    background-color: #fdf8f1;
    font-family: 'Arial', sans-serif;
  }
  
  /* Card Base */
  .card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    margin-bottom: 60px;
  }
  
  /* Text Styling */
  .card-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #5e3c2b;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
    margin-bottom: 10px;
  }
  
  .card-subtext {
    font-size: 1rem;
    color: #999;
    margin-bottom: 10px;
  }
  
  .card-text {
    color: #5e3c2b;
    margin-bottom: 20px;
  }
  
  .card-text-bold {
    color: #5e3c2b;
    font-weight: bold;
  }
  
  /* Button */
  .card-button {
    background-color: #c8ab7c;
    color: white;
    border: none;
    padding: 12px 30px;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .card-button:hover {
    background-color: #b8976c;
  }
  
  .icon-floating {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 80px;
  height: auto;
}

/* Ajustement responsive */
@media (max-width: 500px) {
  .icon-floating {
    width: 40px; 
    top: 10px;
    right: 15px;
  }
}


  
  /* Image + card side by side */
  .game-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    margin-bottom: 60px;
  }
  
  .game-image {
    width: 300px;
    border-radius: 20px;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Action Cards */
  .action-cards {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  
  @media (min-width: 768px) {
    .game-section {
      flex-direction: row;
      justify-content: center;
    }
  
    .action-cards {
      flex-direction: row;
      justify-content: space-between;
    }
  }
  
  .action-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    flex: 1;
  }
  
  .card-image {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 15px;
  }
  
  .action-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #5e3c2b;
    margin-bottom: 10px;
  }
  
  .card-link {
    color: #f4c959;
    font-weight: bold;
    text-decoration: underline;
  }
  
  /* Most Liked Card */
.most-liked-card {
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
}

.most-liked-card .game-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

.most-liked-card .game-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #5e3c2b;
  margin-bottom: 10px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-in {
  animation: slideIn 1s ease-out;
}

.animate-zoom-in {
  animation: zoomIn 0.8s ease-out;
}
  </style>
