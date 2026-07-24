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
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          :class="['chat-message', msg.sender]"
        >
          <div class="message-bubble">
            <p>{{ msg.text }}</p>

            <!-- Render danh sách xe từ Database nếu có -->
            <div v-if="msg.cars && msg.cars.length > 0" class="car-cards">
              <div v-for="car in msg.cars" :key="car.id" class="car-card-item">
                <strong>{{ car.name }}</strong>
                <p v-if="car.description">{{ car.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Khung nhập liệu -->
      <div class="chat-footer">
        <input 
          v-model="userMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Nhập câu hỏi (VD: tìm xe vios)..." 
        />
        <button @click="sendMessage">Gửi</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatbotWidget',
  data() {
    return {
      isOpen: false,
      userMessage: '',
      messages: [
        { sender: 'bot', text: 'Xin chào! Em là bot tư vấn CarStore. Anh/chị cần tìm xe gì ạ?' }
      ]
    };
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
    },
    async sendMessage() {
      if (!this.userMessage.trim()) return;

      const text = this.userMessage;
      this.messages.push({ sender: 'user', text: text });
      this.userMessage = '';

      try {
        // Gọi API Spring Boot Backend của bạn (kiểm tra lại port 8080 hay 8082)
        const response = await axios.post('http://localhost:8082/api/chat', {
          message: text
        });

        this.messages.push({
          sender: 'bot',
          text: response.data.reply,
          cars: response.data.cars
        });
      } catch (error) {
        this.messages.push({
          sender: 'bot',
          text: 'Rất tiếc, hệ thống tư vấn đang gặp sự cố. Vui lòng thử lại sau!'
        });
      }

      // Tự cuộn xuống tin nhắn mới
      this.$nextTick(() => {
        if (this.$refs.chatBody) {
          this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight;
        }
      });
    }
  }
};
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
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.chat-window {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 340px;
  height: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
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

.car-cards {
  margin-top: 8px;
}

.car-card-item {
  background: #fff;
  border: 1px solid #ddd;
  padding: 6px;
  border-radius: 6px;
  margin-top: 4px;
  color: #333;
}

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