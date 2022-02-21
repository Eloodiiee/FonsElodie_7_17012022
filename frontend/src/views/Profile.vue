<template>
  <div>
    <div class="wall-nav-for-my-profile">
    <wall-nav />
    </div>
    <div class="user-info-container">
    <div>
      <form class="changeForm" v-if="user.yourProfile === 1">
        <div class="input-content">
          <div class="input">
            <span>Photo de profil:</span>
            <input type="file" accept="image/*" v-on:change="updateAvatar" />
          </div>
          <div class="input">
            <span>Pseudo:</span>
            <input type="text" name="pseudo" v-model="user.pseudo" />
          </div>
          <div class="input">
            <span>Email:</span>
            <input type="email" name="email" v-model="user.email" />
          </div>
          <div class="input">
            <span>Description:</span>
            <textarea class="bio" type="text" name="bio" v-model="user.bio"></textarea>
          </div>
          <div class="new-password-container">
            <span>Changer votre mot de passe :</span>
            <div class="input">
              <span>Nouveau mot de passe :</span>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                v-model="user.newPassword"
              />
            </div>
            <div class="input">
              <span>Mot de passe actuel :</span>
              <input
                type="password"
                id="password"
                name="password"
                v-model="user.password"
              />
            </div>
          </div>
          <div class="input-button-container">
            <button class="confirm" type="submit" v-on:click.prevent="updateProfile">
              Confirmer
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="user-info">
      <img class="user-profile-picture" :src="user.avatarUrl" />
      <p>{{ user.firstName }} {{ user.lastName }}</p>
      <p v-if="user.bio != null">{{ user.bio }}</p>
      <p v-if="user.pseudo != null">{{ user.pseudo }}</p>
      <p>{{ user.email }}</p>
    </div>
    <div class="account-delete-form" v-if="user.yourProfile === 1">
      <!-- L'utilisateur peut supprimer son compte -->
      <form>
        <input type="password" id="passwordDelete" />
        <button v-on:click="deleteProfile" class="confirm" type="button">Supprimer le compte</button>
      </form>
    </div>
    </div>
  </div>
</template>



<script>
import WallNav from "../components/WallNav.vue";
export default {
  name: "Profile",
  components: {
    WallNav,
  },
  data: () => {
    return {
      connected: true,
      user: {},
    };
  },
  methods: {
    getUser() {
      this.$axios
        //sessionStorage veut dire dans ce cas que tant que l'utilisateur a son token, sessionStorage conserve son id
        .get(`/auth/profile/${this.$route.params.id}`, {
          params: {
            id: this.$route.params.id,
            userID: sessionStorage.getItem("userID"),
          },
        })
        .then((data) => {
          this.user = data.data[0];
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateAvatar(event) {
      const image = event.target.files[0];
      let formData = new FormData();
      formData.append("image", image);
      formData.append("userID", sessionStorage.getItem("userID"));
      this.$axios
        .put("auth/modify", formData)
        .then(() => {
          this.getUser();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateProfile() {
      //Met à jour les autres infos
      const email = this.user.email;
      const pseudo = this.user.pseudo;
      const bio = this.user.bio;
      const password = document.getElementById("password").value;
      const newPassword = document.getElementById("newPassword").value;
      let data;

      if (newPassword === "") {
        data = {
          userID: sessionStorage.getItem("userID"),
          email: email,
          pseudo: pseudo,
          bio: bio,
          password: password,
        };
      } else {
        data = {
          userID: sessionStorage.getItem("userID"),
          email: email,
          pseudo: pseudo,
          bio: bio,
          password: password,
          newPassword: newPassword,
        };
      }
      this.$axios
        .put("auth/modify", data)
        .then(() => {
          this.$router.go();
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.messageError = "Mot de passe incorrect";
          }
        });
    },
    deleteProfile() {
      const password = document.getElementById("passwordDelete").value;
      this.$axios
        .delete("auth/delete", {
          data: {
            password: password,
            userID: sessionStorage.getItem("userID"),
          },
        })
        .then(() => {
          sessionStorage.removeItem("userID");
          sessionStorage.removeItem("token");
          delete this.$axios.defaults.headers.common["Authorization"];
          this.$router.push("/");
        })
        .catch((e) => {
          if (e.response.status === 401) {
            console.log("Mot de passe incorrect");
          }
        });
    },
  },
  mounted() {
    //Récupère les posts et défini le titre
    this.getUser();
    document.title = "Profil | Groupomania";
  },
  watch: {
    "$route.params.id": function () {
      this.getUser();
    },
  },
};
</script>

<style>
.wall-nav-for-my-profile{
  display: flex;
  flex-flow:column;
  align-items: center;

}
.user-info-container{
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(230, 230, 230, 0.5);
  border-radius: 15px;
  box-shadow: 5px 5px 5px #222;
     margin: 0% 20%;
     width: 60%;
     height: 127vh;
    justify-content: space-evenly;
}
.user-profile-picture{
  height: 200px;
  border-radius: 1.5rem;
}
.input-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 0.5rem;
  height: 74vh;
}
.input {
  display: flex;
  flex-direction: row nowrap;
    width: 100%;
  justify-content: space-between;
}
.confirm{
  margin-top: 5px;
  margin-bottom: 5px;
}

.new-password-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 0.5rem;
  height: 22vh;
}
#passwordDelete{
  width: 50%;
}
.bio{
  width: 100%;
  border-radius: 10px;
}
</style>