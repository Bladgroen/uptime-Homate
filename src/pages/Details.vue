<template>
    <transition name="slide-fade" appear>
        <div v-if="monitor">
            <h1>{{ monitor.name }}</h1>
            <p v-if="monitor.description">{{ monitor.description }}</p>
            <div class="tags">
                <Tag
                    v-for="tag in monitor.tags"
                    :key="tag.id"
                    :item="tag"
                    :size="'sm'"
                />
            </div>
            <p class="url">
                <a
                    v-if="monitor.type === 'http' || monitor.type === 'keyword'"
                    :href="monitor.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ monitor.url }}</a
                >
                <span v-if="monitor.type === 'port'"
                    >TCP Port {{ monitor.hostname }}:{{ monitor.port }}</span
                >
                <span v-if="monitor.type === 'ping'"
                    >Ping: {{ monitor.hostname }}</span
                >
                <span v-if="monitor.type === 'keyword'">
                    <br />
                    <span>{{ $t("Keyword") }}:</span>
                    <span class="keyword">{{ monitor.keyword }}</span>
                </span>
                <span v-if="monitor.type === 'dns'"
                    >[{{ monitor.dns_resolve_type }}] {{ monitor.hostname }}
                    <br />
                    <span>{{ $t("Last Result") }}:</span>
                    <span class="keyword">{{ monitor.dns_last_result }}</span>
                </span>
            </p>
            <div v-if="monitor.update_available === true">
                <CoreUpdateButton
                    :id="monitor.id"
                    :url="monitor.url"
                ></CoreUpdateButton>
            </div>

            <div class="functions">
                <div class="btn-group" role="group">
                    <button
                        v-if="monitor.active"
                        class="btn btn-normal"
                        @click="pauseDialog"
                    >
                        <font-awesome-icon icon="pause" /> {{ $t("Pause") }}
                    </button>
                    <button
                        v-if="!monitor.active"
                        class="btn btn-primary"
                        @click="resumeMonitor"
                    >
                        <font-awesome-icon icon="play" /> {{ $t("Resume") }}
                    </button>
                    <router-link
                        :to="'/edit/' + monitor.id"
                        class="btn btn-normal"
                    >
                        <font-awesome-icon icon="edit" /> {{ $t("Edit") }}
                    </router-link>
                    <router-link
                        :to="'/clone/' + monitor.id"
                        class="btn btn-normal"
                    >
                        <font-awesome-icon icon="clone" /> {{ $t("Clone") }}
                    </router-link>
                    <button class="btn btn-danger" @click="deleteDialog">
                        <font-awesome-icon icon="trash" /> {{ $t("Delete") }}
                    </button>
                </div>
            </div>

            <!-- uptime -->
            <div class="shadow-box uptime">
                <div class="row">
                    <div class="openPingChart" @click="openModal">
                        <p class="uptime__title">Status</p>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 512 512"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="32"
                                d="M384 224v184a40 40 0 0 1-40 40H104a40 40 0 0 1-40-40V168a40 40 0 0 1 40-40h167.48M336 64h112v112M224 288L440 72"
                            />
                        </svg>
                    </div>

                    <HAStatus :monitor-id="monitor.id"></HAStatus>
                </div>
                <div class="row">
                    <p class="uptime__title">CPU</p>
                    <HASUsage :cpuUsage="cpuUsage"></HASUsage>
                </div>
                <div class="row">
                    <p class="uptime__title">Memory</p>
                    <HAMemory
                        title="memory"
                        :memoryUsage="memoryUsage"
                    ></HAMemory>
                </div>
            </div>

            <!-- Cert Info Box -->
            <transition name="slide-fade" appear>
                <div
                    v-if="showCertInfoBox"
                    class="shadow-box big-padding text-center"
                >
                    <div class="row">
                        <div class="col">
                            <certificate-info
                                :certInfo="tlsInfo.certInfo"
                                :valid="tlsInfo.valid"
                            />
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Ping Chart -->
            <div
                v-if="isModalOpen"
                ref="modal"
                class="modal"
                :class="{ show: isModalOpen }"
            >
                <div
                    v-if="showPingChartBox"
                    class="shadow-box big-padding text-center ping-chart-wrapper pingmodal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        @click="cancel"
                    >
                        <path
                            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                        />
                    </svg>
                    <div class="row">
                        <div class="col">
                            <PingChart :monitor-id="monitor.id" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <AddonList
                    :addonList="$root.addOnList[$route.params.id]"
                ></AddonList>
            </div>

            <div class="shadow-box table-shadow-box">
                <div class="dropdown dropdown-clear-data">
                    <button
                        class="btn btn-sm btn-outline-danger dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        <font-awesome-icon icon="trash" />
                        {{ $t("Clear Data") }}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button
                                type="button"
                                class="dropdown-item"
                                @click="clearEventsDialog"
                            >
                                {{ $t("Events") }}
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                class="dropdown-item"
                                @click="clearHeartbeatsDialog"
                            >
                                {{ $t("Heartbeats") }}
                            </button>
                        </li>
                    </ul>
                </div>
                <table class="table table-borderless table-hover">
                    <thead>
                        <tr>
                            <th>{{ $t("Status") }}</th>
                            <th>{{ $t("DateTime") }}</th>
                            <th>{{ $t("Message") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(beat, index) in displayedRecords"
                            :key="index"
                            :class="{ 'shadow-box': $root.windowWidth <= 550 }"
                            style="padding: 10px"
                        >
                            <td><Status :status="beat.status" /></td>
                            <td :class="{ 'border-0': !beat.msg }">
                                <Datetime :value="beat.time" />
                            </td>
                            <td class="border-0">{{ beat.msg }}</td>
                        </tr>

                        <tr v-if="importantHeartBeatList.length === 0">
                            <td colspan="3">
                                {{ $t("No important events") }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="d-flex justify-content-center kuma_pagination">
                    <pagination
                        v-model="page"
                        :records="importantHeartBeatList.length"
                        :per-page="perPage"
                        :options="paginationConfig"
                    />
                </div>
            </div>

            <Confirm
                ref="confirmPause"
                :yes-text="$t('Yes')"
                :no-text="$t('No')"
                @yes="pauseMonitor"
            >
                {{ $t("pauseMonitorMsg") }}
            </Confirm>

            <Confirm
                ref="confirmDelete"
                btn-style="btn-danger"
                :yes-text="$t('Yes')"
                :no-text="$t('No')"
                @yes="deleteMonitor"
            >
                {{ $t("deleteMonitorMsg") }}
            </Confirm>

            <Confirm
                ref="confirmClearEvents"
                btn-style="btn-danger"
                :yes-text="$t('Yes')"
                :no-text="$t('No')"
                @yes="clearEvents"
            >
                {{ $t("clearEventsMsg") }}
            </Confirm>

            <Confirm
                ref="confirmClearHeartbeats"
                btn-style="btn-danger"
                :yes-text="$t('Yes')"
                :no-text="$t('No')"
                @yes="clearHeartbeats"
            >
                {{ $t("clearHeartbeatsMsg") }}
            </Confirm>
        </div>
    </transition>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { useToast } from "vue-toastification";
const toast = useToast();
import Confirm from "../components/Confirm.vue";
import Status from "../components/Status.vue";
import Datetime from "../components/Datetime.vue";
import Pagination from "v-pagination-3";
const PingChart = defineAsyncComponent(() =>
    import("../components/PingChart.vue")
);
import Tag from "../components/Tag.vue";
import CertificateInfo from "../components/CertificateInfo.vue";
import HAStatus from "../components/HomateComponents/HAStatus.vue";
import HASUsage from "../components/HomateComponents/HAUsage.vue";
import AddonList from "../components/HomateComponents/AddonList.vue";
import HAMemory from "../components/HomateComponents/HAMemory.vue";
import CoreUpdateButton from "../components/HomateComponents/CoreUpdateButton.vue";

export default {
    components: {
        Datetime,
        Confirm,
        Status,
        Pagination,
        PingChart,
        Tag,
        CertificateInfo,
        HAStatus,
        HASUsage,
        AddonList,
        HAMemory,
        CoreUpdateButton,
    },
    data() {
        return {
            page: 1,
            perPage: 25,
            heartBeatList: [],
            toggleCertInfoBox: false,
            showPingChartBox: true,
            paginationConfig: {
                hideCount: true,
                chunksNavigation: "scroll",
            },
            cpuUsage: null,
            memoryUsage: null,
            monitorURL: this.$root.monitorList[this.$route.params.id],
            varFromRoute: null,
            isModalOpen: false,
            isTokenModalOpen: false,
        };
    },
    computed: {
        monitor() {
            let id = this.$route.params.id;
            return this.$root.monitorList[id];
        },

        lastHeartBeat() {
            if (
                this.monitor.id in this.$root.lastHeartbeatList &&
                this.$root.lastHeartbeatList[this.monitor.id]
            ) {
                return this.$root.lastHeartbeatList[this.monitor.id];
            }

            return {
                status: -1,
            };
        },

        ping() {
            if (this.lastHeartBeat.ping || this.lastHeartBeat.ping === 0) {
                return this.lastHeartBeat.ping;
            }

            return this.$t("notAvailableShort");
        },

        avgPing() {
            if (
                this.$root.avgPingList[this.monitor.id] ||
                this.$root.avgPingList[this.monitor.id] === 0
            ) {
                return this.$root.avgPingList[this.monitor.id];
            }

            return this.$t("notAvailableShort");
        },

        importantHeartBeatList() {
            if (this.$root.importantHeartbeatList[this.monitor.id]) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.heartBeatList =
                    this.$root.importantHeartbeatList[this.monitor.id];
                return this.$root.importantHeartbeatList[this.monitor.id];
            }

            return [];
        },

        status() {
            if (this.$root.statusList[this.monitor.id]) {
                return this.$root.statusList[this.monitor.id];
            }

            return {};
        },

        tlsInfo() {
            // Add: this.$root.tlsInfoList[this.monitor.id].certInfo
            // Fix: TypeError: Cannot read properties of undefined (reading 'validTo')
            // Reason: TLS Info object format is changed in 1.8.0, if for some reason, it cannot connect to the site after update to 1.8.0, the object is still in the old format.
            if (
                this.$root.tlsInfoList[this.monitor.id] &&
                this.$root.tlsInfoList[this.monitor.id].certInfo
            ) {
                return this.$root.tlsInfoList[this.monitor.id];
            }

            return null;
        },

        showCertInfoBox() {
            return this.tlsInfo != null && this.toggleCertInfoBox;
        },

        displayedRecords() {
            const startIndex = this.perPage * (this.page - 1);
            const endIndex = startIndex + this.perPage;
            return this.heartBeatList.slice(startIndex, endIndex);
        },
    },

    beforeMount() {
        document.removeEventListener("mousedown", this.handeClickOutside);
    },
    created() {},

    mounted() {
        this.getUsageData();
        this.checkTokenInDatabase();
    },

    beforeUnmount() {},
    methods: {
        /** Request a test notification be sent for this monitor */
        testNotification() {
            this.$root.getSocket().emit("testNotification", this.monitor.id);
            toast.success("Test notification is requested.");
        },

        checkTokenInDatabase() {
            console.log("token method");
            try {
                this.$root.getSocket().emit("checkToken");
                this.$root.getSocket().on("checkedToken", (data) => {
                    console.log(data);
                });
            } catch (e) {
                console.log(e.message);
            }
        },

        getUsageData() {
            try {
                this.$root.getSocket().emit("getUsage", this.$route.params.id);
                this.$root.getSocket().on("usageData", (data) => {
                    console.log(data);
                    let { cpuUsage, memoryUsage } = data;

                    this.cpuUsage = cpuUsage;
                    this.memoryUsage = memoryUsage;
                });
                this.$root.getSocket().on("usageError", (errorData) => {
                    console.log("Error occurred:", errorData.error);
                    this.cpuUsage = 0;
                    this.memoryUsage = 0;
                });
            } catch (e) {
                console.log(e.message);
            }
        },

        /** Show dialog to confirm pause */
        pauseDialog() {
            this.$refs.confirmPause.show();
        },

        /** Resume this monitor */
        resumeMonitor() {
            this.$root
                .getSocket()
                .emit("resumeMonitor", this.monitor.id, (res) => {
                    this.$root.toastRes(res);
                });
        },

        /** Request that this monitor is paused */
        pauseMonitor() {
            this.$root
                .getSocket()
                .emit("pauseMonitor", this.monitor.id, (res) => {
                    this.$root.toastRes(res);
                });
        },

        /** Show dialog to confirm deletion */
        deleteDialog() {
            this.$refs.confirmDelete.show();
        },

        /** Show dialog to confirm clearing events */
        clearEventsDialog() {
            this.$refs.confirmClearEvents.show();
        },

        /** Show dialog to confirm clearing heartbeats */
        clearHeartbeatsDialog() {
            this.$refs.confirmClearHeartbeats.show();
        },

        /** Request that this monitor is deleted */
        deleteMonitor() {
            this.$root.deleteMonitor(this.monitor.id, (res) => {
                if (res.ok) {
                    toast.success(res.msg);
                    this.$router.push("/dashboard");
                } else {
                    toast.error(res.msg);
                }
            });
        },

        /** Request that this monitors events are cleared */
        clearEvents() {
            this.$root.clearEvents(this.monitor.id, (res) => {
                if (!res.ok) {
                    toast.error(res.msg);
                }
            });
        },

        /** Request that this monitors heartbeats are cleared */
        clearHeartbeats() {
            this.$root.clearHeartbeats(this.monitor.id, (res) => {
                if (!res.ok) {
                    toast.error(res.msg);
                }
            });
        },

        /**
         * Return the correct title for the ping stat
         * @param {boolean} [average=false] Is the statistic an average?
         * @returns {string} Title formated dependant on monitor type
         */
        pingTitle(average = false) {
            let translationPrefix = "";
            if (average) {
                translationPrefix = "Avg. ";
            }

            if (this.monitor.type === "http") {
                return this.$t(translationPrefix + "Response");
            }

            return this.$t(translationPrefix + "Ping");
        },

        cancel() {
            this.isModalOpen = false;
            console.log("modal closed");
            document.removeEventListener("mousedown", this.handleClickOutside);
        },

        handleClickOutside(event) {
            if (this.$refs.modal && !this.$refs.modal.contains(event.target)) {
                this.cancel();
            }
        },

        openModal() {
            this.isModalOpen = true;
            console.log("open modal");
            document.addEventListener("mousedown", this.handleClickOutside);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.btn-group {
    position: inherit;
}

.btn {
    position: inherit;
}

@media (max-width: 767px) {
    .badge {
        margin-top: 14px;
    }
}

@media (max-width: 550px) {
    .functions {
        text-align: center;
    }

    .ping-chart-wrapper {
        padding: 10px !important;
    }

    .dropdown-clear-data {
        margin-bottom: 10px;
    }
}

@media (max-width: 400px) {
    .btn {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;
    }

    a.btn {
        padding-left: 25px;
        padding-right: 25px;
    }

    .dropdown-clear-data {
        button {
            display: block;
            padding-top: 4px;
        }
    }
}

.url {
    color: $primary;
    margin-bottom: 20px;
    font-weight: bold;

    a {
        color: $primary;
    }
}

.uptime {
    display: flex;
    justify-content: space-around;
    &__title {
        font-size: 2rem;
    }
}

.shadow-box {
    padding: 20px;
    margin-top: 25px;
    .row {
        text-align: center;
    }
}

.word {
    color: #aaa;
    font-size: 14px;
}

table {
    font-size: 14px;

    tr {
        transition: all ease-in-out 0.2ms;
    }
}

.stats p {
    font-size: 13px;
    color: #aaa;
}

.stats {
    padding: 10px;

    .col {
        margin: 20px 0;
    }
}

.keyword {
    color: black;
}

.dropdown-clear-data {
    float: right;

    ul {
        width: 100%;
        min-width: unset;
        padding-left: 0;
    }
}

.dark {
    .keyword {
        color: $dark-font-color;
    }

    .dropdown-clear-data {
        ul {
            background-color: $dark-bg;
            border-color: $dark-bg2;
            border-width: 2px;

            li button {
                color: $dark-font-color;
            }

            li button:hover {
                background-color: $dark-bg2;
            }
        }
    }
}

.tags {
    margin-bottom: 0.5rem;
}

.tags > div:first-child {
    margin-left: 0 !important;
}

.openPingChart {
    display: flex;
    justify-content: center;
    cursor: pointer;
    svg {
        align-self: center;
        margin-bottom: 1rem;
        padding-left: 0.5rem;
    }
}

.modal {
    display: none;
    flex-direction: column;
    border: black 1px solid;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    padding: 2rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* Add other styles as needed */
    width: 100%; /* Adjust the width as desired */ /* Set a maximum width if needed */
    height: 60%;
    background-color: #0d1117;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    text-align: center;
    cursor: pointer;
    svg {
        position: absolute;
        top: 10px;
        right: 30px;
        width: 30px;
        fill: #b1b8c0;
        cursor: pointer;
    }
}

.modal:hover {
}

.pingmodal {
    width: 100%;
}

.modal.show {
    display: flex;
}
</style>
