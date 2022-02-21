<template>
  <div class="login-main-menu">
    <main-nav />
    <div class="boxMenu">
    <p class="identifiants">
      Entrez vos identifiants :
    </p>
    <form>
      <LoginPanel v-on:data-sent="updateLoginData" v-on:connect-user="login" />
    </form>
    </div>
  </div>
</template>



<script>
import MainNav from "../components/MainNav.vue";
import LoginPanel from "../components/LoginPanel.vue";

export default {
  name: "Login",
  components: {
    MainNav,
    LoginPanel,
  },
  data: () => {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      this.$axios
        .post("/auth/login", this.$data)
        .then((res) => {
          sessionStorage.setItem("userID", res.data.userID);
          sessionStorage.setItem("token", res.data.token);
          this.$axios.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.token;
          this.$router.push("/Wall");
        })
        .catch((err) =>{
          console.error(err.message)
          if (err.response.status === 401) {
            alert("Wrong email or password");
          }
          else if (err.response.status === 500) {
            alert("Server error");
          }
        })
    },
    updateLoginData(data) {
      this.email = data.email;
      this.password = data.password;
    },
  },
  mounted() {
    sessionStorage.removeItem("token");
    delete this.$axios.defaults.headers.common["Authorization"];
    document.title = "Login | Groupomania";
  },
};
</script>
<style>
p{
  
    font-size: 16px;
    color: black;
}
.identifiants{
  font-weight: bold;
    font-size: 22px;
    color: black;
}
input{
  border-radius: 10px;
  padding: 0.5rem;
  border: 1px solid #e6e6e6;
  width: 100%;
  height: 20px;
  font-size: 17px;
}
.login-main-menu{
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: column;
}
.boxMenu{
background-color: #e6e6e6;
    border-radius: 20px;
    height: 46%;
    width: 22%;
    margin-top: 41px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
</style>