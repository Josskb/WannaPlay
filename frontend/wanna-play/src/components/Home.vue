<template>
    <div class="home">
  
      <!-- Welcome Block -->
      <section class="card welcome-card">
        <h2 class="card-title">Welcomeee,</h2>
        <p class="card-text">Find the game that correspond to you.</p>
        <button class="card-button">Let's gooo</button>
        <img src="../assets/logo_sans_texte.png" alt="icon" class="icon-floating" />
      </section>
  
      <!-- Game Database Block -->
      <section class="game-section">
        <img src="../assets/gameset.png" alt="gameset" class="game-image" />
        <div class="card database-card">
          <h2 class="card-title">The GAME Database,</h2>
          <p class="card-subtext">Our algorithm analyzes the games you like to recommend the ones you'll love.</p>
          <p class="card-text-bold">The more you like, the better we get at finding the games you’ll love!</p>
        </div>
      </section>
  
      <!-- Action Cards -->
      <section class="action-cards">
        <div class="action-card">
          <img src="../assets/findgame.jpg" alt="Find a game" class="card-image" />
          <h3 class="action-title">Find a game</h3>
          <router-link to="/find" class="card-link">Go find a game</router-link>
        </div>
        <div class="action-card">
          <img src="../assets/gamelist.jpg" alt="Game list" class="card-image" />
          <h3 class="action-title">Your game list</h3>
          <router-link to="/list" class="card-link">Go to your game list</router-link>
        </div>
      </section>
  
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
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
    width: 40px; /* plus petit sur téléphone */
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
  </style>
  