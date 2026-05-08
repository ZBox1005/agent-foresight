<script setup>
import FigureSection from './FigureSection.vue'
</script>

<template>
  <FigureSection
    title="Main Results"
    src="resources/main_table.png"
    alt="Online auditing evaluation on AFTraj-2K across Math, Coding, Agentic, and Overall"
  >
    <template #caption>
      Online auditing evaluation on <b>AFTraj-2K</b>. <b>Bold</b> = best; <u>underline</u> = second best.
      <b>AgentForesight-7B</b> reaches <b>66.44 Exact-F1</b> overall, +19.88 over the strongest proprietary baseline DeepSeek-V4-Pro, and tightens overall ASS from 1.77 to <b>0.59 (3× lower)</b>.
      Per-domain, AgentForesight-7B wins every domain, with the largest Exact-F1 gains on <b>Math</b> (77.36 vs. 50.34) and <b>Coding</b> (78.87 vs. 49.32).
      The coarse-to-fine recipe lifts the Qwen2.5-7B-Instruct backbone by <b>3.16×</b> on Exact-F1, while the post-hoc reference AgentDebug-7B (full-trajectory hindsight) ranks lowest at 9.63 — confirming that the gains stem from the recipe tailored to online auditing rather than scaling backbones or re-purposing post-hoc attributors.
    </template>
  </FigureSection>
</template>
