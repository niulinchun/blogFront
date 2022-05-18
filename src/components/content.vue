<template>
  <div>

    {{content}}
  </div>
</template>

<script>
export default {
  name: "Content",
  data() {
    return {
      content: {
        type: String,
        default: '资源不存在',
      }
    }
  }
}
</script>

<style scoped>

</style>
