<template>
  <div v-if="!connected">
    <strong>La connexion avec l'utilisateur n'a pas été établie</strong>
  </div>
  <div class="post-container" v-else>
    <wall-nav />

    <post
      v-if="posts"
      v-bind:userId="posts.at(-1).userID"
      v-bind:reaction="posts.at(-1).yourReaction"
      v-bind:postId="posts.at(-1).postID"
      v-on:display-comment-input="displayCommentInput"
      v-on:reaction-down="sendReaction(posts.at(-1).postID, -1)"
      v-on:reaction-up="sendReaction(posts.at(-1).postID, 1)"
      v-on:reaction-none="sendReaction(posts.at(-1).postID, 0)"
    >
      <template v-slot:deletePost v-if="userRole == 'admin'">
        <i
          class="fas fa-times"
          role="button"
          v-on:click="deletePost(post.postId)"
        ></i>
        <span>Supprimer le post</span>
      </template>

      <template v-slot:deletePost v-else-if="posts.at(-1).yourPost > 0">
        <i
          class="fas fa-times"
          role="button"
          v-on:click="deletePost(posts.at(-1).postID)"
        ></i>
        <span>Supprimer le post</span>
      </template>

      <template
        v-slot:postGif
        v-if="posts.at(-1).gifUrl != null && posts.at(-1).gifUrl != ''"
      >
        <img v-bind:src="posts.at(-1).gifUrl" alt="Post image" />
      </template>

      
      <template v-slot:postLegend>
        <div>
          <p>{{ posts.at(-1).legend }}</p>
        </div>
      </template>

      <template v-slot:postDate>
        <small>{{ posts.at(-1).dateCreation }}</small>
      </template>
      <template v-slot:postUp>
        <span>{{ posts.at(-1).countUp }}</span>
      </template>
      <template v-slot:postDown>
        <span>{{ posts.at(-1).countDown }}</span>
      </template>

      <template v-slot:createComment>
        <create-comment
          v-on:comment-sent="updateComment"
          v-if="commentInputShow && commentID === posts.at(-1).postID"
        >
          <template v-slot:sendButton>
            <button type="submit" v-on:click.prevent="postComment(posts.at(-1).postID)">
              Commenter
            </button>
          </template>
        </create-comment>
      </template>
    </post>

    <comment
    v-for="comment in comments"
    v-bind:key="comment.postID"
    v-bind:userId="comment.userID"
    v-on:reaction-down="sendReaction(comment.postID, -1)"
    v-on:reaction-up="sendReaction(comment.postID, 1)"
    v-on:reaction-none="sendReaction(comment.postID, 0)"
    v-bind:reaction="comment.yourReaction"
    >
      <template v-slot:commentDelete v-if="comment.yourPost > 0">
        <i
          class="fas fa-times"
          role="button"
          v-on:click="deletePost(comment.postID)"
        ></i>
        <span>Supprimer le commentaire</span>
      </template>

      <template v-slot:userAvatar>
        <img class="user-avatar"
          v-bind:src="comment.avatarUrl"
          alt="User avatar"
        />
      </template>

      <template v-slot:userName> {{ comment.firstName }} {{ comment.lastName }} </template>
      <template v-slot:userPseudo v-if="comment.pseudo !== null">
        @{{ comment.pseudo }}
      </template>

      <template v-slot:commentBody>
        <p>{{ comment.body }}</p>
      </template>
      
      <template v-slot:commentDate>
         <small>{{ comment.dateCreation }}</small>
      </template>
      <template v-slot:commentUp>
        <span>{{ comment.countUp }}</span>
      </template>
      <template v-slot:commentDown>
        <span>{{ comment.countDown }}</span>
      </template>
    </comment>

  </div>
</template>

<script>
import Comment from '../components/Comment.vue';
import CreateComment from "../components/CreateComment.vue";
import Post from "../components/Post.vue";
import WallNav from "../components/WallNav.vue";
export default {
  name: "Wall",
  components: {
    WallNav,
    Post,
    CreateComment,
    Comment,
  },
  data: function() {
    return {
      connected: true,
      posts: [false],
      commentInputShow: false,
      commentID: "",
      commentContent: "",
      userRole: "",
      comments: [],
    };
  },
  methods: {
    getUserRole() {
      this.$axios.get("/auth/role", {params: {userID: sessionStorage.getItem("userID")}})
      .then((response) => {
        this.userRole = response.data[0].role;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // this.connected = false;
          console.log("Connection to server failed")
        }
        else if(error.response.status === 500) {
          console.log("Server error")
        }
        else {
          console.error(error.response)
          console.log("Unknown server error")
        }
      })
    },
    getComments(){
      this.$axios.get(`post/${this.$route.params.id}/comments`, { params: {userID : sessionStorage.getItem("userID")}})
      .then((response) =>{
        console.log("Getting comments: ")
        console.log(response.data)
        this.comments = response.data
      })
      .catch((error) =>{
        console.log("Error getting comments: ")
        console.log(error)
      })
    },
    selectCorrectPost(){
      this.posts = this.posts.filter(post => post.postID === this.$route.params.id)
    },
    getPosts() {
      this.$axios.get("/post", { params: { userID: sessionStorage.getItem("userID") } })
      .then((response) => {
        console.log("Gettign posts:")
        console.log(response.data)
        this.posts = response.data;
        this.selectCorrectPost()
        this.getComments()
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // this.connected = false;
          console.log("Connection to server failed")
        }
        else if(error.response.status === 500) {
          console.log("Server error")
        }
        else {
          console.log("Unknown server error")
          console.error(error.response)
        }
      })
    },
    sendPost(post) {
      const formData = new FormData();
      formData.append("image", post.image)
      formData.append("postLegend", post.postLegend)
      this.$axios.post("/post", formData)
      .then(() => {
        this.getPosts()
      })
      .catch((error) => {console.log(error)})
    },
    deletePost(postId){
      this.$axios.delete("/post/" + postId, {params: {userID: sessionStorage.getItem("userID")}})
      .then(() => {
        let index = this.posts.findIndex((post => post.postID === postId))
        if (index === -1){
          index = this.comments.findIndex((post => post.postID === postId))
          this.comments.splice(index, 1)
          this.getComments()
        }
        else{
          this.posts.splice(index, 1)
          this.$router.push("/Wall")
        }
      })
      .catch((error) => {console.log(error)})
    },
    sendReaction(postId, reaction) {
      this.$axios.post("/post/" + postId + "/react/", { reaction, userID:sessionStorage.getItem("userID") })
      .then(() => {
        this.getPosts()
      })
      .catch((error) => {console.log(error)})
    },
    displayCommentInput(postId) {
      this.commentInputShow = true;
      this.commentID = postId;
       console.log("comment id")
      console.log(this.commentID)
    },
    updateComment(content) {
      // console.log("updating comment: " + content.comment)
      this.commentContent = content.comment;
    },
    postComment(postId) {
      console.log("POSTID:", postId)
      const formValid = document.getElementsByName("commentForm")[0]
      .checkValidity();
      if (formValid) {
        console.log("commentContent: ")
        console.log(this.commentContent)
        this.$axios
        .post("/post/" + postId + "/comment/", {content: this.commentContent, userID: sessionStorage.getItem("userID")})
        .then(() => {
          this.getPosts()
          this.commentInputShow = false;
        })
        .catch((error) => {console.log(error)})
      }
    },
  },
  created() {
    this.getUserRole();
  },
  mounted() {
    this.getPosts();
    this.getUserRole()
    console.log("Comments:")
    console.log(this.comments)
    document.title ="Groupomania - Post";
  },
};
</script>
