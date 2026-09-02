<template>
  <div class="chatbot-wrapper">
    <!-- Nút tròn bật/tắt khung chat -->
    <button class="chat-toggle-btn" @click="toggleChat" :aria-label="isOpen ? 'Đóng cửa sổ tư vấn' : 'Mở cửa sổ tư vấn'">
      <span v-if="!isOpen" class="toggle-content">
        <span class="icon">💬</span>
        <span class="text">Tư vấn AI</span>
      </span>
      <span v-else class="toggle-content">
        <span class="icon">✖</span>
        <span class="text">Đóng</span>
      </span>
    </button>

    <!-- Khung chat chính (Chỉ hiện khi isOpen = true) -->
    <div v-if="isOpen" class="chat-window shadow-lg">
      <!-- Header -->
      <div class="chat-header">
        <div class="header-info">
          <div class="avatar">✨</div>
          <div>
            <h3>CarStore AI Advisor</h3>
            <span class="status-online"><span class="dot"></span> Đang trực tuyến</span>
          </div>
        </div>
        <button class="close-btn" @click="toggleChat" title="Đóng">✕</button>
      </div>

      <!-- Quick Chips (Gợi ý nhanh) -->
      <div class="quick-chips">
        <button
          v-for="(chip, idx) in quickChips"
          :key="idx"
          class="chip-btn"
          @click="sendQuickMessage(chip.query)"
          :disabled="isLoading"
        >
          {{ chip.label }}
        </button>
      </div>

      <!-- Danh sách tin nhắn -->
      <div class="chat-body" ref="chatBody">
        <div v-for="(msg, index) in messages" :key="index" :class="['chat-message', msg.sender]">
          <!-- Avatar nếu là bot -->
          <div v-if="msg.sender === 'bot'" class="bot-avatar">🤖</div>

          <div class="message-bubble">
            <!-- Thẻ AI Badge nếu là tin phản hồi AI -->
            <div v-if="msg.isAi" class="ai-tag">✨ Gemini AI</div>

            <div class="message-text" v-html="formatText(msg.text)"></div>

            <!-- Render danh sách xe gợi ý nếu có -->
            <div v-if="msg.cars && msg.cars.length > 0" class="car-cards">
              <router-link
                v-for="car in msg.cars"
                :key="car.id"
                :to="`/car/detail/${car.id}`"
                class="car-card-item"
                @click="isOpen = false"
                title="Nhấp để xem chi tiết xe"
              >
                <div class="car-card-img">
                  <img :src="carImageUrl(car.image)" :alt="car.name" @error="useDefaultCarImage" />
                </div>
                <div class="car-card-content">
                  <div class="car-title-row">
                    <div class="car-title">{{ car.name }}</div>
                    <span class="view-arrow">➜</span>
                  </div>
                  <div class="car-meta">
                    <span v-if="car.year" class="badge-tag">{{ car.year }}</span>
                    <span v-if="car.bodyType" class="badge-tag">{{ car.bodyType }}</span>
                  </div>
                  <div class="car-price">{{ formatCarPrice(car.price) }}</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Typing Indicator (Đang suy nghĩ) -->
        <div v-if="isLoading" class="chat-message bot">
          <div class="bot-avatar">🤖</div>
          <div class="message-bubble typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>

      <!-- Khung nhập liệu -->
      <div class="chat-footer">
        <input
          v-model="userMessage"
          @keyup.enter="sendMessage"
          placeholder="Hỏi AI tư vấn xe (VD: Xe sedan dưới 600tr)..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !userMessage.trim()" class="send-btn">
          <span>Gửi</span> 🚀
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/client';
import { carImageUrl, useDefaultCarImage, formatPrice } from '../api/index';

export default {
  name: 'ChatbotWidget',
  data() {
    return {
      isOpen: false,
      isLoading: false,
      userMessage: '',
      messages: [
        {
          sender: 'bot',
          text: 'Xin chào! Em là **CarStore AI Advisor**. Anh/chị cần tư vấn thông tin xe, mức giá hay vị trí Showroom ạ?',
          isAi: true
        }
      ],
      quickChips: [
        { label: '🏎️ Xe Sedan', query: 'Tư vấn các mẫu xe Sedan đang có' },
        { label: '🚙 Xe SUV', query: 'Các dòng xe SUV gia đình' },
        { label: '💰 Dưới 600tr', query: 'Có những xe nào dưới 600 triệu?' },
        { label: '📍 Địa chỉ & Hotline', query: 'Cho xin địa chỉ showroom và hotline' },
        { label: '📅 Đặt lịch lái thử', query: 'Tôi muốn đặt lịch lái thử xe' }
      ]
    };
  },
  methods: {
    carImageUrl,
    useDefaultCarImage,
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.scrollToBottom();
      }
    },
    formatCarPrice(price) {
      if (!price) return 'Liên hệ báo giá';
      return `${formatPrice(price)} VNĐ`;
    },
    formatText(text) {
      if (!text) return '';
      let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
      return formatted;
    },
    sendQuickMessage(query) {
      this.userMessage = query;
      this.sendMessage();
    },
    async sendMessage() {
      if (!this.userMessage.trim() || this.isLoading) return;

      const text = this.userMessage.trim();
      this.messages.push({ sender: 'user', text: text });
      this.userMessage = '';
      this.isLoading = true;
      this.scrollToBottom();

      try {
        const response = await api.post('/api/chat', {
          message: text
        });

        this.messages.push({
          sender: 'bot',
          text: response.data.reply,
          cars: response.data.cars,
          isAi: response.data.isAi
        });
      } catch (error) {
        console.error('Lỗi khi gửi câu hỏi tới Chatbot API:', error);
        this.messages.push({
          sender: 'bot',
          text: 'Rất tiếc, chưa kết nối được tới Server Java Backend. Anh/chị vui lòng kiểm tra xem file `run.bat` đã chạy chưa hoặc gọi Hotline **0909.123.456** nhé!',
          isAi: false
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
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
.chatbot-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.chat-toggle-btn {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  color: white;
  border: none;
  padding: 14px 22px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 8px 24px rgba(13, 110, 253, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-toggle-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 12px 28px rgba(13, 110, 253, 0.45);
}

.toggle-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  height: 560px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 120px);
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.chat-header {
  background: linear-gradient(135deg, #0d6efd 0%, #055160 100%);
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.status-online {
  font-size: 12px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #20c997;
  border-radius: 50%;
  box-shadow: 0 0 8px #20c997;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.8;
  padding: 4px;
  border-radius: 50%;
  transition: opacity 0.2s;
}

.close-btn:hover { opacity: 1; }

.quick-chips {
  display: flex;
  gap: 6px;
  padding: 10px;
  overflow-x: auto;
  background: #f8f9fa;
  border-bottom: 1px solid #edf2f7;
  white-space: nowrap;
}

.quick-chips::-webkit-scrollbar { height: 4px; }
.quick-chips::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

.chip-btn {
  background: #ffffff;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.chip-btn:hover:not(:disabled) {
  background: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.chat-body {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #fdfdfd;
}

.chat-message { display: flex; gap: 8px; align-items: flex-start; }
.chat-message.user { justify-content: flex-end; }

.bot-avatar {
  width: 32px;
  height: 32px;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 82%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.user .message-bubble {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.bot .message-bubble {
  background: #f1f5f9;
  color: #1e293b;
  border-bottom-left-radius: 4px;
}

.ai-tag {
  font-size: 10px;
  font-weight: 700;
  color: #0d6efd;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.car-cards { margin-top: 10px; display: flex; flex-direction: column; gap: 10px; }

.car-card-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.car-card-item:hover {
  transform: translateY(-2px) scale(1.01);
  border-color: #0d6efd;
  box-shadow: 0 8px 18px rgba(13, 110, 253, 0.15);
}

.car-card-img { width: 90px; height: 90px; flex-shrink: 0; overflow: hidden; background: #f8f9fa; }
.car-card-img img { width: 100%; height: 100%; object-fit: cover; }
.car-card-content { padding: 8px 10px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.car-title-row { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.car-title { font-weight: 700; font-size: 13px; color: #0f172a; }
.view-arrow { color: #0d6efd; font-size: 12px; font-weight: 700; transition: transform 0.2s; }
.car-card-item:hover .view-arrow { transform: translateX(3px); }
.car-meta { display: flex; gap: 4px; margin: 2px 0; }
.badge-tag { background: #e2e8f0; color: #475569; font-size: 10px; padding: 1px 6px; border-radius: 4px; }
.car-price { color: #dc3545; font-weight: 700; font-size: 12px; }

.typing-bubble { display: flex; align-items: center; gap: 4px; padding: 12px 16px; }
.typing-dot { width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; animation: typing 1.4s infinite ease-in-out both; }
.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

.chat-footer { display: flex; padding: 12px; gap: 8px; background: #ffffff; border-top: 1px solid #edf2f7; }
.chat-footer input { flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 20px; font-size: 13px; outline: none; transition: border-color 0.2s; }
.chat-footer input:focus { border-color: #0d6efd; }
.send-btn { background: #0d6efd; color: white; border: none; border-radius: 20px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: opacity 0.2s; }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
