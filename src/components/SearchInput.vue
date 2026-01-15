<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="搜索饰品名称，如：响尾蛇、AK-47..."
        class="search-input"
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="handleBlur"
      />
    </div>
    
    <div v-if="showDropdown && filteredItems.length > 0" class="dropdown">
      <div class="dropdown-content">
        <div
          v-for="item in filteredItems.slice(0, 8)"
          :key="item.marketHashName"
          class="dropdown-item"
          @mousedown="selectItem(item)"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-hash">{{ item.marketHashName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SkinItem } from '@/types'

const props = defineProps<{
  items: SkinItem[]
}>()

const emit = defineEmits<{
  select: [value: SkinItem]
}>()

const query = ref('')
const showDropdown = ref(false)
let blurTimer: number | null = null

const filteredItems = computed(() => {
  if (!query.value.trim()) return []
  
  const searchTerm = query.value.toLowerCase().trim()
  return props.items.filter(item => 
    item.name.toLowerCase().includes(searchTerm) ||
    item.marketHashName.toLowerCase().includes(searchTerm)
  )
})

const handleInput = () => {
  showDropdown.value = true
}

const handleBlur = () => {
  blurTimer = setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const selectItem = (item: SkinItem) => {
  query.value = item.name
  showDropdown.value = false
  emit('select', item)
  
  if (blurTimer) {
    clearTimeout(blurTimer)
  }
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #9ca3af;
  z-index: 10;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  font-size: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease;
  background: white;
  color: #1f2937;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  z-index: 50;
  overflow: hidden;
}

.dropdown-content {
  max-height: 320px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.item-hash {
  font-size: 12px;
  color: #6b7280;
  font-family: 'Monaco', 'Consolas', monospace;
}
</style>