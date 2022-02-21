<template>
  <div class="create-post-container">
    <form class="create-post" name="createPost">
      <div class="text-box-container">
        <textarea class="text-box" name="legend" rows="3" maxlength="180" required placeholder="Ecrivez ici" v-model="legend">
        </textarea>
      </div>
      <div class="custom-file">
        <input name="image" type="file" required v-on:change="getFile($event)"/>
        <label for="image"></label>
      </div>
      <button class="buttonPost" type="submit" v-on:click.prevent="sendPost()">Poster</button>
    </form>
  </div>
</template>

<script>
export default {
  name:"CreatePost",
  data: function() {
    return {
      legend: "",
      image: "",
    };
  },
  methods: {
    sendPost: function() {
      const formValid = document
        .getElementsByName("createPost")[0]
        .checkValidity();
      if (formValid) {
        this.$emit("post-sent", this.$data);
        document
          .getElementsByName("legend")[0].value = null;
        document
          .getElementsByName("image")[0].value = null;
      }
    },
    getFile: function(event) {
      this.$data.image = event.target.files[0];
    },
  },
}
</script>
<style>
.create-post-container {
       width: 55%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid black;
    justify-content: space-evenly;
    height: 346px;
    box-shadow: 5px 6px 11px #222;
    background-color: rgba(230, 230, 230, 0.5);
    border-radius: 30px;
}
.create-post{
      display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-evenly;
}
.text-box{
     width: 100%;
    padding-top: 7px;
    border-radius: 15px;
    height: 70px;
    font-size: 20px;
}
.custom-file{
  width: 97%;

}
.buttonPost{
  margin-top: 20px;
  box-shadow: 5px 6px 20px #222;
}

</style>