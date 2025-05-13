<template>
  <div class="find-game-page">
    <div
      class="game-card"
      v-if="currentGame"
      :style="{ transform: cardTransform, opacity: cardOpacity }"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
    >
      <img :src="currentGame.thumbnail" alt="Game Image" class="game-image" />

      <div class="description-box">
        <div class="desc-icon">
          <img src="/lightbulb.png" alt="lightbulb" class="light-icon" />
        </div>
        <div class="desc-text">
          <h3 class="game-name">{{ currentGame.name }}</h3>
          <p class="description" v-html="cleanedDescription"></p>
          <p class="more">Other information...</p>
        </div>
      </div>
    </div>

    <div class="action-buttons" v-if="currentGame">
      <button @click="handleDislike" class="btn dislike">👎</button>
      <button @click="swipeInfo" class="btn info">❓</button>
      <button @click="handleLike" class="btn like">👍</button>
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
      userId: 4, // Remplacez par l'ID utilisateur dynamique si nécessaire
      isDragging: false,
      startX: 0,
      currentX: 0,
      cardTransform: 'translateX(0px) rotate(0deg)',
      cardOpacity: 1,
    };
  },
  computed: {
    cleanedDescription() {
      if (!this.currentGame?.description) return 'No description available.';
      return this.currentGame.description
        .replace(/&#10;/g, '<br>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&rsquo;/g, '’')
        .replace(/&hellip;/g, '…')
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–');
    },
  },
  methods: {
    async fetchNextGame() {
      try {
        const response = await axios.get(`http://localhost:5001/recommendation/${this.userId}`);
        const gameId = response.data.recommended_game_id;
        const gameDetails = await axios.get(`http://localhost:5001/game/${gameId}`);
        this.currentGame = gameDetails.data.game;
        this.resetCardPosition();
      } catch (error) {
        console.error('Error fetching game recommendation:', error);
        alert('Failed to fetch game recommendation.');
      }
    },
    startDrag(event) {
      this.isDragging = true;
      this.startX = event.clientX;
    },
    onDrag(event) {
      if (!this.isDragging) return;
      this.currentX = event.clientX - this.startX;
      const rotation = this.currentX / 10;
      this.cardTransform = `translateX(${this.currentX}px) rotate(${rotation}deg)`;
      this.cardOpacity = 1 - Math.abs(this.currentX) / 300;
    },
    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;

      if (this.currentX > 100) {
        this.handleLike();
      } else if (this.currentX < -100) {
        this.handleDislike();
      } else {
        this.resetCardPosition();
      }
    },
    async handleLike() {
      try {
        await axios.post('http://localhost:5001/like-game', {
          id_user: this.userId,
          id_game: this.currentGame.idgame,
        });
        console.log('Liked:', this.currentGame.name);
        this.animateSwipe('right');
      } catch (error) {
        alert('Failed to like the game.');
      }
    },
    async handleDislike() {
      try {
        await axios.post('http://localhost:5001/dislike-game', {
          id_user: this.userId,
          id_game: this.currentGame.idgame,
        });
        console.log('Disliked:', this.currentGame.name);
        this.animateSwipe('left');
      } catch (error) {
        alert('Failed to dislike the game.');
      }
    },
    animateSwipe(direction) {
      const offScreenX = direction === 'right' ? 1000 : -1000;
      this.cardTransform = `translateX(${offScreenX}px) rotate(${direction === 'right' ? 45 : -45}deg)`;
      this.cardOpacity = 0;
      setTimeout(() => {
        this.fetchNextGame();
      }, 300);
    },
    swipeInfo() {
      alert(`More info coming soon about ${this.currentGame.name}!`);
    },
    resetCardPosition() {
      this.cardTransform = 'translateX(0px) rotate(0deg)';
      this.cardOpacity = 1;
      this.currentX = 0;
    },
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.game-card {
  background-color: #e9e4df;
  border-radius: 20px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
  cursor: grab;
  position: relative;
}

.game-card:active {
  cursor: grabbing;
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

.game-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #5e3c2b;
  margin-bottom: 10px;
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
  justify-content: center;
  gap: 30px;
  margin-top: 10px;
}

.btn {
  font-size: 2.2rem;
  padding: 12px;
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

@media (max-width: 500px) {
  .description-box {
    flex-direction: column;
    text-align: center;
  }

  .desc-icon {
    margin-bottom: 10px;
  }

  .action-buttons {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }
}
</style>
