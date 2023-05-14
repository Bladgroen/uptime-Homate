<template>
    <div v-for="addon in addonList" :key="addon._id">
        <AddonComponent :img="addon._icon" :name="addon._name"></AddonComponent>
        <p>{{ addon._icon }}</p>
    </div>
</template>
<script>
import AddonComponent from "./AddonComponent.vue";

export default {
    components: { AddonComponent },
    props: {
        addonList: {
            type: Object,
            required: true,
        },
    },
};
</script>
<style lang="scss"></style>
