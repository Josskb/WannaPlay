<template>
  <div class="admin-page">
    <h2>Admin Dashboard</h2>

    <!-- Manage Users -->
    <section class="admin-section">
      <h3>Manage Users</h3>
      <button @click="toggleUserForm" class="toggle-button">
        {{ showUserForm ? 'Hide Add User Form' : 'Show Add User Form' }}
      </button>
      <form v-if="showUserForm" @submit.prevent="addUser" class="add-form">
        <h4>Add User</h4>
        <input type="text" v-model="newUser.username" placeholder="Username" required />
        <input type="email" v-model="newUser.email" placeholder="Email" required />
        <input type="password" v-model="newUser.password" placeholder="Password" required />
        <button type="submit" class="submit-button">Add User</button>
      </form>
      <button @click="fetchUsers" class="refresh-button">Refresh User List</button>
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id_user">
            <td>{{ user.id_user }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="deleteUser(user.id_user)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Manage Games -->
    <section class="admin-section">
      <h3>Manage Games</h3>
      <button @click="toggleGameForm" class="toggle-button">
        {{ showGameForm ? 'Hide Add Game Form' : 'Show Add Game Form' }}
      </button>
      <form v-if="showGameForm" @submit.prevent="addGame" class="add-form">
        <h4>Add Game</h4>
        <input type="text" v-model="newGame.name" placeholder="Game Name" required />
        <textarea v-model="newGame.description" placeholder="Description" required></textarea>
        <input type="number" v-model="newGame.yearpublished" placeholder="Year Published" required />
        <input type="number" v-model="newGame.maxplayers" placeholder="Max Players" required />
        <input type="number" v-model="newGame.playingtime" placeholder="Playing Time (minutes)" required />
        <input type="text" v-model="newGame.thumbnail" placeholder="Thumbnail URL" />
        <button type="submit" class="submit-button">Add Game</button>
      </form>
      <button @click="fetchGames" class="refresh-button">Refresh Game List</button>
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in games" :key="game.idgame">
            <td>{{ game.idgame }}</td>
            <td>{{ game.name }}</td>
            <td>{{ game.description }}</td>
            <td>
              <button @click="deleteGame(game.idgame)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Admin",
  data() {
    return {
      users: [],
      games: [],
      newUser: {
        username: "",
        email: "",
        password: "",
      },
      newGame: {
        name: "",
        description: "",
        yearpublished: null,
        maxplayers: null,
        playingtime: null,
        thumbnail: "",
      },
      showUserForm: false,
      showGameForm: false,
    };
  },
  methods: {
    toggleUserForm() {
      this.showUserForm = !this.showUserForm;
    },
    toggleGameForm() {
      this.showGameForm = !this.showGameForm;
    },
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:5001/admin/users");
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users for admin:", error);
        alert("Failed to fetch users.");
      }
    },
    async fetchGames() {
      try {
        const response = await axios.get("http://localhost:5001/admin/games");
        this.games = response.data;
      } catch (error) {
        console.error("Error fetching games for admin:", error);
        alert("Failed to fetch games.");
      }
    },
    async addUser() {
      try {
        await axios.post("http://localhost:5001/admin/add-user", this.newUser);
        alert("User added successfully.");
        this.newUser = { username: "", email: "", password: "" };
        this.fetchUsers();
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Failed to add user.");
      }
    },
    async addGame() {
      try {
        await axios.post("http://localhost:5001/admin/add-game", this.newGame);
        alert("Game added successfully.");
        this.newGame = { name: "", description: "", yearpublished: null, maxplayers: null, playingtime: null, thumbnail: "" };
        this.fetchGames();
      } catch (error) {
        console.error("Error adding game:", error);
        alert("Failed to add game.");
      }
    },
    async deleteUser(userId) {
      try {
        await axios.post("http://localhost:5001/admin/delete-user", { userId });
        this.fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    },
    async deleteGame(gameId) {
      try {
        await axios.post("http://localhost:5001/admin/delete-game", { gameId });
        this.fetchGames();
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Failed to delete game.");
      }
    },
  },
  mounted() {
    this.fetchUsers();
    this.fetchGames();
  },
};
</script>

<style scoped>
.admin-page {
  padding: 20px;
  background-color: #fdf8f1;
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  color: #5e3c2b;
  margin-bottom: 20px;
}

.admin-section {
  margin-bottom: 40px;
}

.toggle-button,
.refresh-button {
  background-color: #f4c959;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  margin-right: 10px;
}

.toggle-button:hover,
.refresh-button:hover {
  background-color: #e0b94e;
}

.add-form {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-form input,
.add-form textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.submit-button {
  background-color: #64b100;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #5a9a00;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.admin-table th,
.admin-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.admin-table th {
  background-color: #f4f4f4;
  color: #5e3c2b;
}

.delete-button {
  background-color: #e44a4a;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d43a3a;
}
</style>
