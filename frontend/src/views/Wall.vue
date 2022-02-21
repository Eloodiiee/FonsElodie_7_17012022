<template>
  <div v-if="!connected">
    <strong>La connexion avec l'utilisateur n'a pas été établie</strong>
  </div>
  <div class="post-container" v-else>
    <wall-nav />

    <create-post v-on:post-sent="sendPost" />

    <post
      v-for="post in posts"
      v-bind:key="post.postID"
      v-bind:postId="post.postID"
      v-bind:userId="post.userID"
      v-bind:reaction="post.yourReaction"
      v-on:reaction-up="sendReaction(post.postID, 1)"
      v-on:reaction-down="sendReaction(post.postID, -1)"
      v-on:reaction-none="sendReaction(post.postID, 0)"
      v-on:display-comment-input="displayCommentInput"
    >
      <template v-slot:postDelete v-if="userRole == 'admin'">
        <i
          class="fas fa-times"
          aria-hidden="true"
          title="Delete the post"
          role="button"
          v-on:click="deletePost(post.postId)"
        ></i>
        <span class="sr-only">Supprimer le post</span>
      </template>

      <template v-slot:postDelete v-else-if="post.yourPost > 0">
        <i
          class="fas fa-times"
          aria-hidden="true"
          title="Delete the post"
          role="button"
          v-on:click="deletePost(post.postID)"
        ></i>
        <span class="sr-only">Supprimer le post</span>
      </template>

      <template
        v-slot:postGif
        v-if="
          post.gifUrl.includes('.gif') ||
          post.gifUrl.includes('.jpg') ||
          post.gifUrl.includes('.jpeg')
        "
      >
        <img :src="post.gifUrl" alt="Post image" />
      </template>

      <template v-slot:userAvatar>
        <img class="user-avatar" v-bind:src="post.avatarUrl" alt="User avatar" />
      </template>

      <template v-slot:userName>
        {{ post.firstName }} {{ post.lastName }}
      </template>
      <template v-slot:userPseudo v-if="post.pseudo !== null">
        @{{ post.pseudo }}
      </template>
      <template v-slot:postLegend>
        <div>
          <p>{{ post.legend }}</p>
        </div>
      </template>

      <template v-slot:postDate>
        <small>{{ post.dateCreation }}</small>
      </template>
      <template v-slot:postUp>
        <span>{{ post.countUp }}</span>
      </template>
      <template v-slot:postDown>
        <span>{{ post.countDown }}</span>
      </template>

      <template v-slot:createComment>
        <create-comment
          v-on:comment-sent="updateComment"
          v-if="commentInputShow && commentID === post.postID"
        >
          <template v-slot:sendButton>
            <button type="submit" v-on:click.prevent="postComment(post.postID)">
              Commenter
            </button>
          </template>
        </create-comment>
      </template>
    </post>
  </div>
</template>



<script>
import CreateComment from "../components/CreateComment.vue";
import CreatePost from "../components//CreatePost.vue";
import Post from "../components//Post.vue";
import WallNav from "../components/WallNav.vue";
export default {
  name: "Wall",
  components: {
    WallNav,
    CreatePost,
    Post,
    CreateComment,
  },
  data: function () {
    return {
      connected: true,
      posts: [],
      commentInputShow: false,
      commentID: "",
      commentContent: "",
      userRole: "",
    };
  },
  methods: {
    getUserRole() {
      this.$axios
        .get("/auth/role", {params: {userID: sessionStorage.getItem("userID")}})
        .then((response) => {
          this.userRole = response.data[0].role;
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log("Connexion au serveur échouée");
          } else if (error.response.status === 500) {
            console.log(error.response.data);
          } else {
            console.log("Erreur du serveur inconnue");
          }
        });
    },
    getPosts() {
      this.$axios
        .get("/post", { params: { userID: sessionStorage.getItem("userID") } })
        .then((response) => {
          this.posts = response.data;
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log("Connexion au serveur échouée");
            alert("Problème d'autorisation, veuillez vous reconnecter");
            this.$router.push("/");
          } else if (error.response.status === 500) {
            console.log("Erreur du serveur");
            alert("Erreur du serveur");
          } else {
            console.log("Erreur du serveur inconnue");
            alert("Erreur du serveur inconnue");
          }
        });
    },
    sendPost(post) {
      const formData = new FormData();
      formData.append("image", post.image);
      formData.append("legend", post.legend);
      formData.append("userID", sessionStorage.getItem("userID"));
      this.$axios
        .post("/post", formData)
        .then(() => {
          this.getPosts();
        })
        .catch((error) => {
          console.log(error);
          alert("Le post n'a pas pu être envoyé, veuillez vous reconnecter");
        });
    },
    deletePost(postId) {
      this.$axios
        .delete("/post/" + postId)
        .then(() => {
          const index = this.$data.posts.findIndex(
            (post) => post.postId === postId
          );
          if (index != -1) {
            this.$data.posts.splice(index, 1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    sendReaction(postId, reaction) {
      this.$axios
        .post("/post/" + postId + "/react/", {
          reaction,
          userID: sessionStorage.getItem("userID"),
        })
        .then(() => {
          this.getPosts();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    displayCommentInput(postId) {
      this.commentInputShow = true;
      this.commentID = postId;
      console.log("comment id");
      console.log(this.commentID);
    },
    updateComment(content) {
      console.log("updating comment: " + content.comment);
      this.commentContent = content.comment;
    },
    postComment(postId) {
      const formValid = document
        .getElementsByName("commentForm")[0]
        .checkValidity();
      console.log(this.commentContent);
      if (formValid) {
        this.$axios
          .post("/post/" + postId + "/comment/", {
            content: this.commentContent,
            userID: sessionStorage.getItem("userID"),
          })
          .then(() => {
            this.commentInputShow = false;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  created() {
    this.getUserRole();
  },
  mounted() {
    this.getPosts();
    this.getUserRole();
    document.title = "Groupomania - Accueil";
  },
};
</script>

<style>
.post-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}
.user-avatar {
      width: 5rem;
    height: 5rem;
    border-radius: 50%;
    margin-right: 1rem;
    object-fit: cover;
}

</style>
