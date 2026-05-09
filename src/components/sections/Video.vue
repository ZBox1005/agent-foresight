<script setup>
</script>

<template>
  <div>
    <el-row justify="center">
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
        <el-container class="video-container">
          <video autoplay muted loop playsinline preload="auto" controls>
            <source src="/resources/AgentForesight_gif.mp4" type="video/mp4">
          </video>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

.video-container {
  margin: 24px 0px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: #afafaf 1px 1px 4px 1px;
}

video {
  width: 100%;
  height: auto;
  display: block;
}

</style>
