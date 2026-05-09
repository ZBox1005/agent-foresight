<script setup>
import FigureSection from './FigureSection.vue'
</script>

<template>
  <FigureSection
    title="Case Study"
    src="resources/case_study.png"
    alt="Case study comparing predictions from DeepSeek-V4-Pro, Gemini-3-Flash, and AgentForesight-7B"
  >
    <template #caption>
      <b>AgentForesight-7B</b> alone localizes the decisive error to the responsible <i>search_agent</i>. Gemini-3-Flash raises a premature alarm at Step 2; DeepSeek-V4-Pro returns <b>SAFE</b> despite the wrong final answer.
    </template>
  </FigureSection>
</template>
