<template>

  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">

        <div class="cs-card p-4">

          <h3 class="mb-4">
            Xác thực Email
          </h3>

          <div v-if="message" class="alert alert-success">
            {{ message }}
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <form @submit.prevent="verify">

            <div class="mb-3">

              <label>Email</label>

              <input v-model="email" class="form-control" type="email" required>

            </div>

            <div class="mb-3">

              <label>Mã OTP</label>

              <input v-model="otp" class="form-control" maxlength="6" required>

            </div>

            <button class="btn btn-primary w-100">

              Xác thực

            </button>

          </form>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { authApi } from "../api"

const router = useRouter()

const route = useRoute()

const email = ref(route.query.email || "")


const otp = ref("")

const error = ref("")
const message = ref("")

async function verify() {

  error.value = ""
  message.value = ""

  try {

    const { data } = await authApi.verifyEmail(
      email.value,
      otp.value
    )
    if (data.success) {

      message.value = "Xác thực thành công"

      setTimeout(() => {

        router.push("/login")

      }, 1500)

    } else {

      error.value = data.message

    }

  } catch (e) {

    console.log(e)

    console.log(e.response)

    console.log(e.response?.data)

    error.value =
      e.response?.data?.message ||
      "Có lỗi xảy ra"

  }
}

</script>