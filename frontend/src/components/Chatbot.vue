<template>
  <div class="chatbot-wrapper">
    <!-- Nút tròn bật/tắt khung chat -->
    <button class="chat-toggle-btn" @click="toggleChat">
      <span v-if="!isOpen">💬 Chat</span>
      <span v-else>✖ Đóng</span>
    </button>

    <!-- Khung chat chính (Chỉ hiện khi isOpen = true) -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>Tư Vấn CarStore</h3>
      </div>

      <!-- Danh sách tin nhắn -->
      <div class="chat-body" ref="chatBody">
        <div v-for="(msg, index) in messages" :key="index" :class="['chat-message', msg.sender]">
          <div class="message-bubble">
            <p v-if="msg.typing" class="typing-indicator" aria-label="Bot đang soạn câu trả lời">
              <span></span><span></span><span></span>
            </p>
            <p v-else>{{ msg.text }}</p>

            <div v-if="!msg.typing && msg.recommendedCars?.length" class="car-cards">
              <button v-for="car in msg.recommendedCars" :key="car.id" type="button" class="car-card-item"
                @click="openCar(car.id)">
                <img :src="car.mainImageUrl || '/images/default-car.jpg'" :alt="car.carName" @error="useDefaultCarImage" />
                <span><strong>{{ car.carName }}</strong><small>{{ car.brandName }}</small><b>{{ formatPrice(car.price) }} VNĐ</b></span>
              </button>
            </div>
            <div v-if="!msg.typing && msg.suggestions?.length" class="quick-replies" aria-label="Gợi ý tư vấn">
              <button v-for="suggestion in msg.suggestions" :key="suggestion" type="button"
                @click="sendMessage(suggestion)">{{ suggestion }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Khung nhập liệu -->
      <div class="chat-footer">
        <input v-model="userMessage" @keyup.enter="sendMessage()" placeholder="Nhập câu hỏi (VD: tìm xe vios)..." />
        <button @click="sendMessage()">Gửi</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/client'
import { formatPrice, useDefaultCarImage } from '../api'

const INITIAL_SUGGESTIONS = [
  'Tư vấn theo tầm giá', 'Tư vấn theo nhu cầu sử dụng', 'Xe 5 chỗ gia đình',
  'Xe 7 chỗ rộng rãi', 'Xem xe mới nhất',
]

const router = useRouter()
const isOpen = ref(false)
const userMessage = ref('')
const chatBody = ref(null)
const messages = ref([
  {
    sender: 'bot',
    text: 'Xin chào! Em là bot tư vấn CarStore. Anh/chị cần tìm xe gì ạ?',
    suggestions: INITIAL_SUGGESTIONS,
  },
])

function toggleChat() {
  isOpen.value = !isOpen.value
  scrollToBottom()
}

async function sendMessage(quickReply = '') {
  const text = String(quickReply || userMessage.value).trim()
  if (!text) return

  messages.value.push({ sender: 'user', text })
  userMessage.value = ''
  const typingMessage = { sender: 'bot', typing: true }
  messages.value.push(typingMessage)
  await scrollToBottom()

  try {
    // Keep the established public endpoint; it returns reply, suggestions and recommendedCars.
    const { data } = await api.post('/api/chat', { message: text })
    replaceTypingMessage(typingMessage, {
      sender: 'bot',
      text: data.reply || 'Em chưa hiểu rõ yêu cầu. Anh/chị có thể chọn một gợi ý bên dưới.',
      suggestions: data.suggestions || [],
      recommendedCars: data.recommendedCars || [],
    })
  } catch {
    replaceTypingMessage(typingMessage, {
      sender: 'bot',
      text: 'Rất tiếc, hệ thống tư vấn đang gặp sự cố. Vui lòng thử lại sau!',
      suggestions: INITIAL_SUGGESTIONS,
    })
  }
  await scrollToBottom()
}

function replaceTypingMessage(typingMessage, message) {
  const index = messages.value.indexOf(typingMessage)
  if (index >= 0) messages.value.splice(index, 1, message)
}

function openCar(id) {
  router.push(`/car/detail/${id}`)
  isOpen.value = false
}

async function scrollToBottom() {
  await nextTick()
  if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
}
</script>

<style scoped>
/* Cố định nút chat ở góc dưới bên phải màn hình */
.chatbot-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.chat-toggle-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.chat-window {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 340px;
  height: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: #007bff;
  color: white;
  padding: 12px;
  text-align: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-message {
  display: flex;
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.bot {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
}

.user .message-bubble {
  background: #007bff;
  color: white;
}

.bot .message-bubble {
  background: #f1f1f1;
  color: #333;
}

.typing-indicator { align-items: center; display: flex; gap: 4px; height: 18px; margin: 0; }
.typing-indicator span { animation: typing-bounce .9s infinite ease-in-out; background: #6b7280; border-radius: 50%; height: 6px; width: 6px; }
.typing-indicator span:nth-child(2) { animation-delay: .15s; }
.typing-indicator span:nth-child(3) { animation-delay: .3s; }
@keyframes typing-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }

.car-cards {
  margin-top: 8px;
  display: grid;
  gap: 6px;
}

.car-card-item {
  align-items: center;
  background: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
  display: grid;
  gap: 8px;
  grid-template-columns: 64px minmax(0, 1fr);
  padding: 6px;
  border-radius: 6px;
  color: #333;
  text-align: left;
  width: 100%;
}

.car-card-item:hover { border-color: #007bff; }
.car-card-item img { height: 48px; object-fit: cover; width: 64px; }
.car-card-item span { display: grid; min-width: 0; }
.car-card-item strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.car-card-item small { color: #6b7280; }
.car-card-item b { color: #b91c1c; font-size: 12px; }

.quick-replies { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
.quick-replies button { background: #fff; border: 1px solid #007bff; border-radius: 999px; color: #0063cc; cursor: pointer; font-size: 12px; padding: 5px 8px; text-align: left; }
.quick-replies button:hover { background: #eaf4ff; }

.chat-footer {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
}

.chat-footer input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.chat-footer button {
  margin-left: 6px;
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
