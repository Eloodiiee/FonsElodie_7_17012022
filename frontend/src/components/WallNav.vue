<template>
  <div class="navbar">
    <div class="logo">
      <img class="logo-image" src="../assets/icon-left-font-monochrome-black.png">
    </div>

    <div class="nav">
    <router-link class="r-link" to="/Wall">Accueil</router-link>
    <router-link class="r-link"
      :to="{
        //Le nom doit être identique à celui du composant VUE
        name: 'Profile',
        params: {
          id: 'yourProfile',
        },
      }"
      >Mon Profil</router-link
    >
    <router-link class="r-link" to="/">Se déconnecter</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "WallNav",
};
</script>

<style>
.nav{
  display: flex;
}

</style>
