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
      Comparison of <i>post-hoc failure attribution</i> and <i>online auditing</i> on the same multi-agent task.
      <b>(a)</b> Post-hoc failure attribution inspects the trajectory only <i>after</i> it has failed and identifies the decisive error retrospectively, by which point downstream propagation has already locked in the failure.
      <b>(b)</b> Our <b>AgentForesight</b> instead evaluates each prefix as the trajectory unfolds and flags the decisive error at the very step it commits, opening an intervention window before the failure is locked in.
    </template>
  </FigureSection>
</template>
