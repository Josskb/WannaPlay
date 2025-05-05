<template>
    <div class="find-game-page">
      <div class="game-card">
        <img :src="currentGame.thumbnail" alt="Game Image" class="game-image" />
  
        <div class="description-box">
          <div class="desc-icon">
            <img src="../assets/lightbulb.png" alt="lightbulb" class="light-icon" />
          </div>
          <div class="desc-text">
            <p class="description">
              {{ currentGame.description || 'No description available.' }}
            </p>
            <p class="more">Other information...</p>
          </div>
        </div>
  
        <div class="action-buttons">
          <button @click="swipeLeft" class="btn dislike">👎</button>
          <button @click="swipeInfo" class="btn info">❓</button>
          <button @click="swipeRight" class="btn like">👍</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FindGame',
    data() {
      return {
        games: [
          {
            name: 'Monopoly',
            thumbnail: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Monopoly_board_game.jpg',
            description:
              'Monopoly is a board game where you become a real estate manager. You need to buy houses and apartments, but beware, you may find yourself broke quicker than expected...'
          },
          {
            name: 'Catan',
            thumbnail: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Catan-2015-boxart.jpg',
            description:
              'Catan is a strategy game about collecting resources and building settlements. Compete with others to dominate the island!'
          },
          // Add more games or fetch from API/database
        ],
        currentIndex: 0
      };
    },
    computed: {
      currentGame() {
        return this.games[this.currentIndex] || {};
      }
    },
    methods: {
      swipeLeft() {
        this.nextGame();
      },
      swipeRight() {
        // Ideally, also send a like to backend here
        console.log('Liked:', this.currentGame.name);
        this.nextGame();
      },
      swipeInfo() {
        alert(`More info coming soon about ${this.currentGame.name}!`);
      },
      nextGame() {
        if (this.currentIndex < this.games.length - 1) {
          this.currentIndex++;
        } else {
          alert("You've reached the end of the game list!");
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .find-game-page {
    background-color: #fdf8f1;
    padding: 40px 20px;
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .game-card {
    background-color: #e9e4df;
    border-radius: 20px;
    padding: 20px;
    max-width: 600px;
    width: 100%;
    text-align: center;
  }
  
  .game-image {
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .description-box {
    display: flex;
    align-items: center;
    margin: 20px auto;
    background-color: white;
    border-radius: 20px;
    padding: 20px;
    max-width: 500px;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  
  .desc-icon {
    margin-right: 15px;
  }
  
  .light-icon {
    width: 32px;
    height: 32px;
  }
  
  .desc-text {
    flex: 1;
  }
  
  .description {
    font-size: 1rem;
    color: #333;
  }
  
  .more {
    color: #999;
    font-size: 0.85rem;
    margin-top: 10px;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
  }
  
  .btn {
    font-size: 2rem;
    padding: 10px 20px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    background-color: transparent;
  }
  
  .dislike {
    color: #e74c3c;
  }
  
  .like {
    color: #27ae60;
  }
  
  .info {
    color: #f4c959;
  }
  </style>
  