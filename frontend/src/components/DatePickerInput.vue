<template>
  <div class="date-picker-input" :class="{ 'date-picker-input--disabled': disabled }">
    <input
      :id="id"
      class="form-control date-picker-input__display"
      type="text"
      :value="displayValue"
      placeholder="dd/mm/yyyy"
      readonly
      :disabled="disabled"
      :required="required"
      :aria-label="ariaLabel"
      :aria-required="required"
      aria-haspopup="dialog"
      :title="title || 'Chọn ngày (dd/mm/yyyy)'"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @keydown.down.prevent="openPicker"
    />

    <span class="date-picker-input__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M7 2v2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-2V2h-2v2H9V2H7Zm12 18H5a1 1 0 0 1-1-1v-8h16v8a1 1 0 0 1-1 1ZM4 9V7a1 1 0 0 1 1-1h2v2h2V6h6v2h2V6h2a1 1 0 0 1 1 1v2H4Z" />
      </svg>
    </span>

    <input
      ref="nativePicker"
      class="date-picker-input__native"
      type="date"
      :value="isoValue"
      :min="min || undefined"
      :max="max || undefined"
      :disabled="disabled"
      :required="required"
      :aria-label="ariaLabel"
      tabindex="-1"
      @change="selectDate"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, default: undefined },
  min: { type: String, default: '' },
  max: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Chọn ngày' },
  title: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
const nativePicker = ref(null)

const isoValue = computed(() => {
  const value = String(props.modelValue || '').slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''
})

const displayValue = computed(() => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoValue.value)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : ''
})

function openPicker() {
  if (props.disabled || !nativePicker.value) return
  try {
    if (typeof nativePicker.value.showPicker === 'function') {
      nativePicker.value.showPicker()
      return
    }
  } catch {
    // Trình duyệt không hỗ trợ showPicker sẽ dùng click native bên dưới.
  }
  nativePicker.value.focus({ preventScroll: true })
  nativePicker.value.click()
}

function selectDate(event) {
  emit('update:modelValue', event.target.value || '')
}
</script>

<style scoped>
.date-picker-input {
  position: relative;
  width: 100%;
}

.date-picker-input__display {
  padding-right: 3rem;
  cursor: pointer;
}

.date-picker-input__icon {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: 0.85rem;
  width: 1.2rem;
  height: 1.2rem;
  color: #64748b;
  pointer-events: none;
  transform: translateY(-50%);
}

.date-picker-input__icon svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.date-picker-input__native {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  width: 3rem;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.date-picker-input--disabled .date-picker-input__display,
.date-picker-input--disabled .date-picker-input__native {
  cursor: not-allowed;
}
</style>
