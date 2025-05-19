<template>
  <div class="profile-page" v-if="user">
    <div class="profile-card">
      <h2>👤 Welcome, {{ user.firstname }} {{ user.lastname }}!</h2>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>

      <div class="section">
        <label><strong>First Name:</strong></label>
        <input type="text" v-model="firstname" />
        <label><strong>Last Name:</strong></label>
        <input type="text" v-model="lastname" />
        <button @click="saveName">Save Name</button>
      </div>

      <div class="section">
        <label><strong>Birthdate:</strong></label>
        <div v-if="birthdateSaved">
          <p>{{ formattedBirthdate }}</p>
        </div>
        <div v-else>
          <input type="date" v-model="birthdate" />
          <button @click="saveBirthdate">Save Birthdate</button>
        </div>
      </div>

      <div class="section">
        <h3>🔐 Change Password</h3>
        <input type="password" placeholder="New Password" v-model="newPassword" />
        <input type="password" placeholder="Confirm New Password" v-model="confirmPassword" />
        <button @click="changePassword">Update Password</button>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Profile',
  data() {
    return {
      user: null,
      firstname: '',
      lastname: '',
      birthdate: '',
      birthdateSaved: false,
      newPassword: '',
      confirmPassword: '',
      errorMessage: '' // Store error messages here
    };
  },
  computed: {
    formattedBirthdate() {
      if (!this.birthdate) return '';
      const date = new Date(this.birthdate);
      return date.toLocaleDateString(); // Format as MM/DD/YYYY or DD/MM/YYYY based on locale
    }
  },
  async mounted() {
    const username = this.$route.params.username;
    try {
      const res = await axios.get(`http://localhost:5001/account/${username}`);
      this.user = res.data.user;
      this.firstname = this.user.firstname || '';
      this.lastname = this.user.lastname || '';
      this.birthdate = this.user.birthdate || '';
      this.birthdateSaved = !!this.user.birthdate;
    } catch (err) {
      console.error('Error loading user profile:', err);
      this.errorMessage = err.response?.data?.message || 'Unable to load user profile.';
    }
  },
  methods: {
    async saveName() {
      this.errorMessage = ''; // Clear previous error messages
      try {
        await axios.post('http://localhost:5001/update-name', {
          id_user: this.user.id_user,
          firstname: this.firstname,
          lastname: this.lastname
        });
        alert('Name updated successfully.');
      } catch (err) {
        this.errorMessage = 'Failed to update name.';
      }
    },
    async saveBirthdate() {
      this.errorMessage = ''; // Clear previous error messages
      try {
        await axios.post('http://localhost:5001/update-birthdate', {
          id_user: this.user.id_user,
          birthdate: this.birthdate
        });
        this.birthdateSaved = true;
        alert('Birthdate saved successfully.');
      } catch (err) {
        this.errorMessage = 'Failed to update birthdate.';
      }
    },
    async changePassword() {
      this.errorMessage = ''; // Clear previous error messages
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
      if (!this.newPassword) {
        this.errorMessage = 'Password cannot be empty.';
        return;
      }
      try {
        await axios.post('http://localhost:5001/change-password', {
          id_user: this.user.id_user,
          newPassword: this.newPassword
        });
        this.newPassword = '';
        this.confirmPassword = '';
        alert('Password updated successfully.');
      } catch (err) {
        this.errorMessage = 'Failed to update password.';
      }
    }
  }
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.profile-card {
  background-color: white;
  padding: 30px;
  padding-right: 50px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.profile-card h2 {
  color: #5e3c2b;
  margin-bottom: 20px;
}
.profile-card p,
.section label {
  color: #7a5a44;
  margin: 10px 0;
  font-size: 1rem;
}
.section {
  margin-top: 20px;
}
.section input {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.section button {
  background-color: #f4c959;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}
.section button:hover {
  background-color: #e0b94e;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 10px;
}
</style>
