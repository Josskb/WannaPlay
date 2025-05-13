<template>
  <div class="game-list">
    <h2>Your Game List</h2>
    <p class="swipe-stats">
      Total swiped: {{ swipeStats.total_swiped }} | Liked: {{ swipeStats.total_liked }} | Disliked: {{ swipeStats.total_disliked }}
    </p>

    <div class="liked-games">
      <h3>Liked Games</h3>
      <div v-if="likedGames.length > 0" class="game-table">
        <div
          class="game-row"
          v-for="game in likedGames"
          :key="game.idgame"
        >
          <img
            :src="game.thumbnail"
            alt="Game thumbnail"
            class="game-thumbnail"
          />
          <div class="game-name">{{ game.name }}</div>
          <div class="game-actions">
            <button
              @click="reactToGame(game.idgame, false)"
              class="thumbs-down"
            >
              👎 Unlike
            </button>
          </div>
        </div>
      </div>
      <p v-else>No liked games yet.</p>
    </div>

    <div class="disliked-games">
      <h3>Disliked Games</h3>
      <div v-if="dislikedGames.length > 0" class="game-table">
        <div
          class="game-row"
          v-for="game in dislikedGames"
          :key="game.idgame"
        >
          <img
            :src="game.thumbnail"
            alt="Game thumbnail"
            class="game-thumbnail"
          />
          <div class="game-name">{{ game.name }}</div>
          <div class="game-actions">
            <button
              @click="reactToGame(game.idgame, true)"
              class="thumbs-up"
            >
              👍 Like
            </button>
          </div>
        </div>
      </div>
      <p v-else>No disliked games yet.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GameList",
  data() {
    return {
      likedGames: [],
      dislikedGames: [],
      swipeStats: {
        total_swiped: 0,
        total_liked: 0,
        total_disliked: 0,
      },
      userId: 1, // Replace with dynamic user ID if available
    };
  },
  async mounted() {
    await this.fetchGames();
    await this.fetchSwipeStats();
  },
  methods: {
    async fetchGames() {
      try {
        const likedGamesResponse = await axios.get(
          `http://localhost:5001/liked-games/${this.userId}`
        );
        const dislikedGamesResponse = await axios.get(
          `http://localhost:5001/disliked-games/${this.userId}`
        );
        this.likedGames = likedGamesResponse.data.games;
        this.dislikedGames = dislikedGamesResponse.data.games;
      } catch (err) {
        alert("Unable to load games.");
      }
    },
    async fetchSwipeStats() {
      try {
        const response = await axios.get(
          `http://localhost:5001/user-swipe-stats/${this.userId}`
        );
        this.swipeStats = response.data;
      } catch (err) {
        console.error("Error fetching swipe stats:", err);
        alert("Unable to fetch swipe stats.");
      }
    },
    async reactToGame(gameId, liked) {
      try {
        console.log("Reacting to game:", { id_user: this.userId, id_game: gameId, liked }); // Log for debugging
        await axios.post("http://localhost:5001/react-game", {
          id_user: this.userId,
          id_game: gameId,
          liked,
        });
        alert(liked ? "Game liked successfully." : "Game unliked successfully.");
        await this.fetchGames();
        await this.fetchSwipeStats(); // Update swipe stats after reaction
      } catch (err) {
        console.error("Error reacting to game:", err);
        alert("Failed to react to the game.");
      }
    },
  },
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
  margin-bottom: 10px;
}

.swipe-stats {
  color: #7a5a44;
  font-size: 1rem;
  margin-bottom: 20px;
}

.liked-games,
.disliked-games {
  width: 100%;
  max-width: 700px;
  margin-bottom: 30px;
}

h3 {
  color: #5e3c2b;
  margin-bottom: 10px;
}

.game-table {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
