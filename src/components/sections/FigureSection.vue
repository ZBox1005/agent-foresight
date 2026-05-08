<script setup>
defineProps({
  title: { type: String, required: true },
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  // slot 'caption' 用于自定义 caption（含粗体/斜体），简单 caption 可用 captionText
  captionText: { type: String, default: '' },
})
</script>

<template>
  <div>
    <el-divider />

    <el-row justify="center">
      <h1 class="section-title">{{ title }}</h1>
    </el-row>

    <el-row justify="center">
      <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
        <el-image :src="src" :alt="alt" fit="contain" class="figure" />
        <p class="caption">
          <slot name="caption">{{ captionText }}</slot>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

.section-title {
  margin: 30px 0 10px 0;
}

.figure {
  display: block;
  width: 100%;
  height: auto;
  margin: 16px auto 8px auto;
  border-radius: 8px;
}

.caption {
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  text-align: justify;
  margin: 8px 12px 24px 12px;
}

.caption :deep(b) {
  color: #000;
}

</style>
