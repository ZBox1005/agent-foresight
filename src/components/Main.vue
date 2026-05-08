<script>
import Title from './sections/Title.vue'
import Video from './sections/Video.vue'
import Abstract from './sections/Abstract.vue'
import Motivation from './sections/Motivation.vue'
import Method from './sections/Method.vue'
import Results from './sections/Results.vue'
import Analysis from './sections/Analysis.vue'
// import CaseStudy from './sections/CaseStudy.vue'  // 暂关闭
import BibTeX from './sections/BibTeX.vue'
// import Comment from './sections/Comment.vue'  // 暂关闭，启用前需先部署 Twikoo 后端

// 模板自带的 demo section（暂未启用，后续按需可解开注释）
// import Markdown from './sections/Markdown.vue'
// import Carousel from './sections/Carousel.vue'
// import ImageSlider from './sections/ImageSlider.vue'
// import ImageSliderInner from './sections/ImageSliderInner.vue'
// import ImageSelector from './sections/ImageSelector.vue'
// import Echart from './sections/Echart.vue'
// import Table from './sections/Table.vue'
// import Collapse from './sections/Collapse.vue'
// import SeletionForComparison from './sections/SeletionForComparison.vue'
// import Latex from './sections/Latex.vue'
// import Model3D from './sections/Model3D.vue'
// import GaussianSplats3D from './sections/GaussianSplats3D.vue'

export default {
  components: {
    Title,
    Video,
    Abstract,
    Motivation,
    Method,
    Results,
    Analysis,
    BibTeX,
  }
}
</script>

<template>
  <Title/>
  <Video/>
  <Abstract/>
  <Motivation/>
  <Method/>
  <Results/>
  <Analysis/>
  <BibTeX/>
</template>
