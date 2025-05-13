<template>
  <div class="admin-page">
    <h2>Admin Dashboard</h2>

    <!-- Manage Users -->
    <section>
      <h3>Manage Users</h3>
      <form @submit.prevent="addUser" class="add-form">
        <h4>Add User</h4>
        <input type="text" v-model="newUser.username" placeholder="Username" required />
        <input type="email" v-model="newUser.email" placeholder="Email" required />
        <input type="password" v-model="newUser.password" placeholder="Password" required />
        <button type="submit">Add User</button>
      </form>
      <button @click="fetchUsers">Refresh User List</button>
      <table>
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
              <button @click="deleteUser(user.id_user)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Manage Games -->
    <section>
      <h3>Manage Games</h3>
      <form @submit.prevent="addGame" class="add-form">
        <h4>Add Game</h4>
        <input type="text" v-model="newGame.name" placeholder="Game Name" required />
        <textarea v-model="newGame.description" placeholder="Description" required></textarea>
        <input type="number" v-model="newGame.yearpublished" placeholder="Year Published" required />
        <input type="number" v-model="newGame.maxplayers" placeholder="Max Players" required />
        <input type="number" v-model="newGame.playingtime" placeholder="Playing Time (minutes)" required />
        <input type="text" v-model="newGame.thumbnail" placeholder="Thumbnail URL" />
        <button type="submit">Add Game</button>
      </form>
      <button @click="fetchGames">Refresh Game List</button>
      <table>
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
              <button @click="deleteGame(game.idgame)">Delete</button>
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
    };
  },
  methods: {
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
}

.add-form {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-form input,
.add-form textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.add-form button {
  background-color: #f4c959;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}

.add-form button:hover {
  background-color: #e0b94e;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

button {
  background-color: #f4c959;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #e0b94e;
}
</style>
