<template>
  <div ref="editor"></div>
</template>

<script>
import E from "wangeditor";
export default {
  data() {
    return {
      editorView: null,
      editorContent: "",
      isChange: false
    };
  },
  props: {
    value: {
      type: String,
      default() {
        return "";
      }
    },
    menu: {
      type: Array,
      default() {
        return [
          //   "head", // 标题
          //   "bold", // 粗体
          //   "fontSize", // 字号
          //   "fontName", // 字体
          //   "italic", // 斜体
          //   "underline", // 下划线
          //   "strikeThrough", // 删除线
          //   "foreColor", // 文字颜色
          //   "backColor", // 背景颜色
          //   "link", // 插入链接
          //   "list", // 列表
          //   "justify", // 对齐方式
          //   "quote", // 引用
          //   "emoticon", // 表情
          //   "image", // 插入图片
          //   "table", // 表格
          //   "video", // 插入视频
          //   "code", // 插入代码
          //   "undo", // 撤销
          //   "redo" // 重复
        ];
      }
    },
    lang: {
      type: Object,
      default() {
        return {};
      }
    },
    pasteFilterStyle: {
      type: Boolean,
      default() {
        return false;
      }
    },
    pasteIgnoreImg: {
      type: Boolean,
      default() {
        return true;
      }
    },
    colors: {
      type: Array,
      default() {
        return [];
      }
    },
    emotions: {
      type: Array,
      default() {
        return [];
      }
    },
    fonts: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted() {
    this.editorView = new E(this.$refs.editor);
    this.editorContent = this.value;
    if (this.menu.length) {
      this.editorView.customConfig.menu = this.menu;
    }
    if (this.lang.length) {
      this.editorView.customConfig.lang = this.lang;
    }
    this.editorView.customConfig.pasteFilterStyle = this.pasteFilterStyle;
    this.editorView.customConfig.pasteIgnoreImg = this.pasteIgnoreImg;
    if (this.colors.length) {
      this.editorView.customConfig.colors = this.colors;
    }
    if (this.emotions.length) {
      this.editorView.customConfig.emotions = this.emotions;
    }
    if (this.fonts.length) {
      this.editorView.customConfig.fontNames = this.fonts;
    }
    this.editorView.customConfig.customUploadImg = this.uploadImg
    this.editorView.customConfig.onchange = html => {
      this.onInput(html);
    };
    this.editorView.create();
    this.editorView.txt.html(this.editorContent);
  },
  methods: {
    onInput(text) {
      if (this.editorContent === text) {
        return;
      }
      this.editorContent = text;
      this.$emit("input", text);
      this.isChange = true;
    },
    uploadImg(files, insert) {
      files.forEach(element => {
        let formData = new FormData()
        formData.append(element.name, element)
        this.$axios.post('/api/resources/uploadImage', formData).then( res => {
          for (let i in res.data.data.success) {
          this.$Message.success({
            content: `文件${res.data.data.success[i].file}上传成功！`,
            duration: 5
          });
          insert(`/api/resources/image?url=${res.data.data.success[i].url}`)
        }
        for (let i in res.data.data.error) {
          this.$Message.error({
            content: `文件${res.data.data.success[i].file}上传失败！`,
            duration: 5
          });
        }
        })
        .catch( () => {
          this.$Message.error('网络错误！')
        })
        insert('')
      });
      
    }
  },
  watch: {
    value (val) {
      if (!this.isChange) {
        this.editorContent = val;
        if (this.editorView) {
          this.editorView.txt.html(this.editorContent);
        }
      }
      this.isChange = false;
    }
  }
};
</script>

<style scoped>
</style>