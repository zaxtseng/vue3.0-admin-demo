<template>
    <div>
        <LayoutHeader />
        <LayoutNav />
        <LayoutMain />
    </div>
</template>
<script>
import LayoutNav from './Components/Nav'
import LayoutMain from './Components/Main'
import LayoutHeader from './Components/Header'

export default {
    name: "layout",
    components: {LayoutNav, LayoutMain, LayoutHeader},
    setup(){

    }
}
</script>
<style lang="scss" scoped>

</style>