<template>
  <div class="navbar">
    <div class="logo">
      <img class="logo-image" src="../assets/icon-left-font-monochrome-black.png" />
    </div>
    <div class="nav">
      <router-link class="r-link" to="/">Se connecter</router-link>
      <router-link class="r-link" to="/Signup">S'inscrire</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainNav",
};
</script>

<style>
.navbar {
   height: 354px;
  width: 76%;
  box-shadow: none;
  display: flex;
   flex-direction: column;
  align-items: center;
}
.logo{
  display: flex;
  justify-content: center;
  width: 60%;
  height: 210px;
}
.logo-image {
  height: 47%;
  width: 62%;
  object-fit: cover;
}
.nav{
border-radius: 12px;
    display: flex;
    gap: 1rem;
    width: 78%;
    height: 15%;
    justify-content: space-between;
    align-items: center;
}
.r-link{
  display: inline-block;
  background-color: #e6e6e6;
  padding: 0.5rem;
  border-radius: 50px;
  text-decoration: none;
  padding: 14px 0px;
  width: 28%;
  font-weight: bold;
  font-size: 20px;
  box-shadow: 5px 6px 11px #222;
}
</style>
