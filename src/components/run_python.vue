<template>
  
  <el-button plain @click="runPythonCode" link class="card-button">LET'S GO</el-button>
</template>

<script lang="ts">
export default {
  data() {
    return {
      pythonOutput: []
    };
  },
  
  methods: {
    async runPythonCode() {
      try {
        const response = await fetch('http://localhost:5000/run-python-code', {
          method: 'POST',
        }); // 使用您自己的URL

        if (response.status === 200) {
          // Python代码运行成功的处理逻辑
          console.log('Python代码运行成功');
          this.fetchPythonOutput(); // 调用获取Python输出的函数
        } else {
          // Python代码运行失败的处理逻辑
          console.error('Python代码运行失败');
        }
      } catch (error) {
        // 错误处理逻辑
        console.error('发生错误', error);
      }
    },
    async fetchPythonOutput() {
      try {
        const response = await fetch('http://localhost:5000/get-output', {
          method: 'GET',
        });

        if (response.status === 200) {
          const data = await response.json();
          this.pythonOutput = data.output_messages; // 更新Python输出信息
        } else {
          console.error('获取Python输出失败');
        }
      } catch (error) {
        console.error('发生错误', error);
      }
    }
  }
}
</script>

<style>
.card-button {
  width: 80px;
  height: 45px;
  background-color: transparent;
  color: #e91e63;
}

.card-button:hover {
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.15);
}
</style>