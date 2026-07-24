<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="cs-card p-4">

          <h2 class="cs-page-title mb-4">
            Xác thực Email
          </h2>

          <div v-if="success" class="alert alert-success">
            {{ success }}
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <form class="vstack gap-3" @submit.prevent="submit">

            <div>
              <label class="form-label">Email</label>

              <input
                v-model="email"
                class="form-control"
                readonly
              />
            </div>

            <div>
              <label class="form-label">Mã OTP</label>

              <input
                v-model="otp"
                class="form-control"
                maxlength="6"
                required
              />
            </div>

            <button
              type="submit"
              class="btn cs-btn cs-btn-primary">

              Xác thực

            </button>

          <button
            type="button"
            class="btn btn-outline-primary w-100"
            @click="resendOtp">
            Gửi lại mã OTP
        </button>

          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { authApi } from "../api"

const route = useRoute()
const router = useRouter()

const email = ref(route.query.email || "")
const otp = ref("")

const error = ref("")
const success = ref("")

async function submit() {

    error.value = ""
    success.value = ""

    try{

    const { data } = await authApi.verifyEmail(
        email.value,
        otp.value
    )

    if (data.success) {

success.value = "Xác thực thành công"

setTimeout(() => {
    router.push({
        path: "/login",
        query: {
            verified: 1
        }
    })
}, 1500)

} else {

error.value = data.message

}

    } catch (e) {

    console.error(e)

    if (e.response) {
        console.log("Status:", e.response.status)
        console.log("Data:", e.response.data)
        error.value = e.response.data?.message || "Có lỗi xảy ra"
    } else {
        error.value = e.message
    }


    }

    }

async function resendOtp() {

    error.value = ""
    success.value = ""

    try {

        const { data } = await authApi.resendOtp(email.value)

        if (data.success) {

            success.value = data.message

        } else {

            error.value = data.message

        }

    } catch (e) {

        console.error(e)
        error.value = "Không thể gửi lại mã OTP."

    }

}

</script>