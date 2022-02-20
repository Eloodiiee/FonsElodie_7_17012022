<template>
  <div class="navbar">
    <div class="logo">
      <img class="logo-image" src="../assets/icon-left-font-monochrome-black.png">
    </div>

    <div class="nav">
    <router-link class="r-link" to="/Wall">Accueil</router-link>
    <router-link class="r-link"
      :to="{
        //name has to be the same as COMPONENT vue
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
