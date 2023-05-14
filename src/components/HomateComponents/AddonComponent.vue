<template>
    <div class="addon">
        <div class="addon__name">
            <img :src="img" />

            <p>{{ name }}</p>
        </div>
        <div class="addon__status"></div>
        <div class="addon__update"></div>
    </div>
</template>
<script>
export default {
    props: {
        img: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
    },
};
</script>
<style lang="scss"></style>
