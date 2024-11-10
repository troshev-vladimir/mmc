<template>
  <!-- // id="app" тут капец как важно  -->
  <v-content class="wrapper v-application" data-app id="app">
    <div class="top" ref="top" v-intersect="onIntersect"></div>
    <div class="router-view">
      <the-header></the-header>
      <router-view></router-view>
    </div>
    <the-footer v-if="isFooter"></the-footer>
    <button
      class="button-to-top"
      title="scroll to top"
      :class="{ 'd-none': isToTopButton }"
      @click="$refs.top?.scrollIntoView({ behavior: 'smooth' })"
    >
      <ChevronIcon style="width: 20px; height: 20px; fill: #fff" ></ChevronIcon>
    </button>
  </v-content>
</template>

<script lang="ts">
import '@/assets/styles/style.sass'
import { Component, Vue, Watch } from 'vue-property-decorator'
import TheHeader from '@/components/_layout/TheHeader.vue'
import api from '@/api'
import { vxm } from '@/vuex'
import i18n from '@/i18n'
import storage from '@/storage'
import { Meta } from '@/decorators/decorators'
import ChevronIcon from '@/components/icons/chevron.vue'
import TheFooter from '@/components/_layout/TheFooter.vue'

@Component({
  components: {
    TheHeader,
    ChevronIcon,
    TheFooter
  },
})
export default class App extends Vue {
  isFooter = false

  @Meta
  myMetaConfig() {
    return {
      htmlAttrs: {
        lang: vxm.user.lang === 'ru' ? 'ru' : 'en',
      },
      // link: [
      //   {
      //     rel: 'canonical',
      //     hreflang: 'en-US',
      //     href: 'https://mmcflash.eu' + window.location.pathname
      //   },
      //   {
      //     rel: 'alternate',
      //     hreflang: 'ru-RU',
      //     href: 'https://mmcflash.ru' + window.location.pathname,
      //   },
      // ],
    }
  }

  @Watch("$route")
  routeLoaded(value: any) {
    if (value) {
      this.takeUtm();
    }
  }

  async takeUtm() {
    if (
      (localStorage['user-attributes'] &&
        Object.keys(JSON.parse(localStorage['user-attributes'])).length) ||
      vxm.user.userIsAuth
    )
      return
    const userAttributes = {
      utmSource: this.$route.query.utm_source,
      utmMedium: this.$route.query.utm_medium,
      utmCampaign: this.$route.query.utm_campaign,
    }

    localStorage["user-attributes"] = JSON.stringify(userAttributes);
  }

  async takefingerPrint() {
    const location = await fetch(
      'https://api.ipregistry.co/?key=wm73k25xp7xrr13d'
    )
      .then(function (response) {
        return response.json()
      })
      .then(function (payload) {
        return payload.location.country.name + ', ' + payload.location.city
      })

    const wpid = navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        console.log('Извините, нет доступной позиции.', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      }
    )

    return {
      // memory: navigator.deviceMemory,
      width: window.screen.width,
      height: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
      lang: navigator.language, // || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage
      browser: navigator.userAgent,
      location,
    }
  }

  isToTopButton = false
  onIntersect(entries: any) {
    this.isToTopButton = entries[0].isIntersecting
  }

  async created() {
    api.authorize.getUser()
    api.authorize.isAuthenticated().then((res) => {
      vxm.user.setUserIsAuth(res)
    })
    window.addEventListener('customerror', (e: any) => {
      if (
        e.detail.error.errors &&
        e.detail.error.errors[0]?.errorCodes[0]?.code === 'EmailValidator'
      ) {
        this.$toasted.error(
          e.detail.error.errors[0].errorCodes[0].error ||
            String(this.$t('somethingWentWrong')),
          {
            icon: "error",
          }
        );
      } else {
        this.$toasted.error(String(e.detail.error.message), { icon: 'error' })
      }
    });

    window.addEventListener('auth-error', (e: any) => {
      this.$toasted.error(String(this.$t('shouldAuth')), {
        icon: 'error',
        action: {
          text: String(this.$t('goAuth')),
          onClick: () => {
            if (this.$route.name === 'Login') return
            this.$router.push({ name: 'Login' })
          },
        },
      })
    })
  }

  get isCroowler() {
    // eslint-disable-next-line
    const botPattern = '(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)'
    const re = new RegExp(botPattern, 'i')
    const userAgent = navigator.userAgent
    return re.test(userAgent)
  }

  get isHeadless() {
    // @ts-expect-error: Let's ignore a compile error
    return eval.toString().length == 33 && !window.chrome
  }

  getCurrentLang() {
    const search = window.location.search
    const searchParams = new URLSearchParams(search)
    const initialLang = searchParams.get('initial_lang')
    if (initialLang === 'ru' || initialLang === 'en') {
      return initialLang
    }
    return window.location.hostname.includes(".ru") ? "ru" : "en";
  }

  mounted() {
    const user = storage.user;
    if (user) vxm.user.user = user;

    const search = new URLSearchParams(window.location.search);
    const searchObj: { [key: string]: any } = {};
    for (const [key, value] of search.entries()) {
      searchObj[key] = value;
    }

    const lang = this.getCurrentLang()
    i18n.locale = lang
    vxm.user.setLang(lang)

    setTimeout(() => {
      this.isFooter = true
    }, 2000)
  }
}
</script>

<i18n>
{
  "ru": {
    "goAuth": "Авторизоваться",
    "login-error": "Не удалось авторизоваться",
    "login-success": "Упешная авторизация"
  },
  "en": {
    "goAuth": "Go to authorize",
    "login-error": "Can't to login you",
    "login-success": "Login success"
  }
}
</i18n>
<style lang="scss">
[v-cloak] {
  display: none;
}

.router-view {
  flex: 1 1 auto;
  min-height: 100vh;
}

div.toasted-container.top-center {
  top: 20px;
  align-items: center;
}
.v-content__wrap {
  display: flex;
  flex-direction: column;
}

.v-application.wrapper {
  min-height: 100vh;

  * {
    font-family: 'Golos', Sans-Serif !important;
  }

  a {
    color: #333;
  }

  .title {
    font-weight: 500 !important;
    font-size: 34px !important;
    line-height: 120% !important;
    color: #333333;

    &_accent {
      color: #e31e24 !important;
    }

    @media screen and (max-width: 768px) {
      font-size: 18px !important;
    }
  }

  ul,
  ol {
    padding-left: 0;
  }
  .caption {
    font-size: 48px !important;
    font-weight: 600;
    line-height: 58px;
  }
}
</style>
