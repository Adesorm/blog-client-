<template>
  <div class="edit-container">

    <div v-if="loading" class="message">
      Loading blog...
    </div>

    <div v-else class="edit-card">
      <h1>Edit Blog</h1>

      <form @submit.prevent="updateBlog">

        <label>Title</label>
        <input
          v-model="title"
          type="text"
          placeholder="Enter blog title"
          required
        />

        <label>Content</label>
        <textarea
          v-model="content"
          rows="10"
          placeholder="Write your blog..."
          required
        ></textarea>

        <button type="submit" :disabled="submitting">
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>

        <p v-if="message" :class="messageType">
          {{ message }}
        </p>
      </form>

      <router-link
        :to="`/blog/${route.params.id}`"
        class="cancel-button"
      >
        Cancel
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import API_URL from '../api'

const route = useRoute()
const router = useRouter()

const title = ref('')
const content = ref('')

const loading = ref(true)
const submitting = ref(false)

const message = ref('')
const messageType = ref('success')

const fetchBlog = async () => {
  try {
    const response = await fetch(
      `${API_URL}/blogs/${route.params.id}`
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load blog')
    }

    title.value = data.blog.title
    content.value = data.blog.content

  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const updateBlog = async () => {
  const token = localStorage.getItem('access')

  if (!token) {
    router.push('/login')
    return
  }

  submitting.value = true
  message.value = ''

  try {
    const response = await fetch(
      `${API_URL}/blogs/${route.params.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.value,
          content: content.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update blog')
    }

    message.value = 'Blog updated successfully!'
    messageType.value = 'success'

    setTimeout(() => {
      router.push(`/blog/${route.params.id}`)
    }, 800)

  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchBlog()
})
</script>

<style scoped>

/* =========================
   PAGE
========================= */

.edit-container {
  width: 100%;

  min-height: calc(100vh - 70px);

  display: flex;

  justify-content: center;

  padding: 50px 20px;

  box-sizing: border-box;

  background: #F5F8FA;
}


/* =========================
   CARD
========================= */

.edit-card {
  width: 100%;

  max-width: 800px;

  background: #FFFFFF;

  padding: 40px;

  border-radius: 12px;

  border: 1px solid #E1E8ED;

  box-shadow:
    0 4px 15px
    rgba(20, 23, 26, 0.08);
}


/* =========================
   TITLE
========================= */

.edit-card h1 {
  margin-top: 0;

  margin-bottom: 30px;

  color: #14171A;
}


/* =========================
   FORM
========================= */

form {
  display: flex;

  flex-direction: column;
}


/* =========================
   LABEL
========================= */

label {
  font-weight: bold;

  margin-bottom: 8px;

  margin-top: 15px;

  color: #38444D;
}


/* =========================
   INPUT / TEXTAREA
========================= */

input,
textarea {
  width: 100%;

  padding: 12px;

  border: 1px solid #E1E8ED;

  border-radius: 6px;

  font-size: 16px;

  box-sizing: border-box;

  background: #FFFFFF;

  color: #14171A;

  transition: 0.2s;
}


input::placeholder,
textarea::placeholder {
  color: #AAB8C2;
}


input:focus,
textarea:focus {
  outline: none;

  border-color: #1DA1F2;

  box-shadow:
    0 0 0 3px
    rgba(29, 161, 242, 0.12);
}


textarea {
  resize: vertical;
}


/* =========================
   SAVE BUTTON
========================= */

button {
  margin-top: 20px;

  padding: 12px;

  background: #1DA1F2;

  color: #FFFFFF;

  border: none;

  border-radius: 6px;

  cursor: pointer;

  font-size: 16px;

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
   CANCEL
========================= */

.cancel-button {
  display: inline-block;

  margin-top: 15px;

  color: #657786;

  text-decoration: none;

  transition: 0.2s;
}


.cancel-button:hover {
  color: #1DA1F2;

  text-decoration: underline;
}


/* =========================
   MESSAGE
========================= */

.message {
  padding: 30px;

  text-align: center;

  color: #657786;
}


/* =========================
   SUCCESS
========================= */

.success {
  color: #17BF63;

  margin-top: 15px;
}


/* =========================
   ERROR
========================= */

.error {
  color: #E0245E;

  margin-top: 15px;
}

</style>