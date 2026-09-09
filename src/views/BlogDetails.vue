<template>
  <div class="details-container">

    <div v-if="loading" class="message">
      🐾 Loading blog...
    </div>

    <div v-else-if="error" class="message error">
      {{ error }}
    </div>

    <div v-else-if="blog">

      <!-- BLOG -->
      <article class="blog-details">

        <div class="paw-icon">
          🐾
        </div>

        <h1>{{ blog.title }}</h1>

        <p class="author">
          🐾 By {{ blog.author?.email || 'Unknown author' }}
        </p>

        <div class="content">
          {{ blog.content }}
        </div>

        <div class="blog-actions">

          <template v-if="isAuthor()">

            <router-link 
              :to="`/edit-blog/${blog._id}`"
              class="edit-button"
            >
              ✏️ Edit Blog
            </router-link>

            <button 
              @click="deleteBlog"
              class="delete-button"
            >
              🗑️ Delete Blog
            </button>

          </template>

          <router-link
            to="/"
            class="back-button"
          >
            ← Back to Home
          </router-link>

        </div>

      </article>


      <!-- COMMENTS -->
      <section class="comments-section">

        <div class="comments-title">
          <span>🐾</span>
          <h2>Comments</h2>
          <span>🐾</span>
        </div>


        <!-- ADD COMMENT -->
        <div
          v-if="isLoggedIn"
          class="comment-form"
        >

          <textarea
            v-model="newComment"
            placeholder="Share your thoughts about this story..."
            rows="4"
          ></textarea>

          <button
            @click="addComment"
            :disabled="submitting"
          >
            {{ submitting ? 'Posting...' : 'Post Comment 🐾' }}
          </button>

          <p
            v-if="commentMessage"
            class="success"
          >
            {{ commentMessage }}
          </p>

        </div>


        <p
          v-else
          class="login-message"
        >
          🐶 Please log in to leave a comment.
        </p>


        <!-- COMMENT LIST -->

        <div
          v-if="commentsLoading"
          class="message"
        >
          🐾 Loading comments...
        </div>


        <div
          v-else-if="comments.length === 0"
          class="no-comments"
        >
          🐾 No comments yet. Be the first to comment!
        </div>


        <div
          v-for="comment in comments"
          :key="comment._id"
          class="comment"
        >

          <p class="comment-author">
            🐾 {{ comment.author?.email || 'Unknown user' }}
          </p>

          <p class="comment-text">
            {{ comment.comment }}
          </p>

        </div>

      </section>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import API_URL from '../api'

const route = useRoute()
const router = useRouter()
const blog = ref(null)
const comments = ref([])

const loading = ref(true)
const commentsLoading = ref(true)
const error = ref('')

const newComment = ref('')
const submitting = ref(false)
const commentMessage = ref('')

const isLoggedIn = ref(false)
const currentUserId = ref('')

const checkLogin = () => {
  const token = localStorage.getItem('access')

  if (!token) {
    isLoggedIn.value = false
    currentUserId.value = ''
    return
  }

  isLoggedIn.value = true

  try {
    const payload = JSON.parse(
      atob(token.split('.')[1])
    )

    currentUserId.value = payload.id

  } catch (error) {
    console.error('Invalid token:', error)

    isLoggedIn.value = false
    currentUserId.value = ''
  }
}

const isAuthor = () => {
  if (!blog.value || !currentUserId.value) {
    return false
  }

  const authorId =
    blog.value.author?._id || blog.value.author

  return authorId?.toString() === currentUserId.value.toString()
}

const fetchBlog = async () => {
  try {
    const response = await fetch(
      `${API_URL}/blogs/${route.params.id}`
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load blog')
    }

    blog.value = data.blog

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const fetchComments = async () => {
  try {
    const response = await fetch(
      `${API_URL}/comments/blog/${route.params.id}`
    )

    const data = await response.json()

    if (response.ok) {
      comments.value = data.comments || []
    }

  } catch (err) {
    console.error('Failed to load comments:', err)
  } finally {
    commentsLoading.value = false
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) {
    commentMessage.value = 'Please write a comment.'
    return
  }

  const token = localStorage.getItem('access')

  if (!token) {
    commentMessage.value = 'Please log in first.'
    return
  }

  submitting.value = true
  commentMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        comment: newComment.value,
        blogId: route.params.id
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to post comment')
    }

    newComment.value = ''
    commentMessage.value = 'Comment posted successfully!'

    await fetchComments()

  } catch (err) {
    commentMessage.value = err.message
  } finally {
    submitting.value = false
  }
}

const deleteBlog = async () => {
  const token = localStorage.getItem('access')

  if (!token) {
    alert('Please log in first.')
    return
  }

  const confirmed = confirm(
    'Are you sure you want to delete this blog?'
  )

  if (!confirmed) {
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/blogs/${route.params.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete blog')
    }

    alert('Blog deleted successfully!')

    router.push('/')

  } catch (error) {
    alert(error.message)
  }
}

onMounted(() => {
  checkLogin()
  fetchBlog()
  fetchComments()
})
</script>

<style scoped>

/* =========================
   PAGE
========================= */

.details-container {
  width: 100%;
  min-height: 100vh;

  padding: 45px 20px 70px;

  box-sizing: border-box;

  background: #F5F8FA;
}


/* =========================
   BLOG
========================= */

.blog-details {
  width: 100%;
  max-width: 900px;

  margin: 0 auto 25px;

  padding: 40px;

  box-sizing: border-box;

  background: #E8F5FE;

  border: 2px solid #E1E8ED;

  border-radius: 20px;

  box-shadow:
    0 6px 20px rgba(20, 23, 26, 0.08);
}


/* =========================
   PAW ICON
========================= */

.paw-icon {
  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #FFFFFF;

  border-radius: 50%;

  font-size: 30px;

  margin-bottom: 20px;

  border: 2px solid #E1E8ED;

  box-shadow:
    0 4px 10px rgba(20, 23, 26, 0.08);
}


/* =========================
   TITLE
========================= */

.blog-details h1 {
  font-size: 38px;

  line-height: 1.25;

  margin: 0 0 12px;

  color: #14171A;
}


/* =========================
   AUTHOR
========================= */

.author {
  color: #657786;

  font-size: 14px;

  margin-bottom: 30px;
}


/* =========================
   CONTENT
========================= */

.content {
  font-size: 18px;

  line-height: 1.9;

  white-space: pre-line;

  color: #14171A;

  margin-bottom: 30px;
}


/* =========================
   ACTION BUTTONS
========================= */

.blog-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 10px;

  align-items: center;

  margin-top: 25px;
}


.edit-button,
.delete-button,
.back-button {
  padding: 11px 18px;

  border-radius: 20px;

  text-decoration: none;

  border: none;

  cursor: pointer;

  font-size: 14px;

  font-weight: bold;

  transition: 0.2s;
}


/* EDIT */

.edit-button {
  background: #1DA1F2;

  color: #FFFFFF;
}

.edit-button:hover {
  background: #1677B8;

  transform: translateY(-2px);
}


/* DELETE */

.delete-button {
  background: #FFFFFF;

  color: #E0245E;

  border: 1px solid #E1E8ED;
}

.delete-button:hover {
  background: #FCE8EF;

  transform: translateY(-2px);
}


/* BACK */

.back-button {
  background: #657786;

  color: #FFFFFF;
}

.back-button:hover {
  background: #536471;

  transform: translateY(-2px);
}


/* =========================
   COMMENTS
========================= */

.comments-section {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;

  padding: 35px 40px;

  box-sizing: border-box;

  background: #FFFFFF;

  border: 2px solid #E1E8ED;

  border-radius: 20px;

  box-shadow:
    0 6px 20px rgba(20, 23, 26, 0.06);
}


/* COMMENTS TITLE */

.comments-title {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  margin-bottom: 25px;
}


.comments-title h2 {
  margin: 0;

  font-size: 28px;

  color: #14171A;
}


.comments-title span {
  font-size: 20px;
}


/* =========================
   COMMENT FORM
========================= */

.comment-form {
  padding: 20px;

  background: #E8F5FE;

  border: 1px solid #E1E8ED;

  border-radius: 15px;

  margin-bottom: 25px;
}


.comment-form textarea {
  width: 100%;

  padding: 14px;

  box-sizing: border-box;

  border: 2px solid #E1E8ED;

  border-radius: 12px;

  resize: vertical;

  font-family: inherit;

  font-size: 15px;

  background: #FFFFFF;

  color: #14171A;

  outline: none;
}


.comment-form textarea::placeholder {
  color: #AAB8C2;
}


.comment-form textarea:focus {
  border-color: #1DA1F2;

  box-shadow:
    0 0 0 3px
    rgba(29, 161, 242, 0.12);
}


/* POST COMMENT */

.comment-form button {
  margin-top: 12px;

  padding: 11px 18px;

  background: #1DA1F2;

  color: #FFFFFF;

  border: none;

  border-radius: 20px;

  cursor: pointer;

  font-weight: bold;
}


.comment-form button:hover {
  background: #1677B8;
}


.comment-form button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* =========================
   SUCCESS
========================= */

.success {
  color: #17BF63;

  margin-top: 10px;

  font-size: 14px;
}


/* =========================
   LOGIN MESSAGE
========================= */

.login-message {
  background: #F5F8FA;

  border: 1px solid #E1E8ED;

  padding: 15px;

  border-radius: 12px;

  color: #657786;

  margin-bottom: 20px;
}


/* =========================
   NO COMMENTS
========================= */

.no-comments {
  text-align: center;

  color: #657786;

  padding: 25px;
}


/* =========================
   COMMENT
========================= */

.comment {
  padding: 18px;

  margin-top: 12px;

  background: #F5F8FA;

  border-radius: 12px;

  border-left: 4px solid #1DA1F2;
}


.comment-author {
  font-weight: bold;

  color: #1677B8;

  margin: 0 0 7px;
}


.comment-text {
  color: #14171A;

  margin: 0;

  line-height: 1.6;
}


/* =========================
   LOADING
========================= */

.message {
  max-width: 900px;

  margin: 40px auto;

  padding: 40px;

  text-align: center;

  background: #FFFFFF;

  border: 1px solid #E1E8ED;

  border-radius: 15px;

  color: #1DA1F2;
}


/* ERROR */

.error {
  color: #E0245E;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

  .details-container {
    padding: 25px 15px 50px;
  }

  .blog-details {
    padding: 25px;
  }

  .comments-section {
    padding: 25px;
  }

  .blog-details h1 {
    font-size: 29px;
  }

  .content {
    font-size: 16px;
    line-height: 1.7;
  }

  .blog-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .edit-button,
  .delete-button,
  .back-button {
    text-align: center;
  }

}
</style>