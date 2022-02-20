<template>
  <div class="signup-container">
    <input
      class="form-control text-center"
      type="text"
      placeholder="Prénom"
      id="firstName"
      required
      maxlength="30"
      aria-label="Enter your first name"
      v-model="firstName"
      v-on:input="sendData"
    />

    <input
      class="form-control text-center"
      type="text"
      placeholder="Nom"
      id="lastName"
      required
      maxlength="30"
      aria-label="Enter your last name"
      v-model="lastName"
      v-on:input="sendData"
    />
  </div>
</template>

<style>
.signup-container {
    display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem;
}
</style>

<script>
export default {
  name: "SignupPanel",
  data() {
    return {
      firstName: "",
      lastName: "",
    };
  },

  methods: {
    sendData() {
      // Envois des données au parent pour traiter l'envois à l'API
      //   const firstNameValid = document
      //     .getElementById("firstName")
      //     // .checkValidity();
      //   const lastNameValid = document.getElementById("lastName").checkValidity();
      //   if (firstNameValid && lastNameValid) {
      this.$emit("data-sent", this.$data);
      //   }
    },
  },
};
</script>
