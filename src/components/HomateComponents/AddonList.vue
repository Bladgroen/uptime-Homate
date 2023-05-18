<template>
    <div v-for="addon in addonList" :key="addon._id">
        <AddonComponent
            :id="addon._id"
            :img="addon._icon"
            :name="addon._name"
            :updateAvailable="addon._updateAvailable"
            :slug="addon._slug"
            :heartBeatList="getFilteredHeartbeatList"
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
    data() {
        return {
            heartbeatList: {},
        };
    },
    mounted() {
        //this.getFilteredHeartbeatList();
    },
    methods: {
        getAddonHeartbeat() {
            this.$root.getSocket().emit("getAddonHeartbeat");

            this.$root.getSocket().on("addonHeartbeat", (data) => {
                this.heartbeatList = data;
            });
        },
        getFilteredHeartbeatList() {
            const filteredList = {};
            const monitorID = this.$route.params.number;

            for (const key in this.heartbeatList) {
                if (key === monitorID) {
                    filteredList[key] = this.heartbeatList[key];
                }
            }
            console.log(filteredList);
            return filteredList;
        },
    },
};
</script>
<style lang="scss"></style>
