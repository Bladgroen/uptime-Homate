<template>
    <div class="addon">
        <div class="addon__name">
            <img :src="img" alt="addon logo" />

            <p>{{ name }}</p>
        </div>
        <div class="addon__status"><div></div></div>
        <div v-if="update === 1" class="addon__update">
            <AddonUpdateButton
                :id="id"
                :slug="slug"
                :name="name"
                @update-parent="updateParentState"
            ></AddonUpdateButton>
        </div>
    </div>
</template>
<script>
import AddonUpdateButton from "./AddonUpdateButton.vue";

export default {
    components: {
        AddonUpdateButton,
    },
    props: {
        img: {
            type: String,
            default: "../../../public/Homate.jpg",
        },
        name: {
            type: String,
            required: true,
        },
        updateAvailable: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
            required: true,
        },
        id: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            update: this.updateAvailable,
            heartbeat: {},
            test: null,
            filteredList: {},
        };
    },
    created() {
        //this.getAddOnHeartbeat();
        //this.test = this.getFilteredHeartbeatList(67);
        console.log(this.test);
    },
    methods: {
        updateParentState(newValue) {
            this.update = newValue;
        },
        getAddOnHeartbeat() {
            this.$root.getSocket().emit("getAddonHeartbeat");

            this.$root.getSocket().on("addonHeartbeat", (data) => {
                console.log("test");
                this.heartbeat = data;
                //this.filteredList = this.getFilteredHeartbeatList();
            });
        },
        getFilteredHeartbeatList(addonID) {
            let selectedEntry = null;
            let latestTime = 0;

            const monitorID = this.$route.params.id;
            for (const key in this.heartbeat) {
                const heartbeat = this.heartbeatList[key];
                console.log("🚀 ~ heartbeat:", heartbeat);

                if (
                    heartbeat._addOnId === addonID &&
                    heartbeat._monitorID === monitorID &&
                    heartbeat._time > latestTime
                ) {
                    console.log(heartbeat.addon_id);
                    selectedEntry = heartbeat;
                    latestTime = heartbeat._time;
                }
            }
            return selectedEntry;
        },
    },
};
</script>
<style lang="scss" scoped>
.addon {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__name {
        display: flex;
        flex-direction: row;
        max-width: 25rem;
        min-width: 25rem;
        margin-left: 2rem;
        p {
            align-self: center;
            margin: 0;
            margin-left: 0.5rem;
        }

        img {
            width: 4.375rem;
            height: 4.375rem;
        }
    }

    &__status {
        max-width: 20rem;
        min-width: 20rem;

        div {
            border-radius: 50px;
            width: 3.125rem;
            height: 3.125rem;
            background-color: #5cdd8b;
        }
    }

    &__update {
    }
}
</style>
