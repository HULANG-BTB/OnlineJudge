<template>
    <Modal v-model="visiable" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>{{ title }}</span>
        </p>
        <div style="text-align:center">
            <p>{{message}}</p>
            <p>确定删除？</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="loading" @click="del">删除</Button>
        </div>
    </Modal>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    props: {
        title: {
            type: String,
            default() {
                return ''
            }
        },
        message: {
            type: String,
            default() {
                return ''
            }
        },
        visiable: {
            type: Boolean,
            default() {
                return false
            }
        },
        loading: {
            type: Boolean,
            default() {
                return false
            }
        }
    },
    methods: {
        del() {
            this.$emit('onConfirm')
        }
    },
}
</script>

<style scoped>

</style>