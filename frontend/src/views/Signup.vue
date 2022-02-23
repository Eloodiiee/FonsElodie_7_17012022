<template>
  <div class="login-main-menu">
    <main-nav />
     <div class="boxMenu">
    <p class="identifiants">
      Entrez vos coordonnées pour vous inscrire :
    </p>
    <form onsubmit="return false">
      <SignupPanel v-on:data-sent="updateSingupData" />
      <LoginPanel v-on:connect-user="signup" v-on:data-sent="updateLoginData" />
    </form>
    </div>
  </div>
</template>

<style>
button{
  border-radius: 20px;
  padding: 0.5rem;
  border: 1px solid black;
}
.boxMenu{
background-color: #e6e6e6;
    border-radius: 20px;
    height: 55%;
    width: 22%;
    margin-top: 41px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

</style>


<script>
import MainNav from "../components/MainNav.vue";
import LoginPanel from "../components/LoginPanel.vue";
import SignupPanel from "../components/SignupPanel.vue";

export default {
  name: "Signup",
  components: {
    LoginPanel,
    SignupPanel,
    MainNav,
  },
  data: function () {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      avatarUrl: "",
    };
  },
  methods: {
    signup() {
      console.log("Envoi des données de l'inscription");
      console.log(this.$data.email);
      console.log(this.$data.password);
      console.log(this.$data.firstName);
      console.log(this.$data.lastName);
      this.$axios
        .post("/auth/signup", this.$data)
        .then((res) => {
          console.log(`Envoi au serveur ${this.$data}`);
          //Cela va rediriger l'utilisateur vers la page de connexion
          this.$router.push("/");
        })
        .catch((err) =>{
          console.error(err.message)
          if (err.response.status === 401) {
            alert("Email ou mot de passe incorrect !");
          }
          else if (err.response.status === 500) {
            alert("Erreur du serveur !");
          }
        })
    },
    updateSingupData(data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    },
    updateLoginData(data) {
      this.email = data.email;
      this.password = data.password;
    },
  },
};
</script>
