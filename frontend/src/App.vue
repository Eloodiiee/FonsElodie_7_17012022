<template>
  <div id="app"><router-view /></div> <!-- to launch all other Vue elements-->
</template>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  height: 98vh;
}
body{

background: rgb(137,92,193);

}
/* img {
  width:50px;
  height: 50px;
} */
</style>


<script>
export default {
  mounted() {
    let fontAwesomeScript = document.createElement("script");
    fontAwesomeScript.src = "https://kit.fontawesome.com/c5c10cb967.js";
    document.head.appendChild(fontAwesomeScript);
  },
}
</script>
