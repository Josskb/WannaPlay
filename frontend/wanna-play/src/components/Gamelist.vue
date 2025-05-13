<template>
  <div class="game-list">
    <h2>Your Game List</h2>
    <div class="game-table">
      <div class="game-row" v-for="game in games" :key="game.idgame">
        <img :src="game.thumbnail" alt="Game thumbnail" class="game-thumbnail" />
        <div class="game-name">{{ game.name }}</div>
        <div class="game-actions">
          <button @click="unlikeGame(game.idgame)" class="thumbs-down">👎 Unlike</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GameList',
  data() {
    return {
      games: [],
      userId: 1 // Replace with dynamic user ID if available
    };
  },
  async mounted() {
    await this.fetchLikedGames();
  },
  methods: {
    async fetchLikedGames() {
      try {
        const res = await axios.get(`http://localhost:5001/liked-games/${this.userId}`);
        this.games = res.data.games;
      } catch (err) {
        alert('Unable to load liked games.');
      }
    },
    async unlikeGame(gameId) {
      try {
        await axios.post('http://localhost:5001/unlike-game', {
          id_user: this.userId,
          id_game: gameId
        });
        alert('Game unliked successfully.');
        await this.fetchLikedGames();
      } catch (err) {
        alert('Failed to unlike the game.');
      }
    }
  }
};
</script>

<style scoped>
.game-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

h2 {
  color: #5e3c2b;
  margin-bottom: 30px;
}

.game-table {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 700px;
}

.game-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.game-name {
  flex: 1;
  font-weight: bold;
  color: #5e3c2b;
  margin-left: 15px;
}

.game-actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}

.thumbs-up {
  background-color: #64b100;
  color: white;
}

.thumbs-down {
  background-color: #e44a4a;
  color: white;
}

button:hover {
  opacity: 0.8;
}
</style>
