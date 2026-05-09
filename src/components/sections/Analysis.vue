<script setup>
import FigureSection from './FigureSection.vue'
</script>

<template>
  <FigureSection
    title="Ablation & Analysis"
    src="resources/ablation_analysis.png"
    alt="Stage-wise ablation and deployment trade-off"
  >
    <template #caption>
      <b>Left:</b> Stage 1 and Stage 2 individually lift Exact-F1; combined they reach <b>66.4</b>, exceeding either alone by ≥16 points.<br>
      <b>Right:</b> Among ten auditors, only <b>AgentForesight-7B</b> sits inside the deployable region (FAR ≤ 20%, Step-Acc ≥ 50%).
    </template>
  </FigureSection>
</template>
