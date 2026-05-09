<script setup>
import FigureSection from './FigureSection.vue'
</script>

<template>
  <FigureSection
    title="Why Online Auditing?"
    src="resources/motivation.png"
    alt="Comparison of post-hoc failure attribution and online auditing"
  >
    <template #caption>
      <b>(a)</b> Post-hoc attribution only diagnoses after the trajectory has already failed.
      <b>(b)</b> <b>AgentForesight</b> flags the decisive error step-by-step on the unfolding prefix, opening a deployment-time intervention window before the failure is locked in.
    </template>
  </FigureSection>
</template>
