<template>
    <div class="loading-overlay">
        <!-- Loading animation or message -->
        <div class="loading">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>




        <!-- You can add a loading message here if needed -->
    </div>
</template>

<style scoped>
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    /* 半透明的背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    /* 使其显示在顶层 */
}

.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  color: #000;
}

.loading.la-dark {
  color: #333;
}

.loading > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.loading {
  width: 40px;
  height: 32px;
}

.loading > div {
  width: 4px;
  height: 32px;
  margin: 2px;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0;
  animation: line-scale-pulse-out 0.9s infinite
    cubic-bezier(0.85, 0.25, 0.37, 0.85);
}

.loading > div:nth-child(3) {
  animation-delay: -0.9s;
}

.loading > div:nth-child(2),
.loading > div:nth-child(4) {
  animation-delay: -0.7s;
}

.loading > div:nth-child(1),
.loading > div:nth-child(5) {
  animation-delay: -0.5s;
}

.loading.la-sm {
  width: 20px;
  height: 16px;
}

.loading.la-sm > div {
  width: 2px;
  height: 16px;
  margin: 1px;
  margin-top: 0;
  margin-bottom: 0;
}

.loading.la-2x {
  width: 80px;
  height: 64px;
}

.loading.la-2x > div {
  width: 8px;
  height: 64px;
  margin: 4px;
  margin-top: 0;
  margin-bottom: 0;
}

.loading.la-3x {
  width: 120px;
  height: 96px;
}

.loading.la-3x > div {
  width: 12px;
  height: 96px;
  margin: 6px;
  margin-top: 0;
  margin-bottom: 0;
}

@keyframes line-scale-pulse-out {
  0% {
    transform: scaley(1);
  }

  50% {
    transform: scaley(0.3);
  }

  100% {
    transform: scaley(1);
  }
}


</style>
