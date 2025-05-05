<template>
    <div class="find-game-page">
      <div class="game-card" v-if="currentGame">
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
          <button @click="fetchNextGame" class="btn dislike">👎</button>
          <button @click="swipeInfo" class="btn info">❓</button>
          <button @click="fetchNextGame" class="btn like">👍</button>
        </div>
      </div>
      <div v-else>
        <p>Loading game recommendation...</p>
      </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'FindGame',
  data() {
    return {
      currentGame: null,
      userId: 1 // Replace with dynamic user ID if available
    };
  },
  methods: {
    async fetchNextGame() {
      try {
        const response = await axios.get(`http://localhost:5001/recommendation/${this.userId}`);
        const gameId = response.data.recommended_game_id;

        const gameDetails = await axios.get(`http://localhost:5001/game/${gameId}`);
        this.currentGame = gameDetails.data.game;
      } catch (error) {
        console.error('Error fetching game recommendation:', error);
        alert('Failed to fetch game recommendation.');
      }
    },
    swipeInfo() {
      alert(`More info coming soon about ${this.currentGame.name}!`);
    }
  },
  mounted() {
    this.fetchNextGame();
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
