<template>
  <div class="home">

    <!-- =========================
         LOGGED OUT LANDING PAGE
    ========================== -->

    <section
      v-if="!isLoggedIn"
      class="welcome-section"
    >

      <div class="welcome-card">

        <!-- PAW ICON -->

        <div class="welcome-paw">
          🐾
        </div>


        <!-- TITLE -->

        <h1>
          Welcome to Ace Paw & Pages
        </h1>


        <p class="welcome-subtitle">
          Stories, experiences, and moments worth sharing.
        </p>


        <!-- WEBSITE SUMMARY -->

        <div class="website-summary">

          <h2>
            About Ace Paw & Pages
          </h2>

          <p>
            Ace Paw & Pages is a community blog where pet lovers
            can share stories, experiences, and meaningful moments
            with their pets.
          </p>

          <p>
            Whether it's a rescue story, responsible pet ownership,
            or the special bond between people and animals, this
            platform gives everyone a place to connect, express
            themselves, and celebrate the joy that pets bring to
            our lives.
          </p>

        </div>


        <!-- LOGIN / REGISTER -->

        <p class="join-text">
          Join our community and start sharing your own pet stories.
        </p>


        <div class="auth-buttons">

          <router-link
            to="/login"
            class="login-button"
          >
            Log In
          </router-link>


          <router-link
            to="/register"
            class="register-button"
          >
            Register
          </router-link>

        </div>

      </div>

    </section>


    <!-- =========================
         LOGGED IN HOME PAGE
    ========================== -->

    <template v-else>

      <!-- =========================
           HERO
      ========================== -->

      <section class="hero">

        <div class="hero-content">

          <div class="paw-mark">
            🐾
          </div>

          <h1>
            Ace Paw & Pages
          </h1>

          <p>
            Stories, experiences, and moments worth sharing.
          </p>

        </div>

      </section>


      <!-- =========================
           BLOG SECTION
      ========================== -->

      <section class="blogs-section">

        <div class="section-heading">

          <div class="heading-line"></div>

          <div class="heading-content">

            <span class="small-paw">
              🐾
            </span>

            <h2>
               Blogs
            </h2>

            <p>
              Explore stories from our community.
            </p>

          </div>

          <div class="heading-line"></div>

        </div>


        <!-- =========================
             LOADING
        ========================== -->

        <p
          v-if="loading"
          class="message"
        >
          Loading blogs...
        </p>


        <!-- =========================
             ERROR
        ========================== -->

        <p
          v-else-if="error"
          class="error"
        >
          {{ error }}
        </p>


        <!-- =========================
             EMPTY
        ========================== -->

        <div
          v-else-if="blogs.length === 0"
          class="empty"
        >

          <div class="empty-paw">
            🐾
          </div>

          <h3>
            No blogs yet
          </h3>

          <p>
            There are no stories to display at the moment.
          </p>

        </div>


        <!-- =========================
             BLOG GRID
        ========================== -->

        <div
          v-else
          class="blog-grid"
        >

          <article
            v-for="(blog, index) in blogs"
            :key="blog._id"
            class="blog-card"
          >

            <!-- CARD HEADER -->

            <div class="card-header">

              <div class="card-paw">
                {{ getPetIcon(index) }}
              </div>

              <span class="card-label">
                STORY
              </span>

            </div>


            <!-- CARD BODY -->

            <div class="card-body">

              <h3>
                {{ blog.title }}
              </h3>

              <p class="blog-content">

                {{ getPreview(blog.content) }}

                <span
                  v-if="
                    blog.content &&
                    blog.content.length > 180
                  "
                >
                  ...
                </span>

              </p>

            </div>


            <!-- CARD FOOTER -->

            <div class="card-footer">

              <p class="author">

                <span>🐾</span>

                {{ blog.author?.email || 'Unknown author' }}

              </p>


              <!-- SEE MORE -->

              <router-link
                v-if="blog._id"
                :to="{
                  name: 'blog-details',
                  params: {
                    id: blog._id
                  }
                }"
                class="read-more"
              >
                See More
              </router-link>


              <span
                v-else
                class="missing-id"
              >
                Unavailable
              </span>

            </div>

          </article>

        </div>

      </section>


      <!-- =========================
           FOOTER MESSAGE
      ========================== -->

      <section class="footer-message">

        <span class="footer-paw">
          🐾
        </span>

        <p>
          Every story has a place here.
        </p>

      </section>

    </template>

  </div>
</template>


<script setup>

import {
  ref,
  onMounted
} from 'vue'

import API_URL from '../api'


/* =========================
   LOGIN STATUS
========================= */

const isLoggedIn = ref(false)


const checkLogin = () => {

  isLoggedIn.value =
    !!localStorage.getItem('access')

}


/* =========================
   DATA
========================= */

const blogs = ref([])

const loading = ref(true)

const error = ref('')


/* =========================
   BLOG PREVIEW
========================= */

const getPreview = (content) => {

  if (!content) {
    return ''
  }

  if (content.length <= 180) {
    return content
  }

  return content.substring(0, 180)

}


/* =========================
   PET ICON
========================= */

const getPetIcon = (index) => {

  const icons = [
    '🐾',
    '🐶',
    '🐱',
    '🐾',
    '🐕',
    '🐾'
  ]

  return icons[index % icons.length]

}


/* =========================
   GET BLOGS
========================= */

const getBlogs = async () => {

  try {

    const response = await fetch(
      `${API_URL}/blogs`
    )


    const data = await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Failed to load blogs'
      )

    }


    blogs.value =
      data.blogs || []


    /* =========================
       DEBUG
    ========================= */

    console.log(
      'BLOG API RESPONSE:',
      data
    )

    console.log(
      'BLOGS:',
      blogs.value
    )

    console.log(
      'FIRST BLOG ID:',
      blogs.value[0]?._id
    )


  } catch (err) {

    console.error(
      'GET BLOGS ERROR:',
      err
    )

    error.value =
      err.message

  } finally {

    loading.value = false

  }

}


/* =========================
   START
========================= */

onMounted(() => {

  checkLogin()

  if (isLoggedIn.value) {

    getBlogs()

  } else {

    loading.value = false

  }

})

</script>


<style scoped>

/* =========================
   GLOBAL HOME
========================= */

.home {

  min-height: 100vh;

  background: #F5F8FA;

  color: #14171A;

  padding-bottom: 60px;

}


/* ==================================================
   LOGGED OUT LANDING PAGE
================================================== */

.welcome-section {

  min-height: calc(100vh - 75px);

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 45px 20px;

  box-sizing: border-box;

  background: #F5F8FA;

}


.welcome-card {

  width: 100%;

  max-width: 700px;

  padding: 45px;

  box-sizing: border-box;

  text-align: center;

  background: #FFFFFF;

  border: 1px solid #E1E8ED;

  border-radius: 20px;

  box-shadow:
    0 8px 25px
    rgba(20, 23, 26, 0.08);

}


/* =========================
   WELCOME PAW
========================= */

.welcome-paw {

  width: 70px;

  height: 70px;

  margin:
    0 auto 20px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #E8F5FE;

  border:
    1px solid #BFE3F7;

  border-radius: 50%;

  font-size: 30px;

  box-shadow:
    0 4px 12px
    rgba(20, 23, 26, 0.08);

}


/* =========================
   WELCOME TITLE
========================= */

.welcome-card h1 {

  margin:
    0 0 10px;

  font-size: 34px;

  font-weight: 600;

  color: #14171A;

}


.welcome-subtitle {

  margin:
    0 0 30px;

  color: #657786;

  font-size: 16px;

  line-height: 1.6;

}


/* =========================
   WEBSITE SUMMARY
========================= */

.website-summary {

  max-width: 580px;

  margin:
    0 auto 25px;

  padding: 25px;

  box-sizing: border-box;

  background: #F5F8FA;

  border:
    1px solid #E1E8ED;

  border-radius: 15px;

  text-align: left;

}


.website-summary h2 {

  margin:
    0 0 12px;

  text-align: center;

  font-size: 21px;

  color: #14171A;

}


.website-summary p {

  margin:
    0 0 12px;

  color: #536471;

  font-size: 14px;

  line-height: 1.7;

}


.website-summary p:last-child {

  margin-bottom: 0;

}


/* =========================
   JOIN TEXT
========================= */

.join-text {

  margin:
    0 auto 20px;

  color: #536471;

  font-size: 14px;

  line-height: 1.6;

}


/* =========================
   AUTH BUTTONS
========================= */

.auth-buttons {

  display: flex;

  justify-content: center;

  gap: 12px;

}


/* =========================
   LOGIN
========================= */

.login-button {

  display: inline-block;

  padding:
    11px 28px;

  background: #1DA1F2;

  color: #FFFFFF;

  border-radius: 20px;

  text-decoration: none;

  font-size: 14px;

  font-weight: bold;

  transition:
    background 0.2s ease,
    transform 0.2s ease;

}


.login-button:hover {

  background: #1677B8;

  transform:
    translateY(-2px);

}


/* =========================
   REGISTER
========================= */

.register-button {

  display: inline-block;

  padding:
    11px 28px;

  background: #FFFFFF;

  color: #1DA1F2;

  border:
    2px solid #1DA1F2;

  border-radius: 20px;

  text-decoration: none;

  font-size: 14px;

  font-weight: bold;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

}


.register-button:hover {

  background: #E8F5FE;

  color: #1677B8;

  border-color: #1677B8;

  transform:
    translateY(-2px);

}


/* ==================================================
   LOGGED IN HERO
================================================== */

.hero {

  width: 100%;

  padding:
    55px 20px
    60px;

  box-sizing: border-box;

  background: #E8F5FE;

  border-bottom:
    1px solid #E1E8ED;

  text-align: center;

}


.hero-content {

  max-width: 800px;

  margin: 0 auto;

}


/* =========================
   PAW MARK
========================= */

.paw-mark {

  width: 68px;

  height: 68px;

  margin:
    0 auto 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #FFFFFF;

  border:
    1px solid #E1E8ED;

  border-radius: 50%;

  font-size: 30px;

  box-shadow:
    0 4px 12px
    rgba(20, 23, 26, 0.08);

}


/* =========================
   HERO TITLE
========================= */

.hero h1 {

  margin: 0 0 10px;

  font-size: 38px;

  font-weight: 600;

  letter-spacing: -0.5px;

  color: #14171A;

}


.hero p {

  margin: 0;

  font-size: 16px;

  color: #657786;

  line-height: 1.6;

}


/* ==================================================
   BLOG SECTION
================================================== */

.blogs-section {

  width: 90%;

  max-width: 1100px;

  margin:
    55px auto 0;

}


/* =========================
   SECTION HEADING
========================= */

.section-heading {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 20px;

  margin-bottom: 35px;

}


.heading-line {

  height: 1px;

  width: 100px;

  background: #E1E8ED;

}


.heading-content {

  text-align: center;

}


.small-paw {

  display: block;

  margin-bottom: 5px;

  font-size: 17px;

}


.heading-content h2 {

  margin: 0;

  font-size: 28px;

  font-weight: 600;

  color: #14171A;

}


.heading-content p {

  margin:
    6px 0 0;

  font-size: 13px;

  color: #657786;

}


/* =========================
   BLOG GRID
========================= */

.blog-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 24px;

}


/* =========================
   BLOG CARD
========================= */

.blog-card {

  height: 390px;

  box-sizing: border-box;

  padding: 24px;

  display: flex;

  flex-direction: column;

  background: #FFFFFF;

  border:
    1px solid #E1E8ED;

  border-radius: 14px;

  box-shadow:
    0 5px 16px
    rgba(20, 23, 26, 0.06);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

}


.blog-card:hover {

  transform:
    translateY(-4px);

  box-shadow:
    0 9px 22px
    rgba(20, 23, 26, 0.10);

}


/* =========================
   CARD HEADER
========================= */

.card-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 18px;

}


/* =========================
   CARD PAW
========================= */

.card-paw {

  width: 45px;

  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #F5F8FA;

  border:
    1px solid #E1E8ED;

  border-radius: 50%;

  font-size: 21px;

}


/* =========================
   CARD LABEL
========================= */

.card-label {

  font-size: 10px;

  letter-spacing: 1.5px;

  color: #657786;

}


/* =========================
   CARD BODY
========================= */

.card-body {

  flex: 1;

  overflow: hidden;

}


.blog-card h3 {

  margin:
    0 0 14px;

  font-size: 21px;

  font-weight: 600;

  line-height: 1.4;

  color: #14171A;

  display:
    -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  overflow: hidden;

}


.blog-content {

  margin: 0;

  font-size: 15px;

  line-height: 1.7;

  color: #536471;

}


/* =========================
   CARD FOOTER
========================= */

.card-footer {

  margin-top: 18px;

  padding-top: 16px;

  border-top:
    1px solid #E1E8ED;

}


/* =========================
   AUTHOR
========================= */

.author {

  margin:
    0 0 13px;

  font-size: 12px;

  color: #657786;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

}


.author span {

  margin-right: 4px;

}


/* =========================
   SEE MORE
========================= */

.read-more {

  display: inline-block;

  padding:
    9px 17px;

  background: #1DA1F2;

  color: #FFFFFF;

  border-radius: 18px;

  text-decoration: none;

  font-size: 13px;

  font-weight: 500;

  transition:
    background 0.2s ease,
    transform 0.2s ease;

}


.read-more:hover {

  background: #1677B8;

  transform:
    translateY(-1px);

}


/* =========================
   MISSING ID
========================= */

.missing-id {

  font-size: 12px;

  color: #E0245E;

}


/* =========================
   LOADING
========================= */

.message {

  text-align: center;

  padding: 40px;

  color: #657786;

}


/* =========================
   ERROR
========================= */

.error {

  text-align: center;

  padding: 30px;

  color: #E0245E;

}


/* =========================
   EMPTY
========================= */

.empty {

  max-width: 500px;

  margin: 0 auto;

  padding: 45px;

  text-align: center;

  background: #FFFFFF;

  border:
    1px solid #E1E8ED;

  border-radius: 14px;

}


.empty-paw {

  font-size: 40px;

  margin-bottom: 10px;

}


.empty h3 {

  margin:
    0 0 8px;

  font-size: 20px;

  font-weight: 600;

  color: #14171A;

}


.empty p {

  margin: 0;

  color: #657786;

  font-size: 14px;

}


/* =========================
   FOOTER MESSAGE
========================= */

.footer-message {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  margin:
    55px auto 0;

  color: #657786;

  font-size: 13px;

}


.footer-paw {

  font-size: 16px;

}


/* =========================
   TABLET
========================= */

@media (max-width: 900px) {

  .blog-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

  .welcome-section {

    padding:
      30px 15px;

  }


  .welcome-card {

    padding:
      35px 25px;

  }


  .welcome-card h1 {

    font-size: 28px;

  }


  .welcome-subtitle {

    font-size: 14px;

  }


  .website-summary {

    padding: 20px;

  }


  .website-summary h2 {

    font-size: 19px;

  }


  .auth-buttons {

    flex-direction: column;

  }


  .login-button,
  .register-button {

    width: 100%;

    box-sizing: border-box;

  }


  .hero {

    padding:
      45px 20px
      50px;

  }


  .hero h1 {

    font-size: 30px;

  }


  .hero p {

    font-size: 14px;

  }


  .blogs-section {

    width: 90%;

    margin-top: 40px;

  }


  .blog-grid {

    grid-template-columns:
      1fr;

  }


  .blog-card {

    height: 390px;

  }


  .section-heading {

    gap: 10px;

  }


  .heading-line {

    width: 45px;

  }


  .heading-content h2 {

    font-size: 25px;

  }

}

</style>