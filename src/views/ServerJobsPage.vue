<template>
  <div class="work-item body">
    <img class="work-item__logo" src="/img/logommc.svg" alt="">
    <h2>{{ $t('heading') }}</h2>
    <p>{{ $t('description') }}</p>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.work-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: calc(100vh - 90px);
}

.work-item__logo{ 
  max-width: 200px;
  margin-bottom: 48px;
}

* {
  text-align: center;
}
</style>
<i18n>
  {
  "ru": {
    "heading": "Ведутся технические работы",
    "description": "Cайт временно недоступен. Приносим извинения за неудобство, попробуйте еще раз позже."
  },
  "en": {
    "heading": "Technical work",
    "description": "The site is temporarily unavailable due to technical work. We apologize for the inconvenience, please try again later."
  }
}
</i18n>