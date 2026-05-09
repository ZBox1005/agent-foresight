<script setup>
import FigureSection from './FigureSection.vue'
</script>

<template>
  <FigureSection
    title="Method"
    src="resources/pipeline.png"
    alt="AgentForesight pipeline: AFTraj-2K construction and coarse-to-fine training"
  >
    <template #caption>
      <b>(a) AFTraj-2K</b> pairs strictly-filtered safe runs with failure runs annotated at their decisive step via multi-judge voting.<br>
      <b>(b)</b> A <i>coarse-to-fine</i> RL recipe first aligns the auditor at the failure boundary, then sharpens it under a three-axis reward over <i>what</i>, <i>where</i>, and <i>who</i>.
    </template>
  </FigureSection>
</template>
