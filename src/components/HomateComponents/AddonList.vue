<template>
    <div class="component">
        <div class="names">
            <p class="name">Name</p>
            <p class="status">Status</p>
        </div>
        <div v-for="addon in addonList" :key="addon._id">
            <AddonComponent
                :id="addon._id"
                :img="addon._icon"
                :name="addon._name"
                :updateAvailable="addon._updateAvailable"
                :slug="addon._slug"
                :addonHeartbeat="
                    $root.addonHeartbeatList[$route.params.id][addon._id].msg
                "
                class="addoncomponent"
            ></AddonComponent>
        </div>
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
<style lang="scss" scoped>
.names {
    display: flex;
    margin-top: 2rem;
    p {
        font-size: 2rem;
    }

    .name {
        max-width: 24rem;
        min-width: 24rem;
        margin-left: 2rem;
    }

    .status {
        max-width: 25rem;
        min-width: 25rem;
    }
}

.addoncomponent {
    margin-bottom: 2rem;
}

.component {
    background-color: #0d1117;
    border-radius: 20px;
}
</style>
