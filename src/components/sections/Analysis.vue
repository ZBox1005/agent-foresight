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
      <b>Left:</b> Ablation of the two-stage <i>coarse-to-fine</i> recipe on AFTraj-2K. Each stage individually lifts Exact-F1 from the base 21.1 (Stage 1 → 35.6, Stage 2 → 50.4), and combining them yields <b>66.4</b> for AgentForesight-7B, exceeding either single stage by at least 16 points. Stage 2 alone handles Math (63.6) and Coding (72.7) where decisive errors are sharply localizable but degrades on Agentic (19.0); adding the Stage-1 risk-anticipation prior recovers Agentic to 48.7, validating the predict-then-localize coupling.
      <br/><br/>
      <b>Right:</b> Deployment trade-off plotting Step Accuracy (D<sub>unsafe</sub>) against False Alarm Rate (D<sub>safe</sub>) for ten auditors, with a shaded <i>deployable region</i> at <b>FAR ≤ 20%</b> and <b>Step-Acc ≥ 50%</b>. Only <b>AgentForesight-7B</b> (FAR = 2.4%, Step-Acc = 59.5%) lies inside the deployable region; DeepSeek-V4-Pro (43.2%, 54.0%) falls just outside, while open-source 7–8B base models and other proprietary judges concentrate at high FAR with mid Step-Acc, or collapse to near-universal false alarms.
    </template>
  </FigureSection>
</template>
