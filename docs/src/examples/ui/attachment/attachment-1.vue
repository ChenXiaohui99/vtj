<template>
  <div>
    <h1>列表模式</h1>
    <XAttachment
      size="large"
      list-type="list"
      v-model="fileList"
      v-model:select-value="selected"
      @change="onChange"
      @click="onClick"
      :uploader="uploader"
      :addable="true"
      clickable
      selectable
      :previewable="true"
      :removable="true"
      :downloadable="true"
      :multiple="true"></XAttachment>
    <hr />
    <h1>卡片模式</h1>
    <XAttachment v-model="fileList"></XAttachment>
    <XAttachment size="large" v-model="fileList"></XAttachment>

    <XAttachment
      multiple
      :formatter="formatter"
      :valueFormatter="valueFormatter"
      :uploader="uploader"
      v-model="files"
      :auto-upload="true"
      style="
        border: 1px red solid;
        display: flex;
        justify-content: center;
      "></XAttachment>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { XAttachment, type AttachmentFile } from '@vtj/ui';
  import { delay } from '@vtj/utils';

  const fileList = ref<AttachmentFile[]>([
    {
      url: 'http://dummyimage.com/120x90',
      name: 'food.jpeg'
    },
    {
      url: 'http://dummyimage.com/200x300',
      name: 'http://dummyimage.com/200x300food.jpeg'
    },
    {
      url: 'http://dummyimage.com/300x300/FF0000',
      name: 'food.jpeg',
      type: 'img'
    },
    {
      url: 'http://dummyimage.com/300x300'
    }
  ]);

  const selected = ref({
    url: 'http://dummyimage.com/120x90'
  });

  const onChange = (files: any) => {
    console.log('onChange', files);
  };

  const onClick = (file: any) => {
    console.log('click', file);
  };

  const uploader: any = async () => {
    await delay(1000);
    return 'https://oss.newpearl.com/newpearl/image/2024-07-15/acd6ff3e0bf8fce74d795a870c9069e6.png';
  };

  const formatter: any = async (files: any) => {
    console.log('formatter', files);
    for (const file of files) {
      file.__url = file.url;
      file.url = file.url + '?only=true';
    }
    return files;
  };

  const valueFormatter: any = async (files: any) => {
    console.log('valueFormatter', files);
    return files.map((n: any) => {
      return {
        url: n.url,
        name: n.name
      };
    });
  };

  const files = ref([]);
</script>
