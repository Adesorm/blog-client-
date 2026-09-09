<template>
  <nav class="navbar">

    <div class="nav-container">

      <!-- LOGO -->
      <router-link to="/" class="logo">

        <img
          src="/logo.png"
          alt="Ace Paw & Pages Logo"
        />

        <span>Ace Paw & Pages</span>

      </router-link>


      <!-- NAVIGATION -->
      <div class="nav-links">

        <!-- LOGGED IN -->
        <template v-if="isLoggedIn">

          <router-link to="/">
            Home
          </router-link>


          <router-link to="/create-blog">
            Create Blog
          </router-link>


          <router-link to="/profile">
            Profile
          </router-link>


          <button @click="logout">
            Logout
          </button>

        </template>


        <!-- LOGGED OUT -->
        <template v-else>

          <router-link to="/login">
            Login
          </router-link>


          <router-link to="/register">
            Register
          </router-link>

        </template>

      </div>

    </div>

  </nav>
</template>


<script setup>

import {
  ref,
  onMounted,
  onUnmounted
} from 'vue'

import {
  useRouter,
  useRoute
} from 'vue-router'


const router = useRouter()
const route = useRoute()


const isLoggedIn = ref(false)


/* =========================
   CHECK LOGIN
========================= */

const checkLogin = () => {

  const token =
    localStorage.getItem('access')

  isLoggedIn.value =
    !!token

}


/* =========================
   ROUTE CHANGE
========================= */

const handleRouteChange = () => {

  checkLogin()

}


/* =========================
   AUTH CHANGE
========================= */

const handleAuthChange = () => {

  checkLogin()

}


/* =========================
   LOGOUT
========================= */

const logout = () => {

  localStorage.removeItem('access')

  isLoggedIn.value = false

  window.dispatchEvent(
    new Event('auth-changed')
  )

  router.push('/login')

}


/* =========================
   START
========================= */

onMounted(() => {

  checkLogin()

  router.afterEach(handleRouteChange)

  window.addEventListener(
    'auth-changed',
    handleAuthChange
  )

})


/* =========================
   CLEANUP
========================= */

onUnmounted(() => {

  window.removeEventListener(
    'auth-changed',
    handleAuthChange
  )

})

</script>


<style scoped>

.navbar {

  width: 100%;

  background: #FFFFFF;

  border-bottom: 2px solid #E1E8ED;

  box-shadow:
    0 3px 12px
    rgba(20, 23, 26, 0.06);

}


.nav-container {

  width: 90%;

  max-width: 1200px;

  margin: 0 auto;

  min-height: 75px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

}


/* =========================
   LOGO
========================= */

.logo {

  display: flex;

  align-items: center;

  gap: 10px;

  text-decoration: none;

  color: #14171A;

  font-size: 21px;

  font-weight: bold;

}


.logo img {

  width: 52px;

  height: 52px;

  border-radius: 50%;

  object-fit: cover;

  border: 2px solid #1DA1F2;

}


.logo span {

  white-space: nowrap;

}


/* =========================
   NAVIGATION
========================= */

.nav-links {

  display: flex;

  align-items: center;

  gap: 8px;

}


.nav-links a {

  text-decoration: none;

  color: #657786;

  font-size: 15px;

  padding: 10px 14px;

  border-radius: 20px;

  transition: 0.2s;

}


.nav-links a:hover {

  background: #E8F5FE;

  color: #1677B8;

}


/* =========================
   ACTIVE LINK
========================= */

.nav-links a.router-link-active {

  background: #E8F5FE;

  color: #1677B8;

}


/* =========================
   LOGOUT
========================= */

.nav-links button {

  border: none;

  background: #1DA1F2;

  color: #FFFFFF;

  padding: 10px 17px;

  border-radius: 20px;

  cursor: pointer;

  font-size: 15px;

  font-weight: bold;

  transition: 0.2s;

}


.nav-links button:hover {

  background: #1677B8;

}


/* =========================
   MOBILE
========================= */

@media (max-width: 700px) {

  .nav-container {

    padding: 10px 0;

  }


  .logo {

    font-size: 18px;

  }


  .logo img {

    width: 45px;

    height: 45px;

  }


  .nav-links {

    flex-wrap: wrap;

    justify-content: center;

  }

}

</style>