<script setup lang="ts">
import { api } from "@/api";
import { useRouter } from "vue-router";
import { Book } from "~/db/entities/Book";

const data = ref<Book[]>([]);

async function handleClick() {
  await api.BookService.create({ name: "vite" })
}

async function query() {
  data.value = await api.BookService.findAll();
}

const router = useRouter();

function wid() {
  const r = router.resolve('/test')
  api.WindowsService.createWindow({
    name: 'test',
    path: r.fullPath
  })
}

function refreshWindow() {
  api.WindowsService.refreshWindow('test')
}
</script>

<template>
  <a-button @click="handleClick">创建</a-button>
  <a-button @click="query">查询</a-button>
  <a-button @click="wid">wid</a-button>
  <a-button @click="refreshWindow">refreshWindow</a-button>
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
