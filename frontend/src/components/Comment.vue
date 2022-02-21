<template>
  <div class="comment-container">
    <div class="comment">
      <div class="comment-container-author-content">
      <div class="author">
        <p role="link" v-on:click="openProfile(userId)">
          <slot name="userAvatar"></slot>
          <slot name="userName"></slot>
          <slot name="userPseudo"></slot>
        </p>
      </div>

      <div class="content">
        <p>
          <slot name="commentBody"></slot>
        </p>
      </div>
      </div>
      <div class="reactions">
        <div class="like">
        <i
          class="fas fa-thumbs-up"
          role="button"
          v-on:click="sendReactionUp"
        ></i>
        <span v-on:click="sendReactionUp"></span>
        <span>
          <slot name="commentUp"></slot>
        </span>
        </div>
        <div class="dislike">
        <i
          class="fas fa-thumbs-down"
          role="button"
          v-on:click="sendReactionDown"
        ></i>
        <span v-on:click="sendReactionDown"></span>
        <span>
          <slot name="commentDown"></slot>
        </span>
        </div>
      </div>

      <div class="date">
        <small>
          <slot name="commentDate"></slot>
        </small>
      </div>
      <slot name="commentDelete"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: ["userId", "reaction"],
  data: function (){
    return {
      reactionUp: "",
      reactionDown: "",
    };
  },
  methods: {
    openProfile(userId) {
      this.$router.push({ name: "Profile", params: { id: userId } });
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
updateReaction() {
      if (this.reaction === 1) {
        this.reactionUp = "reactionActive";
        this.reactionDown = "reactionNone";
      } else if (this.reaction === -1) {
        this.reactionUp = "reactionNone";
        this.reactionDown = "reactionActive";
      } else {
        this.reactionUp = "reactionNone";
        this.reactionDown = "reactionNone";
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
.comment-container{
    display: flex;
    flex-direction: column;
    width: 34%;
    border: 2px solid black;
    border-radius: 15px;
    margin-bottom: 15px;
    background-color: rgba(230, 230, 230, 0.5);
  box-shadow: 5px 5px 5px #222;
}
.comment-container-author-content{
  display: flex;
  flex-direction: column;
  align-items: center;
 
}

.comment {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  
}
</style>