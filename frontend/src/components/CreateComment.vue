<template>
  <div>
     <form name="commentForm">
      <div>
        <textarea class="text-box"
          name="comment"
          rows="3"
          maxlength="180"
          required
          placeholder="Votre commentaire"
          v-model="comment"
          v-on:input="sendComment"
        ></textarea>
      </div>
  
      <slot name="sendButton"></slot>
    </form>
  </div>
</template>

<script>
export default {
  name:"CreateComment",
  data: function() {
    return {
      comment: "",
    };
  },
  methods: {
    sendComment: function() {
      this.$emit("comment-sent", this.$data);
    },
  },
}
</script>
