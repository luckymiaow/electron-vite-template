<script setup lang="ts">
import { api } from "@/api";
import { Book } from "~/db/entities/Book";

const data = ref<Book[]>([]);

async function handleClick() {
  await api("BookService.create", { name: "vite" });
}

async function query() {
  data.value = await api("BookService.findAll");
}

function test() {

}

function getAmazonCategories() {

}
</script>

<template>
  <a-button @click="handleClick">创建</a-button>
  <a-button @click="query">查询</a-button>
  <a-button @click="test">test</a-button>
  <a-button @click="getAmazonCategories">getAmazonCategories</a-button>
  <a-table :dataSource="data" :columns="TableColumns(Book)"></a-table>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
