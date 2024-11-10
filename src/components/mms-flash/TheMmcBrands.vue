<template lang="pug">
.mmc-flash__brands
  ul.mmc-flash__brands-list
    li.mmc-flash__brands-item(v-for="(brand, i) in brands", :key="i", @click="selectBrand(brand)")
      picture.mmc-flash__brands-picture
        source(
          :srcset="`/img/mmc-flash/${getBrand(brand)}_54.webp`" 
          media="(max-width: 600px)"
          type="image/webp"
        )
        source(
          :srcset="`/img/mmc-flash/${getBrand(brand)}_90.webp`" 
          media="(min-width: 600px)"
          type="image/webp"
        )
        img.mmc-flash__brands-image(
          :src="`/img/mmc-flash/${getBrand(brand)}_90.jpg`"
          :alt="`Логотип ${brand}`"
          :title="getBrand(brand)"
        )
  button.mmc-flash__brands-button.mmc-flash__brands-button_prev(
    type="button",
    :class="{ 'mmc-flash__brands-button_hide' : !isShowPrevButton }"
    @click="goToPrevSlide")
  button.mmc-flash__brands-button.mmc-flash__brands-button_next(
    type="button",
    :class="{ 'mmc-flash__brands-button_hide' : !isShowNextButton }"
    @click="goToNextSlide")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TheMmcBrands extends Vue {
  @Prop(Array) readonly brands!: Array<string>;

  position = 0;
  isShowPrevButton = false;
  isShowNextButton = false;

  selectBrand(brand: string) {
    this.$emit("select-brand", brand);
  }

  goToPrevSlide() {
    let nextPosition =
      this.position - this.slider.getBoundingClientRect().width - 228;
    if (nextPosition < 0) nextPosition = 0;
    this.scrollSlider(nextPosition);
  }

  goToNextSlide() {
    const nextPosition =
      this.position + this.slider.getBoundingClientRect().width - 228;
    this.scrollSlider(nextPosition);
  }

  scrollSlider(nextPosition: number) {
    this.slider.scroll({
      left: nextPosition,
      behavior: "smooth",
    });
    this.position = nextPosition;
    this.checkButtons();
  }

  checkButtons() {
    this.checkPrevButton();
    this.checkNextButton();
  }

  checkPrevButton() {
    this.isShowPrevButton = !(this.position <= 0);
  }

  checkNextButton() {
    this.isShowNextButton =
      this.position <= this.slider.scrollWidth - this.slider.clientWidth;
  }

  getBrand(brand: string) {
    return brand.replace(/\s/g, "");
  }

  get slider() {
    return this.$el.getElementsByClassName("mmc-flash__brands-list")[0];
  }

  mounted() {
    this.checkButtons();
  }
}
</script>
