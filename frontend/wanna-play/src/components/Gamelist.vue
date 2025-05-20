<template>
  <div class="game-list animate-fade-in">
    <h2>Your Game List</h2>
    <p class="swipe-stats">
      Total swiped: {{ swipeStats.total_swiped }} | Liked: {{ swipeStats.total_liked }} | Disliked: {{ swipeStats.total_disliked }}
    </p>

    <div class="liked-games">
      <h3>Liked Games</h3>
      <div v-if="likedGames.length > 0" class="game-table">
        <transition-group name="move-category" tag="div">
          <div class="game-row" v-for="(game, index) in likedGames" :key="game.idgame || index">
            <img :src="game.thumbnail" alt="Game thumbnail" class="game-thumbnail" />
            <div class="game-name">{{ game.name }}</div> <!-- Ensure game.name is displayed -->
            <div class="game-actions">
              <button @click="reactToGame(game.idgame, false)" class="thumbs-down">
                👎 Unlike
              </button>
              <button @click="removeReaction(game.idgame)" class="remove-reaction">
                ❌ Remove
              </button>
            </div>
          </div>
        </transition-group>
      </div>
      <p v-else>No liked games yet.</p>
    </div>

    <div class="disliked-games">
      <h3>Disliked Games</h3>
      <div v-if="dislikedGames.length > 0" class="game-table">
        <transition-group name="move-category" tag="div">
          <div class="game-row" v-for="(game, index) in dislikedGames" :key="game.idgame || index">
            <img :src="game.thumbnail" alt="Game thumbnail" class="game-thumbnail" />
            <div class="game-name">{{ game.name }}</div> <!-- Ensure game.name is displayed -->
            <div class="game-actions">
              <button @click="reactToGame(game.idgame, true)" class="thumbs-up">
                👍 Like
              </button>
              <button @click="removeReaction(game.idgame)" class="remove-reaction">
                ❌ Remove
              </button>
            </div>
          </div>
        </transition-group>
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
      userId: null, // Set to null initially
    };
  },
  async mounted() {
    // Fetch the logged-in user's ID dynamically
    const user = JSON.parse(localStorage.getItem("user")); // Assuming user info is stored in localStorage
    if (user && user.id_user) {
      this.userId = user.id_user;
      await this.fetchGames();
      await this.fetchSwipeStats();
    } else {
      alert("User not logged in.");
    }
  },
  methods: {
    async fetchGames() {
      try {
        const likedGamesResponse = await axios.get(`http://localhost:5001/liked-games/${this.userId}`);
        this.likedGames = likedGamesResponse.data.games || []; // Ensure empty array if no games are returned
        const dislikedGamesResponse = await axios.get(`http://localhost:5001/disliked-games/${this.userId}`);
        this.dislikedGames = dislikedGamesResponse.data.games || []; // Ensure empty array if no games are returned
      } catch (err) {
        console.error("Error fetching games:", err);
        alert("Unable to load games.");
      }
    },
    async fetchSwipeStats() {
      try {
        const response = await axios.get(`http://localhost:5001/user-swipe-stats/${this.userId}`);
        this.swipeStats = response.data;
      } catch (err) {
        console.error("Error fetching swipe stats:", err);
        alert("Unable to fetch swipe stats.");
      }
    },
    async reactToGame(gameId, liked) {
      try {
        console.log("Reacting to game:", { id_user: this.userId, id_game: gameId, liked });
        await axios.post("http://localhost:5001/react-game", {
          id_user: this.userId,
          id_game: gameId,
          liked,
        });
        await this.fetchGames(); // Refresh the liked and disliked games
        await this.fetchSwipeStats(); // Refresh the swipe stats
      } catch (err) {
        console.error("Error reacting to game:", err);
        alert("Failed to react to the game.");
      }
    },
    async removeReaction(gameId) {
      try {
        console.log("Removing reaction for game:", { id_user: this.userId, id_game: gameId });
        await axios.post("http://localhost:5001/remove-reaction", {
          id_user: this.userId,
          id_game: gameId,
        });
        await this.fetchGames(); // Refresh the liked and disliked games
        await this.fetchSwipeStats(); // Refresh the swipe stats
      } catch (err) {
        console.error("Error removing reaction:", err);
        alert("Failed to remove the reaction.");
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

.remove-reaction {
  background-color: #ff9800;
  color: white;
}

button:hover {
  opacity: 0.8;
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

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

/* Move Category Animation with "Lift and Move" effect */
.move-category-enter-active,
.move-category-leave-active {
  transition:
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.6s ease,
    box-shadow 0.3s ease;
}

.move-category-enter {
  transform: translateY(-40px) scale(1.05);
  opacity: 0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.move-category-leave-to {
  transform: translateY(40px) scale(0.95);
  opacity: 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
}

.move-category-move {
  transition: transform 0.6s ease;
}
</style>
