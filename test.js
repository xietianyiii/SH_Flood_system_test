function getTextElementsArrayFormatted() {
    const targetElements = document.querySelectorAll('div.col-8.align-self-center > div[class=""]');
    const textArray = []; // 用于存储文本内容的数组

    if (targetElements.length > 0) {
        targetElements.forEach(element => {
            textArray.push(element.innerText.trim());
        });
        return textArray; // 返回文本内容的数组，而不是格式化后的字符串
    } else {
        console.log('未找到指定的元素。');
        return []; // 返回一个空数组，表示没有找到元素
    }
}

function modifyInputValues() {
    // getTextElementsArrayFormatted 函数用于获取文本数组
    const textArray = getTextElementsArrayFormatted();

    // 关键词列表
    const keywords = ["!!", "惊讶", "哦！", "大家！", "了！", "人！",
        "终于！", "考完了！", "美！", "上！", "哟！", "好！", "提！", "生日快乐！", "因！"];

    // 选择需要修改的输入框元素
    const elements = document.querySelectorAll('input.form-control[name^="sdg_"]');

    elements.forEach((element, index) => {
        // 当前输入框对应的文本内容
        const text = textArray[index];

        // 检查当前文本中是否包含关键词
        const hasKeyword = keywords.some(keyword => text.includes(keyword));

        // 如果文本中包含关键词，则将输入框的值设定为"检索到了"
        if (hasKeyword) {
            element.value = "激动"; // 设置输入框的值为"检索到了"
        }
    });
}

function clickNextPage() {
    const nextPageButton = document.querySelector('input[value="更新标注"]');
    if (nextPageButton) {
        nextPageButton.click();
    }
}

modifyInputValues();
clickNextPage();