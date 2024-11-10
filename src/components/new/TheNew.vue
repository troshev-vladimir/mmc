<template lang="pug">
article.new
  .new__cont.cont
    button.button_blue.back(@click="$router.push({name: 'News' })") {{$t('back')}}
    
    h1.new__caption.title(v-text="post.name")
    //- v-responsive(:aspect-ratio="16/9")
    .new__img-wrapper
      .new__img
        img(
          width="600px"
          height="300px"
          :src="post.image"
          style="width: 100%; max-width: 600px"
          class="pa-md-4"
          :title="post.imageTitle"
          :alt="post.imageTitle"
        )
    span.new__date.text(v-text="time")
    span.new__views.text
      EyeIcon(style="width: 20px; height: 20px; fill: #888")
      | {{post.viewCount}}
    .new__content.content(v-html="post.html")

    h2.title.popular-news-title(v-if="post.popularNews.length") {{$t('feedback')}}
    v-form(@submit.prevent="onSubmit")
      v-row
        v-col(
          cols="12"
          md="6"
        )
          v-text-field(
            v-model="userEmail"
            label="E-mail"
            required
          )

          v-textarea(
            v-model="userQuestion"
            :counter="1000"
            :label="$t('question')"
            required
          )

      v-btn(
        class="submit"
        color="primary"
        elevation="2"
        :loading="formIsLoading"
        type="submit"
        :disabled="!isValidationPassed"
      ) {{$t('submit')}}

    h2.title.popular-news-title(v-if="post.popularNews.length") {{$t('popularNews')}}
    .popular-news(
      v-if="post.popularNews.length"
    )
      news-item(
        v-for="item in post.popularNews",
        :key="item.newsId",
        :slug="item.slug",
        :date="item.published",
        :locale="locale",
        :lang="item.lang",
        :img="item.image",
        :name="item.name",
        :note="item.text"
      )
</template>

<script lang="ts">
import "@/assets/styles/imports/new.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { NewsInterface } from "@/interfaces/news";
import NewsItem from "@/components/_new/NewsItem.vue";
import { vxm } from "@/vuex";
import api from "@/api";
import EyeIcon from '@/components/icons/eye.vue'

@Component({
  components: {
    NewsItem,
    EyeIcon
  },
})
export default class TheNew extends Vue {
  userEmail = vxm.user.user?.email || "";
  userQuestion = "";
  formIsLoading = false;

  @Prop({ type: Object }) post!: NewsInterface.New;

  get isValidationPassed() {
    return vxm.user.userIsAuth && this.userQuestion && this.userEmail;
  }

  get time(): string {
    const date: Date = new Date(this.post.published);
    return date.toLocaleDateString(this.locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  returnToInitial() {
    this.userEmail = vxm.user.user?.email || "";
    this.userQuestion = "";
  }

  async onSubmit() {
    const data = {
      email: this.userEmail,
      lang: vxm.user.lang,
      slug: this.post.slug,
      message: this.userQuestion,
    };

    try {
      this.formIsLoading = true;
      await api.news.feedback(data);
      this.returnToInitial();
      this.$toasted.success(String(this.$t("succesfullyFedbackSend")), {
        icon: "check",
      });
    } catch (error) {
      console.log(error);
      this.$toasted.error(
        error.detail.error.errors[0].errorCodes[0].error ||
          String(this.$t("somethingWentWrong")),
        {
          icon: "error",
        }
      );
    }

    this.formIsLoading = false;
  }

  get locale() {
    return this.$i18n.locale === "ru" ? "ru-RU" : "en-US";
  }
}
</script>

<i18n>
{
  "ru": {
    "back": "Ко всем новостям",
    "popularNews": "Читайте так же:",
    "feedback": "Если остались вопросы, задайте их нам",
    "question": "Ваш вопрос",
    "submit": "Отправить",
    "succesfullyFedbackSend": "Успершно доставлено"
  },
  "en": {
    "back": "Go to all news",
    "popularNews": "Read also:",
    "feedback": "If you have any questions, please ask us",
    "question": "Your question",
    "submit": "Submit",
    "succesfullyFedbackSend": "Successfully feedback send"
  }
}
</i18n>
<style scoped lang="scss">
.new__cont {
  position: relative;
}

.popular-news {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
.popular-news-title {
  font-size: 34px;
  margin-bottom: 10px;
  margin-top: 54px;
}

.back {
  padding: 5px 10px;
  margin-bottom: 20px;
}

.new__img {
  background-color: #dddddd;
  padding-bottom: 50%;
  max-width: 600px;
  position: relative;

  img {
    width: 100%;
    padding: 0 !important;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
}

.new__img-wrapper {
  max-height: 300px;
  overflow: hidden;
  margin-bottom: 16px;
}
</style>

<style lang="scss">
.submit {
  & > .v-btn__content,
  &::before {
    text-transform: capitalize;
    letter-spacing: normal;
    font-weight: 700;
    font-size: 16px;
  }
}
.new__content {
  p,
  strong {
    line-height: 150%;
    font-size: 16px;
    font-weight: 400;
  }

  p + p,
  img + p {
    margin-top: 32px;
  }

  a {
    color: #2461d9 !important;
  }

  h2 {
    margin-top: 30px;
    font-size: 30px;
  }

  blockquote {
    background-color: #ffcccc;
    padding: 10px;
  }

  ul {
    li {
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }

  ol {
    li {
      position: static;
      list-style-type: decimal;
      margin-left: 20px;
    }
  }

  .button-to-solution {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    text-align: center;
    text-decoration: none;
    font-weight: 700;
    cursor: pointer;
    background-color: #177ec9;
    color: #fff !important;
  }

  //.link_blue
  //.title_accent красный текст
}
</style>
