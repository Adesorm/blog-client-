<template>
  <div class="auth-page">

    <div class="auth-card">

      <!-- PET ICON -->
      <div class="pet-icon">
        🐾
      </div>


      <!-- HEADER -->
      <h1>Create an Account</h1>

      <p class="subtitle">
        Join the Ace Paw & Pages community
      </p>


      <!-- REGISTER FORM -->
      <form @submit.prevent="registerUser">


        <!-- NAME -->
        <div class="form-row">

          <div class="form-group">

            <label>
              🧑 First Name
            </label>

            <input
              v-model="firstName"
              type="text"
              placeholder="First name"
              required
            />

          </div>


          <div class="form-group">

            <label>
              🧑 Middle Name
            </label>

            <input
              v-model="middleName"
              type="text"
              placeholder="Middle name"
            />

          </div>

        </div>


        <!-- LAST NAME + AGE -->
        <div class="form-row">

          <div class="form-group">

            <label>
              🧑 Last Name
            </label>

            <input
              v-model="lastName"
              type="text"
              placeholder="Last name"
              required
            />

          </div>


          <div class="form-group age-group">

            <label>
              🎂 Age
            </label>

            <input
              v-model="age"
              type="number"
              min="1"
              placeholder="Age"
              required
            />

          </div>

        </div>


        <!-- ADDRESS -->
        <div class="form-group">

          <label>
            🏠 Address
          </label>

          <input
            v-model="address"
            type="text"
            placeholder="Enter your address"
            required
          />

        </div>


        <!-- PET SPECIES -->
        <div class="form-group">

          <label>
            🐾 What type of pet do you have?
          </label>

          <select
            v-model="petSpecies"
            required
          >

            <option
              value=""
              disabled
            >
              Select pet species
            </option>

            <option value="Dog">
              🐶 Dog
            </option>

            <option value="Cat">
              🐱 Cat
            </option>

            <option value="Bird">
              🐦 Bird
            </option>

            <option value="Rabbit">
              🐰 Rabbit
            </option>

            <option value="Fish">
              🐠 Fish
            </option>

            <option value="Hamster">
              🐹 Hamster
            </option>

            <option value="Other">
              🐾 Other
            </option>

          </select>

        </div>


        <!-- EMAIL -->
        <div class="form-group">

          <label>
            📧 Email
          </label>

          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
          />

        </div>


        <!-- PASSWORD -->
        <div class="form-group">

          <label>
            🔒 Password
          </label>

          <input
            v-model="password"
            type="password"
            placeholder="Create a password"
            required
          />

        </div>


        <!-- REGISTER BUTTON -->
        <button
          type="submit"
          :disabled="loading"
        >

          {{
            loading
              ? '🐾 Creating Account...'
              : 'Create Account 🐾'
          }}

        </button>

      </form>


      <!-- MESSAGE -->
      <p
        v-if="message"
        class="message"
      >
        {{ message }}
      </p>


      <!-- LOGIN -->
      <p class="bottom-text">

        Already have an account?

        <router-link to="/login">
          Log in here
        </router-link>

      </p>

    </div>

  </div>
</template>


<script setup>

import { ref } from 'vue'

import { useRouter } from 'vue-router'

import API_URL from '../api'


const router = useRouter()


/* =========================
   FORM DATA
========================= */

const firstName = ref('')

const middleName = ref('')

const lastName = ref('')

const address = ref('')

const age = ref('')

const petSpecies = ref('')

const email = ref('')

const password = ref('')


const message = ref('')

const loading = ref(false)


/* =========================
   REGISTER USER
========================= */

const registerUser = async () => {

  message.value = ''

  loading.value = true


  try {

    const response =
      await fetch(
        `${API_URL}/users/register`,
        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json'

          },

          body: JSON.stringify({

            firstName:
              firstName.value,

            middleName:
              middleName.value,

            lastName:
              lastName.value,

            address:
              address.value,

            age:
              age.value,

            petSpecies:
              petSpecies.value,

            email:
              email.value,

            password:
              password.value

          })

        }
      )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Registration failed'
      )

    }


    message.value =
      '🐾 ' +
      (
        data.message ||
        'Account created successfully!'
      )


    /* CLEAR FORM */

    firstName.value = ''

    middleName.value = ''

    lastName.value = ''

    address.value = ''

    age.value = ''

    petSpecies.value = ''

    email.value = ''

    password.value = ''


    /* GO TO LOGIN */

    setTimeout(() => {

      router.push('/login')

    }, 1500)


  } catch (error) {

    message.value =
      error.message

  } finally {

    loading.value = false

  }

}

</script>


<style scoped>

/* =========================
   PAGE
========================= */

.auth-page {

  min-height: calc(100vh - 75px);

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 40px 20px;

  box-sizing: border-box;

  background: #F5F8FA;

}


/* =========================
   CARD
========================= */

.auth-card {

  width: 100%;

  max-width: 650px;

  padding: 40px;

  box-sizing: border-box;

  background: #FFFFFF;

  border:
    2px solid #E1E8ED;

  border-radius: 24px;

  box-shadow:
    0 10px 30px
    rgba(
      20,
      23,
      26,
      0.08
    );

}


/* =========================
   PET ICON
========================= */

.pet-icon {

  width: 75px;

  height: 75px;

  margin:
    0 auto 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #F5F8FA;

  border:
    3px solid #E1E8ED;

  border-radius: 50%;

  font-size: 34px;

}


/* =========================
   TITLE
========================= */

.auth-card h1 {

  text-align: center;

  margin:
    0 0 8px;

  color: #14171A;

  font-size: 32px;

}


/* =========================
   SUBTITLE
========================= */

.subtitle {

  text-align: center;

  color: #657786;

  margin:
    0 0 30px;

  line-height: 1.5;

}


/* =========================
   FORM ROW
========================= */

.form-row {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 15px;

}


/* =========================
   FORM
========================= */

.form-group {

  margin-bottom: 18px;

}


.form-group label {

  display: block;

  margin-bottom: 8px;

  color: #38444D;

  font-weight: 600;

  font-size: 14px;

}


.form-group input,
.form-group select {

  width: 100%;

  box-sizing: border-box;

  padding: 13px 14px;

  border:
    2px solid #E1E8ED;

  border-radius: 12px;

  font-size: 15px;

  background: #FFFFFF;

  color: #14171A;

  transition: 0.2s;

}


.form-group input::placeholder {

  color: #AAB8C2;

}


.form-group input:focus,
.form-group select:focus {

  outline: none;

  border-color: #1DA1F2;

  background: #FFFFFF;

  box-shadow:
    0 0 0 3px
    rgba(
      29,
      161,
      242,
      0.12
    );

}


.form-group select {

  cursor: pointer;

}


/* =========================
   REGISTER BUTTON
========================= */

button {

  width: 100%;

  padding: 13px;

  margin-top: 5px;

  border: none;

  border-radius: 22px;

  background: #1DA1F2;

  color: #FFFFFF;

  font-size: 16px;

  font-weight: bold;

  cursor: pointer;

  transition: 0.2s;

}


button:hover {

  background: #1677B8;

  transform:
    translateY(-2px);

}


button:disabled {

  opacity: 0.6;

  cursor: not-allowed;

  transform: none;

}


/* =========================
   MESSAGE
========================= */

.message {

  margin-top: 18px;

  padding: 12px;

  text-align: center;

  border-radius: 10px;

  background: #E8F5FE;

  border:
    1px solid #BFE3F7;

  color: #1677B8;

  font-size: 14px;

}


/* =========================
   LOGIN LINK
========================= */

.bottom-text {

  margin-top: 25px;

  text-align: center;

  color: #657786;

  font-size: 14px;

}


.bottom-text a {

  color: #1DA1F2;

  font-weight: bold;

  text-decoration: none;

}


.bottom-text a:hover {

  color: #1677B8;

  text-decoration: underline;

}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

  .auth-page {

    padding:
      30px 15px;

  }


  .auth-card {

    padding:
      30px 25px;

  }


  .auth-card h1 {

    font-size: 28px;

  }


  .form-row {

    grid-template-columns: 1fr;

    gap: 0;

  }

}

</style>