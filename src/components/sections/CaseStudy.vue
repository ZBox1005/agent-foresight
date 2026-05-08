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
      Case study of <i>online auditing</i>, comparing predictions from DeepSeek-V4-Pro, Gemini-3-Flash, and <b>AgentForesight-7B</b> on an agentic trajectory whose decisive error involves the search agent returning the wrong town. <b>AgentForesight-7B</b> alone localizes the decisive step with the responsible <i>search_agent</i>. The two strong proprietary baselines fail in opposite directions: Gemini-3-Flash raises a premature alarm at Step 2 on the Manager's planning thought, while DeepSeek-V4-Pro returns <b>SAFE</b> after monitoring the whole trajectory. Effective online auditing demands both refraining from premature alarms on safe prefixes and detecting decisive errors that strong baselines miss entirely.
    </template>
  </FigureSection>
</template>
