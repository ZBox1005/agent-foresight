<script setup>
import FigureSection from './FigureSection.vue'
</script>

<template>
  <FigureSection
    title="Main Results"
    src="resources/main_table.png"
    alt="Online auditing evaluation on AFTraj-2K"
  >
    <template #caption>
      <b>AgentForesight-7B</b> reaches <b>66.44 Exact-F1</b> (+19.88 over DeepSeek-V4-Pro) and tightens overall ASS to <b>0.59</b> (<b>3× lower</b>), winning every domain.
    </template>
  </FigureSection>
</template>
