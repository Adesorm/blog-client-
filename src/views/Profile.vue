<template>

  <div class="profile-page">

    <div class="profile-card">

      <!-- =========================
           PROFILE HEADER
      ========================== -->

      <div class="profile-icon">
        🐾
      </div>

      <h1>
        My Profile
      </h1>

      <p class="subtitle">
        Welcome to Ace Paw & Pages!
      </p>


      <!-- =========================
           PERSONAL INFORMATION
      ========================== -->

      <div class="section-title">
        Personal Information
      </div>


      <!-- NAME -->

      <div class="info-row">

        <div class="info-icon">
          👤
        </div>

        <div class="info-content">

          <span class="info-label">
            Full Name
          </span>

          <span class="info-value">
            {{ user.firstName }}
            {{ user.middleName }}
            {{ user.lastName }}
          </span>

        </div>

      </div>


      <!-- ADDRESS -->

      <div class="info-row">

        <div class="info-icon">
          🏠
        </div>

        <div class="info-content">

          <span class="info-label">
            Address
          </span>

          <span class="info-value">
            {{ user.address }}
          </span>

        </div>

      </div>


      <!-- AGE -->

      <div class="info-row">

        <div class="info-icon">
          🎂
        </div>

        <div class="info-content">

          <span class="info-label">
            Age
          </span>

          <span class="info-value">
            {{ user.age }} years old
          </span>

        </div>

      </div>


      <!-- =========================
           PET INFORMATION
      ========================== -->

      <div class="section-title">
        Pet Information
      </div>


      <!-- PET SPECIES -->

      <div class="info-row">

        <div class="info-icon">
          🐾
        </div>

        <div class="info-content">

          <span class="info-label">
            Pet Species
          </span>

          <span class="info-value">
            {{ user.petSpecies }}
          </span>

        </div>

      </div>


      <!-- =========================
           ACCOUNT INFORMATION
      ========================== -->

      <div class="section-title">
        Account Information
      </div>


      <!-- EMAIL -->

      <div class="info-row">

        <div class="info-icon">
          📧
        </div>

        <div class="info-content">

          <span class="info-label">
            Email
          </span>

          <span class="info-value">
            {{ user.email }}
          </span>

        </div>

      </div>


      <!-- ACCOUNT TYPE -->

      <div class="info-row">

        <div class="info-icon">
          👤
        </div>

        <div class="info-content">

          <span class="info-label">
            Account Type
          </span>

          <span class="info-value">

            {{
              user.isAdmin
                ? 'Administrator'
                : 'Pet Lover'
            }}

          </span>

        </div>

      </div>


      <!-- MEMBER SINCE -->

      <div class="info-row">

        <div class="info-icon">
          📅
        </div>

        <div class="info-content">

          <span class="info-label">
            Member Since
          </span>

          <span class="info-value">
            {{ formatDate(user.createdAt) }}
          </span>

        </div>

      </div>


      <!-- =========================
           MESSAGE
      ========================== -->

      <div class="profile-message">

        🐾 Thank you for being part of our
        pet-loving community! 🐶

      </div>


      <!-- =========================
           BACK BUTTON
      ========================== -->

      <router-link
        to="/"
        class="back-button"
      >
        ← Back to Home
      </router-link>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'

import API_URL from '../api'


const router = useRouter()


/* =========================
   USER DATA
========================= */

const user = ref({

  firstName: '',

  middleName: '',

  lastName: '',

  address: '',

  age: '',

  petSpecies: '',

  email: '',

  isAdmin: false,

  createdAt: ''

})


/* =========================
   FORMAT DATE
========================= */

const formatDate = (date) => {

  if (!date) {
    return 'N/A'
  }

  return new Date(date).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  )

}


/* =========================
   GET PROFILE
========================= */

const getProfile = async () => {

  const token =
    localStorage.getItem('access')


  /* =========================
     NOT LOGGED IN
  ========================== */

  if (!token) {

    router.push('/login')

    return

  }


  try {

    const response =
      await fetch(
        `${API_URL}/users/profile`,
        {
          method: 'GET',

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }
      )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Failed to load profile'
      )

    }


    /*
      Depending on your backend,
      the user may be returned as:

      data.user

      or directly as:

      data
    */

    user.value =
      data.user || data


  } catch (error) {

    console.error(
      'GET PROFILE ERROR:',
      error
    )


    /*
      If token is invalid,
      send user back to login.
    */

    if (
      error.message
        .toLowerCase()
        .includes('token')
    ) {

      localStorage.removeItem('access')

      router.push('/login')

    }

  }

}


/* =========================
   START
========================= */

onMounted(() => {

  getProfile()

})

</script>


<style scoped>

/* =========================
   PAGE
========================= */

.profile-page {

  min-height:
    calc(100vh - 75px);

  padding:
    50px 20px;

  box-sizing:
    border-box;

  background:
    #F5F8FA;

}


/* =========================
   CARD
========================= */

.profile-card {

  width:
    100%;

  max-width:
    700px;

  margin:
    0 auto;

  padding:
    40px;

  box-sizing:
    border-box;

  background:
    #FFFFFF;

  border:
    1px solid #E1E8ED;

  border-radius:
    18px;

  box-shadow:
    0 8px 25px
    rgba(
      20,
      23,
      26,
      0.08
    );

}


/* =========================
   PROFILE ICON
========================= */

.profile-icon {

  width:
    75px;

  height:
    75px;

  margin:
    0 auto 15px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  background:
    #F5F8FA;

  border:
    2px solid #E1E8ED;

  border-radius:
    50%;

  font-size:
    32px;

}


/* =========================
   TITLE
========================= */

.profile-card h1 {

  margin:
    0 0 8px;

  text-align:
    center;

  color:
    #14171A;

  font-size:
    32px;

}


/* =========================
   SUBTITLE
========================= */

.subtitle {

  margin:
    0 0 30px;

  text-align:
    center;

  color:
    #657786;

  font-size:
    14px;

}


/* =========================
   SECTION TITLE
========================= */

.section-title {

  margin:
    25px 0 12px;

  padding-bottom:
    8px;

  border-bottom:
    1px solid #E1E8ED;

  color:
    #14171A;

  font-size:
    16px;

  font-weight:
    700;

}


/* =========================
   INFORMATION ROW
========================= */

.info-row {

  display:
    flex;

  align-items:
    center;

  gap:
    14px;

  margin-bottom:
    10px;

  padding:
    15px;

  background:
    #F5F8FA;

  border:
    1px solid #E1E8ED;

  border-radius:
    12px;

}


/* =========================
   INFO ICON
========================= */

.info-icon {

  width:
    40px;

  height:
    40px;

  flex-shrink:
    0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  background:
    #FFFFFF;

  border-radius:
    50%;

  font-size:
    18px;

}


/* =========================
   INFO CONTENT
========================= */

.info-content {

  display:
    flex;

  flex-direction:
    column;

  gap:
    3px;

  min-width:
    0;

}


/* =========================
   LABEL
========================= */

.info-label {

  color:
    #657786;

  font-size:
    12px;

}


/* =========================
   VALUE
========================= */

.info-value {

  color:
    #14171A;

  font-size:
    15px;

  font-weight:
    500;

  word-break:
    break-word;

}


/* =========================
   MESSAGE
========================= */

.profile-message {

  margin-top:
    25px;

  padding:
    14px;

  text-align:
    center;

  background:
    #E8F5FE;

  border:
    1px solid #BFE3F7;

  border-radius:
    12px;

  color:
    #1677B8;

  font-size:
    14px;

}


/* =========================
   BACK BUTTON
========================= */

.back-button {

  display:
    block;

  width:
    fit-content;

  margin:
    25px auto 0;

  padding:
    10px 20px;

  background:
    #1DA1F2;

  color:
    #FFFFFF;

  border-radius:
    20px;

  text-decoration:
    none;

  font-size:
    14px;

  font-weight:
    600;

  transition:
    0.2s;

}


.back-button:hover {

  background:
    #1677B8;

}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

  .profile-page {

    padding:
      30px 15px;

  }


  .profile-card {

    padding:
      30px 20px;

  }


  .profile-card h1 {

    font-size:
      28px;

  }


  .info-row {

    padding:
      13px;

  }

}

</style>