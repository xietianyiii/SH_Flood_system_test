<template>
    <div class="heart-container" @click="handleClick">
      <transition-group name="fade">
        <div v-for="(heart, index) in hearts" :key="index" class="heart" :style="heart.style">
          {{ heart.text }}
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const hearts = ref([]);
  
  
  const handleClick = (e) => {
    const x = e.pageX;
    const y = e.pageY;
    const randomColor = getRandomColorCode();
  
    const newHeart = {
      text: "❤",
      style: {
        top: `${y - 18}px`,
        left: `${x - 6}px`,
        color: randomColor,
        opacity: 1, // 初始透明度为1，可见
        transform: 'scale(1.1)', // 固定大小为原尺寸
      },
    };
  
    hearts.value.push(newHeart);
    setTimeout(() => {
      newHeart.style.opacity = 0; // 4秒后透明度变为0，消失
    }, 2500); // 4秒后自动移除
  
    setTimeout(() => {
      hearts.value = hearts.value.filter(heart => heart !== newHeart);
    }, 2500); // 4秒后移除小爱心
  };
  
  function getRandomColorCode() {
    const allType = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
    const allTypeArr = allType.split(",");
    let color = "#";
    for (let i = 0; i < 6; i++) {
      const random = Math.floor(Math.random() * allTypeArr.length);
      color += allTypeArr[random];
    }
    return color;
  }
  
  
  </script>
  
  <style scoped>
  .heart-container {
    position: relative;
    height: 100vh;
  }
  
  .heart {
    position: absolute;
    z-index: 9999999;
    user-select: none;
    animation: floatUp 2s forwards; 
  }
  
  @keyframes remove {
    100% {
      opacity: 0;
    }
  }
  
  @keyframes floatUp {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100px);
      opacity: 0;
    }
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s; /* 设置过渡时间 */
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0; /* 进入前和离开后的初始状态 */
  }
  </style>
  