<template>
    <div class="heart-container" @click="handleClick">
        <transition-group name="fade">
            <div v-for="(heart, index) in hearts" :key="index" class="heart" :style="heart.style">
                {{ heart.text }}
            </div>
        </transition-group>

        <div class="box">
            <el-card class="box-card" shadow="always">

                <div class="middle">
                    <p class="middle-title">洪涝快速预报系统</p>
                </div>

                <div class="card-content">
                    <div class="input-container">
                        <el-icon :size="21" class="input-icon">
                            <Message />
                        </el-icon>
                        <input type="text" class="custom-input" v-model="email" placeholder="Email address">
                    </div>

                    <div class="input-container">
                        <el-icon :size="21" class="input-icon">
                            <Lock />
                        </el-icon>
                        <input type="password" class="custom-input" v-model="password" placeholder="Password">
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
                    <el-button plain @click="login" link class="card-button">登录</el-button>
                    <div class="forget-password">
                        <el-button plain @click="showForgotPassword" link class="card-button-1">忘记密码?</el-button>
                    </div>
                </div>
            </el-card>

            <el-card class="box-card-header" shadow="always">
                <h4 class="card-title">登录</h4>

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
    </div>
</template>

  
<script lang="ts" setup>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 导入 useRouter 钩子
import { login as authLogin } from '../auth'; // 引入 `auth.ts` 中的 `login` 函数


const showForgotPassword = () => {
  ElNotification({
    title: 'Forgot Password',
    message: '账号: flood, 密码: 123456',
    type: 'success',
    offset: -8,
  });
};


interface Heart {
    text: string;
    style: {
        top: string;
        left: string;
        color: string;
        opacity: number;
        transform: string;
    };
}

const hearts = ref<Heart[]>([]);
const email = ref(''); // 保存用户输入的邮箱
const password = ref(''); // 保存用户输入的密码
const router = useRouter(); // 使用 useRouter 钩子获取路由实例

// 模拟的正确的账号信息
const correctEmail = 'flood';
const correctPassword = '123456';

const handleClick = (e: MouseEvent) => {
    const x = e.pageX;
    const y = e.pageY;
    const randomColor = getRandomColorCode();

    const newHeart: Heart = {
        text: "❤",
        style: {
            top: `${y - 18}px`,
            left: `${x - 6}px`,
            color: randomColor,
            opacity: 1,
            transform: 'scale(1.1)',
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



const login = () => {
  if (email.value === correctEmail && password.value === correctPassword) {
    ElNotification({
      title: 'Success',
      message: '登陆成功！',
      type: 'success',
      offset: -8,
    });

    authLogin(); // 调用 `auth.ts` 中的 `login` 函数
    router.push('/forecasting').catch(err => {
      console.error('跳转错误:', err);
    });
  } else {
    ElNotification({
      title: 'Error',
      message: '登录失败，邮箱或密码错误。',
      type: 'error',
      offset: -8,
    });
  }
};


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
    user-select: none;
    /* 防止文本选中 */
    cursor: default;
    /* 鼠标悬停时不显示光标 */
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
    user-select: none;
    /* 防止文本选中 */
    cursor: default;
    /* 鼠标悬停时不显示光标 */
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

.card-button-1 {
    background-color: transparent;
    color: #e91e63;
}

.card-button-1:hover {
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.15);
}

.forget-password {
    margin-left: auto;
    /* 将左侧空间推向最大，使其靠右显示 */
}



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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
    /* 设置过渡时间 */
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
    /* 进入前和离开后的初始状态 */
}
</style>
  