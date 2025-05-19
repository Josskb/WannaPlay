<template>
  <div class="admin-page">
    <h2>Admin Dashboard</h2>

    <!-- Manage Users -->
    <section class="admin-section">
      <div class="section-header">
        <h3>Manage Users</h3>
        <button @click="toggleUserForm" class="toggle-button">
          {{ showUserForm ? 'Hide Add User Form' : 'Show Add User Form' }}
        </button>
      </div>
      <form v-if="showUserForm" @submit.prevent="addUser" class="add-form">
        <h4>Add User</h4>
        <div class="form-group">
          <input type="text" v-model="newUser.firstname" placeholder="First Name" required />
          <input type="text" v-model="newUser.lastname" placeholder="Last Name" required />
          <input type="text" v-model="newUser.username" placeholder="Username" required />
          <input type="email" v-model="newUser.email" placeholder="Email" required />
          <input type="password" v-model="newUser.password" placeholder="Password" required />
        </div>
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
      <div class="section-header">
        <h3>Manage Games</h3>
        <button @click="toggleGameForm" class="toggle-button">
          {{ showGameForm ? 'Hide Add Game Form' : 'Show Add Game Form' }}
        </button>
      </div>
      <div v-if="showGameForm">
        <form @submit.prevent="addGame" class="add-form">
          <h4>Add Game</h4>
          <div class="form-group">
            <input type="text" v-model="newGame.name" placeholder="Game Name" required />
            <textarea v-model="newGame.description" placeholder="Description" required></textarea>
            <input type="number" v-model="newGame.yearpublished" placeholder="Year Published" required />
            <input type="number" v-model="newGame.maxplayers" placeholder="Max Players" required />
            <input type="number" v-model="newGame.playingtime" placeholder="Playing Time (minutes)" required />
            <input type="text" v-model="newGame.thumbnail" placeholder="Thumbnail URL" />
          </div>
          <button type="submit" class="submit-button">Add Game</button>
        </form>
        <form @submit.prevent="addGameWithDetails" class="add-form">
          <h4>Add Game with Details</h4>
          <div class="form-group">
            <input type="text" v-model="newGame.name" placeholder="Game Name" required />
            <textarea v-model="newGame.description" placeholder="Description" required></textarea>
            <input type="number" v-model="newGame.yearpublished" placeholder="Year Published" required />
            <input type="number" v-model="newGame.maxplayers" placeholder="Max Players" required />
            <input type="number" v-model="newGame.playingtime" placeholder="Playing Time (minutes)" required />
            <input type="text" v-model="newGame.thumbnail" placeholder="Thumbnail URL" />
            <input type="text" v-model="newGame.categories" placeholder="Categories (comma-separated IDs)" />
            <input type="text" v-model="newGame.designers" placeholder="Designers (comma-separated IDs)" />
          </div>
          <button type="submit" class="submit-button">Add Game with Details</button>
        </form>
      </div>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for a game..."
          @input="searchGames"
        />
      </div>
      <button @click="fetchGames" class="refresh-button">Refresh Game List</button>
      <table v-if="filteredGames.length > 0" class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in filteredGames" :key="game.idgame">
            <td>{{ game.idgame }}</td>
            <td>{{ game.name }}</td>
            <td>{{ game.description }}</td>
            <td>
              <select v-model="selectedCategoryForGame[game.idgame]" class="category-select">
                <option v-for="category in categories" :key="category.id_category" :value="category.id_category">
                  {{ category.name }}
                </option>
              </select>
            </td>
            <td>
              <button @click="addGameToCategory(game.idgame, selectedCategoryForGame[game.idgame])" class="submit-button">
                Add to Category
              </button>
              <button @click="openEntityModal(game)" class="submit-button">Manage Entities</button>
              <button @click="deleteGame(game.idgame)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="searchQuery.trim()" class="no-results">No games found. Try searching for something else.</p>
      <p v-else class="no-results">Displaying the first 10 games.</p>
    </section>

    <!-- Entity Management Modal -->
    <div v-if="showEntityModal" class="modal">
      <div class="modal-content">
        <h3>Manage Entities for "{{ selectedGame.name }}"</h3>
        <div class="form-group">
          <label>Designer</label>
          <select v-model="selectedDesignerForGame[selectedGame.idgame]" class="entity-select">
            <option v-for="designer in designers" :key="designer.id_designer" :value="designer.id_designer">
              {{ designer.name }}
            </option>
          </select>
          <button @click="addGameToEntity('designer', selectedGame.idgame, selectedDesignerForGame[selectedGame.idgame])" class="submit-button">
            Add to Designer
          </button>
        </div>
        <div class="form-group">
          <label>Publisher</label>
          <select v-model="selectedPublisherForGame[selectedGame.idgame]" class="entity-select">
            <option v-for="publisher in publishers" :key="publisher.id_publisher" :value="publisher.id_publisher">
              {{ publisher.name }}
            </option>
          </select>
          <button @click="addGameToEntity('publisher', selectedGame.idgame, selectedPublisherForGame[selectedGame.idgame])" class="submit-button">
            Add to Publisher
          </button>
        </div>
        <div class="form-group">
          <label>Implementation</label>
          <select v-model="selectedImplementationForGame[selectedGame.idgame]" class="entity-select">
            <option v-for="implementation in implementations" :key="implementation.id_implementation" :value="implementation.id_implementation">
              {{ implementation.name }}
            </option>
          </select>
          <button @click="addGameToEntity('implementation', selectedGame.idgame, selectedImplementationForGame[selectedGame.idgame])" class="submit-button">
            Add to Implementation
          </button>
        </div>
        <div class="form-group">
          <label>Family</label>
          <select v-model="selectedFamilyForGame[selectedGame.idgame]" class="entity-select">
            <option v-for="family in families" :key="family.id_family" :value="family.id_family">
              {{ family.name }}
            </option>
          </select>
          <button @click="addGameToEntity('family', selectedGame.idgame, selectedFamilyForGame[selectedGame.idgame])" class="submit-button">
            Add to Family
          </button>
        </div>
        <button @click="closeEntityModal" class="close-button">Close</button>
      </div>
    </div>

    <!-- Create Category Section -->
    <section class="admin-section">
      <h3>Create a Category</h3>
      <form @submit.prevent="createCategory" class="add-form">
        <input
          type="text"
          v-model="newCategory.name"
          placeholder="Category Name"
          required
        />
        <textarea
          v-model="newCategory.gameIds"
          placeholder="Game IDs (comma-separated)"
          required
        ></textarea>
        <button type="submit" class="submit-button">Create Category</button>
      </form>
    </section>

    <!-- View Games by Category -->
    <section class="admin-section">
      <h3>View Games by Category</h3>
      <div class="categories-container">
        <div
          v-for="category in categories"
          :key="category.id_category"
          class="category-card"
          @click="fetchGamesByCategory(category.name)"
        >
          <h4>{{ category.name }}</h4>
        </div>
      </div>
      <div v-if="gamesByCategory.length > 0" class="games-container">
        <h4>Games in "{{ selectedCategory }}"</h4>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game in gamesByCategory" :key="game.idgame">
              <td>{{ game.idgame }}</td>
              <td>{{ game.name }}</td>
              <td>{{ game.description }}</td>
              <td>
                <img :src="game.thumbnail" alt="Thumbnail" class="thumbnail" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else-if="selectedCategory" class="no-results">No games found for this category.</p>
    </section>

    <!-- Create Designers, Publishers, Implementations, and Families -->
    <section class="admin-section">
      <h3>Create Entities</h3>
      <form @submit.prevent="createDesigner" class="add-form">
        <h4>Create Designer</h4>
        <input type="text" v-model="newDesigner.name" placeholder="Designer Name" required />
        <button type="submit" class="submit-button">Create Designer</button>
      </form>
      <form @submit.prevent="createPublisher" class="add-form">
        <h4>Create Publisher</h4>
        <input type="text" v-model="newPublisher.name" placeholder="Publisher Name" required />
        <button type="submit" class="submit-button">Create Publisher</button>
      </form>
      <form @submit.prevent="createImplementation" class="add-form">
        <h4>Create Implementation</h4>
        <input type="text" v-model="newImplementation.name" placeholder="Implementation Name" required />
        <button type="submit" class="submit-button">Create Implementation</button>
      </form>
      <form @submit.prevent="createFamily" class="add-form">
        <h4>Create Family</h4>
        <input type="text" v-model="newFamily.name" placeholder="Family Name" required />
        <button type="submit" class="submit-button">Create Family</button>
      </form>
    </section>

    <!-- View Games by Entities -->
    <section class="admin-section">
      <h3>View Games by Entities</h3>

      <!-- Designers -->
      <div class="entities-container">
        <h4>Designers</h4>
        <div
          v-for="designer in designers"
          :key="designer.id_designer"
          class="entity-card"
          @click="fetchGamesByDesigner(designer.name)"
        >
          <h4>{{ designer.name }}</h4>
        </div>
      </div>

      <!-- Publishers -->
      <div class="entities-container">
        <h4>Publishers</h4>
        <div
          v-for="publisher in publishers"
          :key="publisher.id_publisher"
          class="entity-card"
          @click="fetchGamesByPublisher(publisher.name)"
        >
          <h4>{{ publisher.name }}</h4>
        </div>
      </div>

      <!-- Implementations -->
      <div class="entities-container">
        <h4>Implementations</h4>
        <div
          v-for="implementation in implementations"
          :key="implementation.id_implementation"
          class="entity-card"
          @click="fetchGamesByImplementation(implementation.name)"
        >
          <h4>{{ implementation.name }}</h4>
        </div>
      </div>

      <!-- Families -->
      <div class="entities-container">
        <h4>Families</h4>
        <div
          v-for="family in families"
          :key="family.id_family"
          class="entity-card"
          @click="fetchGamesByFamily(family.name)"
        >
          <h4>{{ family.name }}</h4>
        </div>
      </div>

      <!-- Display Games -->
      <div v-if="gamesByEntity.length > 0" class="games-container">
        <h4>Games in "{{ selectedEntity }}"</h4>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game in gamesByEntity" :key="game.idgame">
              <td>{{ game.idgame }}</td>
              <td>{{ game.name }}</td>
              <td>{{ game.description }}</td>
              <td>
                <img :src="game.thumbnail" alt="Thumbnail" class="thumbnail" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else-if="selectedEntity" class="no-results">No games found for this entity.</p>
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
      filteredGames: [],
      searchQuery: "",
      newUser: {
        firstname: "",
        lastname: "",
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
      newCategory: {
        name: '',
        gameIds: '',
      },
      showUserForm: false,
      showGameForm: false,
      categories: [],
      selectedCategory: '',
      gamesByCategory: [],
      searchQueryForCategory: '',
      searchResults: [],
      selectedCategoryForGame: {},
      selectedDesignerForGame: {},
      selectedPublisherForGame: {},
      selectedImplementationForGame: {},
      selectedFamilyForGame: {},
      newDesigner: { name: '' },
      newPublisher: { name: '' },
      newImplementation: { name: '' },
      newFamily: { name: '' },
      designers: [],
      publishers: [],
      implementations: [],
      families: [],
      gamesByEntity: [],
      selectedEntity: '',
      showEntityModal: false,
      selectedGame: null,
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
        this.filteredGames = this.games.slice(0, 10); // Show only the first 10 games by default
      } catch (error) {
        console.error("Error fetching games for admin:", error);
        alert("Failed to fetch games.");
      }
    },
    async searchGames() {
      if (this.searchQuery.trim() === "") {
        this.filteredGames = this.games.slice(0, 10); // Reset to the first 10 games if search is empty
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5001/admin/search-games?query=${this.searchQuery}`
        );
        this.filteredGames = response.data;
      } catch (error) {
        console.error("Error searching games:", error);
        alert("Failed to search games.");
      }
    },
    async addUser() {
      try {
        await axios.post("http://localhost:5001/admin/add-user", this.newUser);
        alert("User added successfully.");
        this.newUser = { firstname: "", lastname: "", username: "", email: "", password: "" };
        this.fetchUsers();
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Failed to add user.");
      }
    },
    async addGame() {
      try {
        await axios.post('http://localhost:5001/admin/add-game', {
          name: this.newGame.name,
          description: this.newGame.description,
          yearpublished: this.newGame.yearpublished,
          maxplayers: this.newGame.maxplayers,
          playingtime: this.newGame.playingtime,
          thumbnail: this.newGame.thumbnail,
        });
        alert('Game added successfully.');
        this.newGame = {
          name: "",
          description: "",
          yearpublished: null,
          maxplayers: null,
          playingtime: null,
          thumbnail: "",
        };
      } catch (error) {
        console.error('Error adding game:', error);
        alert('Failed to add game.');
      }
    },
    async addGameWithDetails() {
      try {
        const categories = this.newGame.categories
          ? this.newGame.categories.split(',').map((id) => parseInt(id.trim()))
          : [];
        const designers = this.newGame.designers
          ? this.newGame.designers.split(',').map((id) => parseInt(id.trim()))
          : [];
        await axios.post('http://localhost:5001/admin/add-game-with-details', {
          name: this.newGame.name,
          description: this.newGame.description,
          yearpublished: this.newGame.yearpublished,
          maxplayers: this.newGame.maxplayers,
          playingtime: this.newGame.playingtime,
          thumbnail: this.newGame.thumbnail,
          categories,
          designers,
        });
        alert('Game with details added successfully.');
        this.newGame = {
          name: "",
          description: "",
          yearpublished: null,
          maxplayers: null,
          playingtime: null,
          thumbnail: "",
          categories: "",
          designers: "",
        };
      } catch (error) {
        console.error('Error adding game with details:', error);
        alert('Failed to add game with details.');
      }
    },
    async createCategory() {
      try {
        const gameIds = this.newCategory.gameIds
          .split(',')
          .map((id) => parseInt(id.trim()));

        await axios.post('http://localhost:5001/admin/create-category', {
          categoryName: this.newCategory.name,
          gameIds,
        });

        alert('Category created and games assigned successfully.');
        this.newCategory = { name: '', gameIds: '' };
      } catch (error) {
        console.error('Error creating category:', error);
        alert('Failed to create category.');
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:5001/admin/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to fetch categories.');
      }
    },
    async fetchGamesByCategory(categoryName) {
      this.selectedCategory = categoryName;
      try {
        const response = await axios.get(
          `http://localhost:5001/admin/games-by-category?categoryName=${categoryName}`
        );
        this.gamesByCategory = response.data;
      } catch (error) {
        console.error('Error fetching games by category:', error);
        alert('Failed to fetch games by category.');
      }
    },
    async searchGamesForCategory() {
      if (!this.searchQueryForCategory.trim()) {
        alert('Search query is required.');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/admin/search-games?query=${this.searchQueryForCategory}`
        );
        this.searchResults = response.data;
      } catch (error) {
        console.error('Error searching games:', error);
        alert('Failed to search games.');
      }
    },
    async addGameToCategory(gameId, categoryId) {
      if (!categoryId) {
        alert('Please select a category.');
        return;
      }

      try {
        await axios.post('http://localhost:5001/admin/add-game-to-category', {
          gameId,
          categoryId,
        });
        alert('Game added to category successfully.');
      } catch (error) {
        console.error('Error adding game to category:', error);
        alert('Failed to add game to category.');
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
        alert("Game deleted successfully.");
        this.searchGames(); // Refresh the search results after deletion
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Failed to delete game.");
      }
    },
    async createDesigner() {
      try {
        await axios.post('http://localhost:5001/admin/create-designer', this.newDesigner);
        alert('Designer created successfully.');
        this.newDesigner.name = '';
      } catch (error) {
        console.error('Error creating designer:', error);
        alert('Failed to create designer.');
      }
    },
    async createPublisher() {
      try {
        await axios.post('http://localhost:5001/admin/create-publisher', this.newPublisher);
        alert('Publisher created successfully.');
        this.newPublisher.name = '';
      } catch (error) {
        console.error('Error creating publisher:', error);
        alert('Failed to create publisher.');
      }
    },
    async createImplementation() {
      try {
        await axios.post('http://localhost:5001/admin/create-implementation', this.newImplementation);
        alert('Implementation created successfully.');
        this.newImplementation.name = '';
      } catch (error) {
        console.error('Error creating implementation:', error);
        alert('Failed to create implementation.');
      }
    },
    async createFamily() {
      try {
        await axios.post('http://localhost:5001/admin/create-family', this.newFamily);
        alert('Family created successfully.');
        this.newFamily.name = '';
      } catch (error) {
        console.error('Error creating family:', error);
        alert('Failed to create family.');
      }
    },
    async fetchDesigners() {
      try {
        const response = await axios.get('http://localhost:5001/admin/designers');
        this.designers = response.data;
      } catch (error) {
        console.error('Error fetching designers:', error);
        alert('Failed to fetch designers.');
      }
    },
    async fetchPublishers() {
      try {
        const response = await axios.get('http://localhost:5001/admin/publishers');
        this.publishers = response.data;
      } catch (error) {
        console.error('Error fetching publishers:', error);
        alert('Failed to fetch publishers.');
      }
    },
    async fetchImplementations() {
      try {
        const response = await axios.get('http://localhost:5001/admin/implementations');
        this.implementations = response.data;
      } catch (error) {
        console.error('Error fetching implementations:', error);
        alert('Failed to fetch implementations.');
      }
    },
    async fetchFamilies() {
      try {
        const response = await axios.get('http://localhost:5001/admin/families');
        this.families = response.data;
      } catch (error) {
        console.error('Error fetching families:', error);
        alert('Failed to fetch families.');
      }
    },
    async fetchGamesByDesigner(designerName) {
      this.selectedEntity = designerName;
      try {
        const response = await axios.get(
          `http://localhost:5001/admin/games-by-designer?designerName=${designerName}`
        );
        this.gamesByEntity = response.data;
      } catch (error) {
        console.error('Error fetching games by designer:', error);
        alert('Failed to fetch games by designer.');
      }
    },
    async fetchGamesByPublisher(publisherName) {
      this.selectedEntity = publisherName;
      try {
        const response = await axios.get(
          `http://localhost:5001/admin/games-by-publisher?publisherName=${publisherName}`
        );
        this.gamesByEntity = response.data;
      } catch (error) {
        console.error('Error fetching games by publisher:', error);
        alert('Failed to fetch games by publisher.');
      }
    },
    async fetchGamesByImplementation(implementationName) {
      this.selectedEntity = implementationName;
      try {
        const response = await axios.get(
          `http://localhost:5001/admin/games-by-implementation?implementationName=${implementationName}`
        );
        this.gamesByEntity = response.data;
      } catch (error) {
        console.error('Error fetching games by implementation:', error);
        alert('Failed to fetch games by implementation.');
      }
    },
    async fetchGamesByFamily(familyName) {
      this.selectedEntity = familyName;
      try {
        const response = await axios.get(
          `http://localhost:5001/admin/games-by-family?familyName=${familyName}`
        );
        this.gamesByEntity = response.data;
      } catch (error) {
        console.error('Error fetching games by family:', error);
        alert('Failed to fetch games by family.');
      }
    },
    async addGameToEntity(entityType, gameId, entityId) {
      if (!entityId) {
        alert(`Please select a ${entityType}.`);
        return;
      }

      try {
        await axios.post(`http://localhost:5001/admin/add-game-to-${entityType}`, {
          gameId,
          entityId,
        });
        alert(`Game added to ${entityType} successfully.`);
      } catch (error) {
        console.error(`Error adding game to ${entityType}:`, error);
        alert(`Failed to add game to ${entityType}.`);
      }
    },
    openEntityModal(game) {
      this.selectedGame = game;
      this.showEntityModal = true;
    },
    closeEntityModal() {
      this.showEntityModal = false;
      this.selectedGame = null;
    },
  },
  mounted() {
    this.fetchUsers();
    this.fetchGames();
    this.fetchCategories(); // Fetch categories when the component is mounted
    this.fetchDesigners();
    this.fetchPublishers();
    this.fetchImplementations();
    this.fetchFamilies();
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
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.add-form input,
.add-form textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.add-form textarea {
  height: 80px;
  resize: none;
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

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.no-results {
  color: #999;
  font-style: italic;
  margin-top: 20px;
  text-align: center;
}

.thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.category-card {
  background-color: #f4c959;
  color: white;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  flex: 1 1 calc(25% - 20px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  background-color: #e0b94e;
}

.games-container {
  margin-top: 20px;
}

.category-select {
  margin-right: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.entities-container {
  margin-bottom: 20px;
  
}

.entity-card {
  display: inline-block;
  background-color: #f4c959;
  color: white;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  margin : 20px;
  flex: 1 1 calc(25% - 20px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.entity-card:hover {
  background-color: #e0b94e;
}

.entity-select {
  margin-right: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.close-button {
  background-color: #e44a4a;
  border: none;
  padding: 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #d43a3a;
}
</style>
