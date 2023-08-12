<template>
    <div class="input-container">
        <input type="text" class="custom-input" placeholder="只有底部边框">
    </div>
</template>
  
<script lang="ts" setup>



</script>
  
<style>
.input-container {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
}

.custom-input {
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    padding: 15px 5px 5px; /* 调整内边距 */
    width: 200px;
    font-size: 16px;
}

.custom-input::placeholder {
  margin-top: 35px; /* 添加一些外边距 */
  color: #ccc;
  transition: color 0.3s, transform 0.3s, font-size 0.3s;
}

.custom-input:focus::placeholder {
  color: #ccc;
  transform: translateY(-100%);
  font-size: 12px;
}

</style>