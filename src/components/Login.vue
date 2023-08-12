<template>
  <div class="box">
    <el-card class="box-card" shadow="always">

      <div class="middle">
        <p class="middle-title">SHNU</p>
      </div>

      <div class="card-content">

        <div class="input-container">
          <el-icon :size="21" class="input-icon">
            <Message />
          </el-icon>
          <input type="text" class="custom-input" placeholder="Emai address">
        </div>

        <div class="input-container">
          <el-icon :size="21" class="input-icon">
            <Lock />
          </el-icon>
          <input type="password" class="custom-input" placeholder="Password">
        </div>

        <div class="input-container">
          <el-icon :size="21" class="input-icon">
            <el-icon>
              <Avatar />
            </el-icon>
          </el-icon>
          <input type="text" class="custom-input" placeholder="管理员ID(没有请忽略)">
        </div>

      </div>

      <div class="card-footer">
        <el-button plain @click="login" link class="card-button">LET'S GO</el-button>
        <div class="forget-password">
          <el-link :underline="false" href="https://element-plus.org" target="_blank">Forgot Password?</el-link>
        </div>
      </div>

    </el-card>
    <el-card class="box-card-header" shadow="always">
      <h4 class="card-title">Login</h4>

      <div class="icon-position">
        <div class="icon-box">
          <el-icon :size="15" class="icon">
            <Promotion />
          </el-icon>
        </div>

        <div class="icon-box">
          <el-icon :size="15" class="icon">
            <Comment />
          </el-icon>
        </div>

        <div class="icon-box">
          <el-icon :size="15" class="icon">
            <ChromeFilled />
          </el-icon>
        </div>

      </div>


    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'

const login = () => {
  ElNotification({
    title: 'Success',
    message: '登陆成功！',
    type: 'success',
    offset: -8,
  })
}

</script>

<style scoped>
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.box-card {
  width: 360px;
  height: 500px;
  position: absolute;
  transform: translate(-50%, -50%);
}

.box-card:hover {
  /* 增加阴影深度 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
}

.box-card-header {
  width: 320px;
  height: 138px;
  position: absolute;
  transform: translate(-50%, -200%);
  background-color: #ec407a;
  /* 增加阴影深度 */
  box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.4);
}

.card-title {
  color: #FFFFFF;
  font-size: 130%;
  text-align: center;
}


.icon-position {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
  margin-top: 35px;
  border-radius: 50%;
  background-color: #FFFFFF;
  /* 使用 border-radius 实现圆形 */
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.15);
}

.icon {
  color: #e91e63;
}

.middle {
  width: 320px;
  height: 50px;
  position: absolute;
  top: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.middle-title {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: larger;
}

.card-content {
  width: 320px;
  height: 220px;
  position: absolute;
  top: 190px;
  display: flex;
  flex-direction: column;
  /* 设置主轴方向为垂直 */
  justify-content: center;
  align-items: center;
}

.input-container {
  display: inline-block;
  display: flex;
  margin-bottom: 45px;
  /* 添加垂直间距 */

}

.input-icon {
  margin-top: 15px;
  margin-right: 10px;
}

.custom-input {
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  padding: 15px 5px 5px;
  /* 调整内边距 */
  width: 266px;
  height: auto;
  font-size: 14px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-weight: lighter;
}

.custom-input::placeholder {
  margin-top: 35px;
  color: #ccc;
  transition: color 0.3s, transform 0.3s, font-size 0.3s;
  font-size: 15px;
}

.custom-input:focus::placeholder {
  color: #ccc;
  transform: translateY(-100%);
  font-size: 12px;
}

.card-footer {
  width: 320px;
  height: 100px;
  position: absolute;
  top: 400px;
  display: flex;
  flex-direction: column;
  /* 设置主轴方向为垂直 */
  justify-content: center;
  align-items: center;
}

.card-button {
  width: 180px;
  height: 55px;
  background-color: transparent;
  color: #e91e63;
}

.card-button:hover {
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.15);
}

.forget-password {
  margin-left: auto;
  /* 将左侧空间推向最大，使其靠右显示 */
}
</style>
