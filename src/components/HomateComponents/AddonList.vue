<template>
    <div v-for="addon in addonList" :key="addon._id">
        <AddonComponent
            :id="addon._id"
            :img="addon._icon"
            :name="addon._name"
            :updateAvailable="addon._updateAvailable"
            :slug="addon._slug"
        ></AddonComponent>
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

    mounted() {},
    methods: {},
};
</script>
<style lang="scss"></style>
