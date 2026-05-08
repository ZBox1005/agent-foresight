<script setup>
import FigureSection from './FigureSection.vue'
</script>

<template>
  <FigureSection
    title="Method"
    src="resources/pipeline.png"
    alt="Overview of AgentForesight: AFTraj-2K construction pipeline and coarse-to-fine training"
  >
    <template #caption>
      Overview of <b>AgentForesight</b>.
      <b>(a)</b> The <b>AFTraj-2K</b> construction pipeline collects trajectories from off-the-shelf multi-agent systems across multiple domains, retains successful runs through a strict filtering pipeline, and produces failure runs via decisive-error injection and multi-judge voting verification.
      <b>(b)</b> A <i>coarse-to-fine</i> training recipe that first equips the auditor with a risk-anticipation prior on adjacent safe/unsafe prefix pairs, then sharpens it into precise step-level localization under a three-axis reward targeting <i>what</i>, <i>where</i>, and <i>who</i> of an audit verdict. The resulting auditor issues per-step <b>CONTINUE</b> or <b>ALARM</b> verdicts on prefix evidence.
    </template>
  </FigureSection>
</template>
