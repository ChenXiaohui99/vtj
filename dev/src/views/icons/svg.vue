<template>
  <div class="icons">
    <div v-for="[name, svg] in iconsArray" class="item">
      <XIcon :src="svg" :size="40"></XIcon>
      <div>
        <span> {{ name }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { XIcon } from '@vtj/web';
  import { assets } from '@vtj/icons';

  const iconsArray = Object.entries(assets);
</script>

<style lang="scss" scoped>
  .icons {
    display: flex;
    flex-wrap: wrap;
  }
  .item {
    width: 150px;
    text-align: center;
    padding: 10px;
    border-radius: 3px;
    border: 1px dashed #ccc;
    margin: 5px;
    > div {
      padding-top: 10px;
      font-size: 12px;
      color: #666;
      > span {
        display: block;
      }
    }
  }
</style>
