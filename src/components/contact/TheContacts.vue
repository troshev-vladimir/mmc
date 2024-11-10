<template lang="pug">
article.contacts
  .contacts__cont.cont
    h1.contacts__caption.mb-8 {{ $t('caption') }}
    .contacts__box(v-for='(item, i) in list', :key='`${item}${i}`')
      h2.contacts__title {{ $t(item.name) }}
      ul.contacts__list
        //-li.contacts__item.text
          | {{ $t('phone') }}:
          |
          a.link_dark(href="tel:89195364754") 8 919 536 47 54
        li.contacts__item.text
          | {{ $t('mail') }}:
          |
          a.link_dark(:href='getMailLink(item.mail)') {{ item.mail }}
    .contacts__content.content(v-if='$i18n.locale === "ru"')
      h2 Реквизиты
      p.
        Индивидуальный предприниматель Лазько Станислав Валерьевич
      p.
        Юридический адрес: 610035, Кировская обл, городской округ город Киров, Киров г, Чапаева ул, дом 53, квартира 10
      p.
        Почтовый адрес: 610035, Кировская обл, городской округ город Киров, Киров г, Чапаева ул, дом 53, квартира 10
      p.
        ИНН 434550265640
      p.
        ОГРН 320435000018350
      p.
        Расчетный счет 40802810027000019834
      p.
        КИРОВСКОЕ ОТДЕЛЕНИЕ N8612 ПАО СБЕРБАНК
      p.
        Кор счет 30101810500000000609
      p.
        БИК 043304609
    //- .contacts__content.content(v-else)
    //-   h2 Credentials
    //-   p.
    //-     Individual Entrepreneur Prohorova Natalia Andreevna
    //-   p.
    //-     Business address: Russia, 610912 Kirovskaya obl, Kirov, Doronichi village, 6 street, № 4/1
    //-   p.
    //-     Postal address: Business address: Russia, 610912 Kirovskaya obl, Kirov, Doronichi village, 6 street, № 4/1
    //-   p.
    //-     Taxpayer Identification Number (INN) 432402136848
    //-   p.
    //-     Primary State Registration Number (OGRN) 321435000012200
    //-   p.
    //-     Acc. at Branch "Central" of VTB Bank (PJSC) in Moscow 40802810533180000526
    //-   p.
    //-     Corr. acc. 30101810145250000411
    //-   p.
    //-     RCBIC 044525411
</template>

<script lang="ts">
import "@/assets/styles/imports/contacts.sass";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TheContacts extends Vue {
  list = [
    { name: "help", mail: "help@mmcflash.eu" },
    { name: "partnership", mail: "partner@mmcflash.eu" },
    { name: "sales", mail: "sales@mmcflash.eu" },
  ];

  getMailLink(mail: string): string {
    return `mailto:${mail}`;
  }
}
</script>

<i18n>
{
  "en": {
    "caption": "Contacts",
    "help": "Help Desk",
    "partnership": "To Partners",
    "sales": "Sales Department",
    "phone": "Phone",
    "mail": "Email"
  },
  "ru": {
    "caption": "Контакты",
    "help": "Служба поддержки:",
    "partnership": "Партнерам:",
    "sales": "Отдел продаж:",
    "phone": "Телефон",
    "mail": "Почта"
  }
}
</i18n>
