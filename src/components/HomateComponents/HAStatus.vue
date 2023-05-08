<template>
    <div class="StatusSymbol">

        <div
            v-if="shortBeatList"
            class="StatusSymbol__icon"
            :class="{
                empty: shortBeatList === 0,
                down: shortBeatList.status === 0,
                active: shortBeatList.status === 1,
                pending: shortBeatList.status === 2,
                maintenance: shortBeatList.status === 3,
                big: size === 'big',
                small: size === 'small',
            }"
        ></div>
    </div>
</template>

<script>
export default {
    props: {
        /** Size of the heartbeat bar */
        size: {
            type: String,
            default: "big",
        },
        /** ID of the monitor */
        monitorId: {
            type: Number,
            required: true,
        },
        /** Array of the monitors heartbeats */
        heartbeatList: {
            type: Array,
            default: null,
        },
    },
    data() {
        return {};
    },
    computed: {
        /**
         * If heartbeatList is null, get it from $root.heartbeatList
         */
        beatList() {
            if (this.heartbeatList === null) {
                //console.log(this.$root.heartbeatList[5]);
                return this.$root.heartbeatList[this.monitorId];
            } else {
                return this.heartbeatList;
            }
        },

        shortBeatList() {
            if (!this.beatList) {
                return null;
            }

            const latestBeat = this.beatList[this.beatList.length - 1];

            if (!latestBeat) {
                return null;
            }

            console.log("beatlist" + JSON.stringify(latestBeat));
            console.log(latestBeat.status);
            return latestBeat;
        },
    },
    watch: {
        beatList: {
            handler(val, oldVal) {
                this.move = true;

                setTimeout(() => {
                    this.move = false;
                }, 300);
            },
            deep: true,
        },
    },
    unmounted() {
        window.removeEventListener("resize", this.resize);
    },
    beforeMount() {
        if (this.heartbeatList === null) {
            if (!(this.monitorId in this.$root.heartbeatList)) {
                this.$root.heartbeatList[this.monitorId] = [];
            }
        }
    },

    mounted() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
@import "../../assets/vars.scss";
.StatusSymbol {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__icon {
        border-radius: 3.125rem;
    }
}

.down {
    background-color: $danger;
}
.active {
    background-color: $primary;
}

.pending {
    background-color: $warning;
}

.maintenance {
    background-color: $maintenance;
}

.empty {
    background-color: aliceblue;
}

.big {
    width: 3.125rem;
    height: 3.125rem;
}

.small {
    width: 20px;
    height: 20px;
}
</style>
