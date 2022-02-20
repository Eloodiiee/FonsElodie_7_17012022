<template>
  <div class="post">
    

      <div class="author">
        <p class="author-info" role="link" v-on:click="openProfile(userId)">
          <slot name="userAvatar"></slot>
          <slot name="userName"></slot>
          <slot name="userPseudo"></slot>
        </p>
      </div>
      <div class="content">
        <slot name="postLegend"></slot>
        <div class="postGif" role="link" v-on:click="openPost(postId)">
          <slot name="postGif"></slot>
        </div>
      </div>
      <div class="reactions">
        <div class="like">
        <i
          class="fas fa-thumbs-up fa-lg"
          role="button"
          v-on:click="sendReactionUp"
        ></i>
        <span v-on:click="sendReactionUp"></span>
        <span>
          <slot name="postUp"></slot>
        </span>
        </div>
        <div class="dislike">
        <i
          class="fas fa-thumbs-down fa-lg"
          role="button"
          v-on:click="sendReactionDown"
        ></i>
        <span v-on:click="sendReactionDown"></span>
        <span>
          <slot name="postDown"></slot>
        </span>
        </div>
      </div>
    
    <div class="footer">
         <slot name="deletePost"></slot>
      <p>
        <a class="d-md-none">
          <i
            class="fas fa-comments"
            role="button"
            v-on:click="displayCommentInput"
          ></i>
          <span v-on:click="displayCommentInput">Commentaires</span>
        </a>
        <slot name="createComment"></slot>
      </p>
      <div class="date">
        <small>
          <slot name="postDate"></slot>
        </small>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: "Post",
  props: ["postId", "userId", "reaction"],
  data() {
    return {
      reactionUp: "",
      reactionDown: "",
    };
  },
  methods: {
    openProfile(userId) {
      this.$router.push({
        name: "Profile",
        params: {
          id: userId,
        },
      });
    },
    openPost(postId) {
      this.$router.push({
        name: "Post",
        params: {
          id: postId,
        },
      });
    },
    sendReactionUp() {
      if (this.reaction === 1) {
        this.$emit("reaction-none");
      } else {
        this.$emit("reaction-up");
      }
    },
    sendReactionDown() {
      if (this.reaction === -1) {
        this.$emit("reaction-none");
      } else {
        this.$emit("reaction-down");
      }
    },
    displayCommentInput() {
      //  console.log("POST ID")
      //  console.log(this.postId)
      this.$emit("display-comment-input", this.postId);
    },
    updateReaction() {
      if (this.reaction === 1) {
        this.reactionUp = "active";
        this.reactionDown = "inactive";
      } else if (this.reaction === -1) {
        this.reactionUp = "inactive";
        this.reactionDown = "active";
      } else {
        this.reactionUp = "inactive";
        this.reactionDown = "inactive";
      }
    },
  },
  mounted() {
    this.updateReaction();
  },
  updated() {
    this.updateReaction();
  },
};
</script>
<style>
.author-info{
  display: flex;
  align-items: center;
}
.post{
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 30px;
  border: 2px solid black;
  box-shadow: 5px 6px 11px #222;
  margin-bottom: 1rem;
  margin-top: 50px;
  padding: 1rem;
  width: 60%;
  background-color: rgba(230, 230, 230, 0.5);
}
.postGif {
  display: inline-block;
  overflow: hidden;

}
.postGif img{
  
    width: 100%;
    object-fit: cover;
   

}
.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 0.5rem;
}
.author {
  display: flex;
  align-self: flex-start;
  /* border: 2px solid blue; */
}

.content {
    border: 2px solid black;
    width: 60%;
    border-radius: 20px;
    box-shadow: 5px 5px 6px #222;
    overflow: hidden;
    background-color: #e6e6e6;
}
.reactions{
  display: flex;
  justify-content: space-evenly;
  margin-top: 6px;
  width: 100%;
}
.like{
width: 9%;
 background-color: #e6e6e6;
 padding: 5px;
border-radius: 5px;
display: flex;
justify-content: space-evenly;
align-items: center;
border: 2px solid black;
}
.dislike{
width: 9%;
background-color: #e6e6e6;
padding: 5px;
border-radius: 5px;
display: flex;
justify-content: space-evenly;
align-items: center;
border: 2px solid black;
}
</style>