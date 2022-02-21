<template>
  <div class="login-container">
    <input
      class="form-control text-center"
      type="text"
      placeholder="Email"
      id="email"
      required
      maxlength="100"
      aria-label="Enter your email"
      v-model="email"
      v-on:input="sendData"
    />

    <input
      class="form-control text-center"
      type="text"
      placeholder="Mot de passe"
      id="password"
      required
      maxlength="30"
      aria-label="Enter your password"
      v-model="password"
      v-on:input="sendData"
    />

    <button type="button" v-on:click="connectUser">Connexion</button>
  </div>
</template>

<style>
.login-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem;
}
button{
      color: #683f87;
    font-weight: bold;
    font-size: 26px;
    margin-top: 90px;

}
</style>

<script>
export default {
  name: "SignupPanel",
  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    sendData() {
      // Envoi des données au parent pour traiter l'envoi à l'API
      this.$emit("data-sent", this.$data);
  
    },
    connectUser() {
      const emailValid = document.getElementById("email").checkValidity();
      const passwordValid = document.getElementById("password").checkValidity();
      if (emailValid && passwordValid) {
        this.$emit("connect-user", this.$data);
      }
    },
  },
};
</script>
