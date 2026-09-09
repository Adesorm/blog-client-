<template>
  <div class="create-page">
    <div class="create-card">
      <h1>Create a New Blog</h1>
      <p class="subtitle">Share your thoughts with the community.</p>

      <form @submit.prevent="createBlog">
        <div class="form-group">
          <label for="title">Title</label>

          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Enter your blog title"
            required
          />
        </div>

        <div class="form-group">
          <label for="content">Content</label>

          <textarea
            id="content"
            v-model="content"
            rows="10"
            placeholder="Write your blog here..."
            required
          ></textarea>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Publishing...' : 'Publish Blog' }}
        </button>
      </form>

      <p v-if="message" class="message">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import API_URL from '../api'

const router = useRouter()

const title = ref('')
const content = ref('')
const message = ref('')
const loading = ref(false)

const createBlog = async () => {
  message.value = ''
  loading.value = true

  const token = localStorage.getItem('access')

  if (!token) {
    message.value = 'Please login first.'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },

      body: JSON.stringify({
        title: title.value,
        content: content.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create blog')
    }

    message.value = 'Blog created successfully!'

    title.value = ''
    content.value = ''

    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

/* =========================
   PAGE
========================= */

.create-page {
  min-height: calc(100vh - 70px);

  background: #F5F8FA;

  padding: 50px 20px;
}


/* =========================
   CARD
========================= */

.create-card {
  width: 90%;

  max-width: 750px;

  margin: 0 auto;

  background: #FFFFFF;

  padding: 40px;

  border-radius: 12px;

  border: 1px solid #E1E8ED;

  box-shadow:
    0 5px 20px
    rgba(20, 23, 26, 0.08);
}


/* =========================
   TITLE
========================= */

.create-card h1 {
  text-align: center;

  color: #14171A;

  margin-bottom: 8px;
}


/* =========================
   SUBTITLE
========================= */

.subtitle {
  text-align: center;

  color: #657786;

  margin-bottom: 35px;
}


/* =========================
   FORM
========================= */

.form-group {
  margin-bottom: 25px;
}


.form-group label {
  display: block;

  font-weight: 600;

  margin-bottom: 8px;

  color: #38444D;
}


/* =========================
   INPUTS
========================= */

.form-group input,
.form-group textarea {
  width: 100%;

  box-sizing: border-box;

  padding: 13px;

  border: 1px solid #E1E8ED;

  border-radius: 7px;

  font-size: 15px;

  font-family: inherit;

  background: #FFFFFF;

  color: #14171A;
}


.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #AAB8C2;
}


.form-group textarea {
  resize: vertical;
}


/* =========================
   INPUT FOCUS
========================= */

.form-group input:focus,
.form-group textarea:focus {
  outline: none;

  border-color: #1DA1F2;

  box-shadow:
    0 0 0 3px
    rgba(29, 161, 242, 0.12);
}


/* =========================
   BUTTON
========================= */

button {
  width: 100%;

  padding: 13px;

  border: none;

  border-radius: 7px;

  background: #1DA1F2;

  color: #FFFFFF;

  font-size: 16px;

  cursor: pointer;

  transition: 0.2s;
}


button:hover {
  background: #1677B8;
}


button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* =========================
   MESSAGE
========================= */

.message {
  text-align: center;

  margin-top: 20px;

  color: #17BF63;
}

</style>