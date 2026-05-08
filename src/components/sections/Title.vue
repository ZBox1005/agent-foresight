<script lang="ts" setup>

import { ElIcon } from 'element-plus'
import { Document, Files, MagicStick, Picture, DataAnalysis, Film } from '@element-plus/icons-vue'

// logo地址，没有则置为""即可
const logo = 'resources/logo_full.png'

// 标题（logo_full 已含品牌字样，H1 只放副标题，避免重复）
const title = ''

// 标题颜色
const title_color = '#000000'

// 标题补充，没有则置为''即可
const title_supp = 'Online Auditing for Early Failure Prediction in Multi-Agent Systems'

// 标题补充颜色
const title_supp_color = '#000000'

// 按钮颜色
const btn_color = '#444444'

// 作者清单（包含作者姓名、头像、主页、地址序号）
const authors = [
  {
    name: "Boxuan Zhang",
    icon: "",
    homepage: "https://zbox1005.github.io/",
    address_flag: "1"
  },
  {
    name: "Jianing Zhu",
    icon: "",
    homepage: "https://zfancy.github.io/",
    address_flag: "2"
  },
  {
    name: "Zeru Shi",
    icon: "",
    homepage: "https://vanpe20.github.io/",
    address_flag: "1"
  },
  {
    name: "Dongfang Liu",
    icon: "",
    homepage: "https://dongfang-liu.github.io/",
    address_flag: "3"
  },
  {
    name: "Ruixiang Tang",
    icon: "",
    homepage: "https://www.ruixiangtang.net/",
    address_flag: "1,*"
  },
]

// 地址清单（包含地址名称、头像、主页、地址序号）
const addresses = [
  {
    address_flag: "1",
    name: "Rutgers University",
    icon: "resources/ru_icon.png",
    homepage: "https://www.rutgers.edu/"
  },
  {
    address_flag: "2",
    name: "University of Texas at Austin",
    icon: "resources/uta_icon.png",
    homepage: "https://www.utexas.edu/"
  },
  {
    address_flag: "3",
    name: "Rochester Institute of Technology",
    icon: "resources/rit_icon.png",
    homepage: "https://www.rit.edu/"
  },
]

// 共一和通讯提示
const con_and_corresponding_author =
  "*: Corresponding Author."

// 最新消息
const news = ""

// 强调内容
const emphases = []

// 提供引导资料链接
const buttons = [
  {
    disabled: false,
    name: "Paper",
    link: "#",
    component: Document,
  },
  {
    disabled: false,
    name: "Code",
    link: "#",
    component: Files,
  },
  {
    disabled: false,
    name: "Dataset",
    link: "#",
    component: DataAnalysis,
  },
  {
    disabled: false,
    name: "Model",
    link: "#",
    component: MagicStick,
  },
  {
    disabled: false,
    name: "BibTeX",
    link: "#bibtex",
    component: Document,
  },
]

</script>

<template>
  <div>

    <!-- 最新消息提示 -->
    <el-row v-if="news" justify="center">
      <el-col :span="24">
        <el-alert :title="news" type="success" />
      </el-col>
    </el-row>

    <!-- 文章logo -->
    <el-row v-if="logo" justify="center">
      <el-image :src="logo" class="logo" fit="cover" />
    </el-row>

    <!-- 文章标题 -->
    <el-row justify="center">
      <el-col :span="20">
        <h1 class="paper-title">
          <span v-if="title" :style="{color:title_color}"> {{ title }}</span>
          <span v-if="title_supp" :style="{color:title_supp_color}"> {{ title_supp }}</span>
        </h1>
      </el-col>
    </el-row>

    <!-- 作者名单 -->
    <el-row justify="center">
      <a :href=author.homepage v-for="author in authors">
        <el-button class="title-button" type="primary" text>
          <el-avatar v-if="author.icon" :size="40" :src="author.icon" />
          <span class="author">
            {{ author.name }}<sup v-if="author.address_flag" class="name_sup">{{ author.address_flag }}</sup>
          </span>
        </el-button>
      </a>
    </el-row>

    <!-- 地址名单 -->
    <el-row justify="center">
      <a :href=address.homepage v-for="address in addresses">
        <el-button class="title-button" type="primary" text>
          <el-avatar v-if="address.icon" :size="40" :src="address.icon" />
          <span class="address">
            <sup v-if="address.address_flag" class="address_sup">{{ address.address_flag }}</sup>{{ address.name }}
          </span>
        </el-button>
      </a>
    </el-row>

    <!-- 共一和通讯提示内容 -->
    <el-row justify="center" class="con-cor">
        {{ con_and_corresponding_author }}
    </el-row>

    <!-- 强调内容 -->
    <el-row justify="center" class="emphasis" v-for="emphasis in emphases">
        {{ emphasis }}
    </el-row>

    <!-- 提供引导按钮 -->
    <el-row justify="center" style="margin-bottom: 20px;">
      <el-col :span="20">
        <el-row justify="center">
          <a :href=button.link v-for="button in buttons">
            <el-button class="guidance-button" size="default" :color="btn_color" :disabled="button.disabled" round>
              <el-icon :size="18">
                <component :is="button.component" />
              </el-icon>
              <span class="btn-text">{{ button.name }}</span>
            </el-button>
          </a>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<style scoped>

/* 文章标题字体、字间距、居中排布、字号 */
.paper-title {
  font-family: "MyFont", Verdana, sans-serif;
  letter-spacing: 2px;
  font-size: 42px;
  margin: 32px;
  text-align: center;
}

/* 姓名和地址按钮 */
.title-button {
  margin: 10px 3px;
}

/* 姓名和地址按钮光标悬浮 */
.title-button:hover {
  margin: 10px 8px;
}

/* 引导材料按钮 */
.guidance-button {
  margin: 8px 5px;
  box-shadow: #d8d8d8 1px 1px 1px 1px;
}

/* 姓名属性 */
.author {
  font-size: 18px;
  margin-left: 3px;
}

/* 姓名上标属性 */
.name_sup {
  color: #606266; 
  margin-left: 3px;
}

/* 地址属性 */
.address {
  font-size: 18px;
}

/* 地址上标属性 */
.address_sup {
  color: #606266; 
  margin-right: 1px;
}

/* 头像属性 */
.el-avatar {
  margin-right: 6px;
  box-shadow: #b7b7b7 0px 0px 3px 1px;
}

/* 共一和通讯文字属性 */
.con-cor {
  font-family: Arial;
  font-size: 14px;
  margin: 18px 0px;
  text-align: center;
}

/* 强调信息属性 */
.emphasis {
  color: chocolate;
  font-weight: bold;
  margin: 8px;
  font-size: 22px;
  text-align: center;
}

/* 引导材料按钮文字属性 */
.btn-text {
  font-size: 18px;
  color: #ffffff;
}

.el-alert {
  margin: 10px 0 0;
}

.el-alert:first-child {
  margin: 0;
}

.logo {
  width: clamp(280px, 60%, 540px);
  height: auto;
  margin-top: 40px;
}

/* 手机端链接样式处理 */
a:-webkit-any-link {
  text-decoration: none;
}

/* 取消鼠标焦点悬浮在链接上的颜色装饰 */
a:hover {
  color: inherit;
  border-bottom: none;
}

/* 链接装饰，取消下划线和链接颜色 */
a {
	text-decoration: None;
	color: inherit;
}

</style>