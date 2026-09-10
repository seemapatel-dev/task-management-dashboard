<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginWithCredentials } from '../stores'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true

  try {
    const result = await loginWithCredentials(
      email.value.trim(),
      password.value
    )

    if (!result.success) {
      error.value = result.message
      return
    }

    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand">
        <div class="brand-mark">✓</div>
        <h1>TaskFlow</h1>
      </div>

      <div class="auth-heading">
        <p class="eyebrow">WELCOME BACK</p>
        <h2>Sign in to your account</h2>
        <p>Manage your tasks, projects and schedule.</p>
      </div>

      <form @submit.prevent="login">
        <label>
          Email
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </label>

        <label>
          Password
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </label>

        <p v-if="error" class="auth-error">
          {{ error }}
        </p>

        <button type="submit" class="primary-btn auth-submit" :disabled="loading" >
          Sign In
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account?
        <button @click="router.push('/register')">
          Create one
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--bg);
}

.auth-card {
  width: min(430px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.auth-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 35px;
}

.auth-brand h1 {
  margin: 0;
  font-size: 21px;
}

.auth-heading {
  margin-bottom: 25px;
}

.auth-heading h2 {
  margin: 5px 0 8px;
  font-size: 26px;
}

.auth-heading p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

input {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid var(--border);
  border-radius: 9px;
  outline: none;
}

input:focus {
  border-color: var(--primary);
}

.auth-submit {
  width: 100%;
  margin-top: 4px;
}

.auth-error {
  margin: 0;
  color: var(--danger);
  font-size: 12px;
}

.auth-footer {
  margin: 22px 0 0;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
}

.auth-footer button {
  border: 0;
  background: transparent;
  color: var(--primary);
  font-weight: 700;
}
</style>