<template>
    <div class="shadow-box mb-3" :style="boxStyle">
        <div class="list-header">
            <div class="updateMenu btn btn-primary mb-3" @click="openModal">
                <svg
                    data-v-a04674dc=""
                    class="svg-inline--fa fa-arrow-alt-circle-up fa-w-16"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="arrow-alt-circle-up"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                >
                    <path
                        class=""
                        fill="currentColor"
                        d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm292 116V256h70.9c10.7 0 16.1-13 8.5-20.5L264.5 121.2c-4.7-4.7-12.2-4.7-16.9 0l-115 114.3c-7.6 7.6-2.2 20.5 8.5 20.5H212v116c0 6.6 5.4 12 12 12h64c6.6 0 12-5.4 12-12z"
                    ></path>
                </svg>
                <div>Update menu</div>
                <div
                    v-if="isModalOpen"
                    ref="modal"
                    :class="{ show: isModalOpen }"
                    class="modal"
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
                    <h2 class="updateTitel">Update menu</h2>
                    <div></div>
                    <div>
                        <UpdateGroup></UpdateGroup>
                    </div>
                </div>
            </div>
            <div class="placeholder"></div>
            <div class="search-wrapper">
                <a v-if="searchText == ''" class="search-icon">
                    <font-awesome-icon icon="search" />
                </a>
                <a
                    v-if="searchText != ''"
                    class="search-icon"
                    @click="clearSearchText"
                >
                    <font-awesome-icon icon="times" />
                </a>
                <form>
                    <input
                        v-model="searchText"
                        class="form-control search-input"
                        :placeholder="$t('Search...')"
                        autocomplete="off"
                    />
                </form>
            </div>
        </div>

        <div class="monitor-list" :class="{ scrollbar: scrollbar }">
            <div class="selectAll">
                <input
                    :checked="selectAllCheckbox"
                    type="checkbox"
                    class="form-check-input"
                    @change="toggleSelectAll"
                />
                <p>Select all</p>
            </div>
            <div
                v-if="Object.keys($root.monitorList).length === 0"
                class="text-center mt-3"
            >
                {{ $t("No Monitors, please") }}
                <router-link to="/add">{{ $t("add one") }}</router-link>
            </div>
            <div
                v-for="(item, index) in sortedMonitorList"
                :key="index"
                class="checkboxWrapper"
            >
                <input
                    v-model="item.checked"
                    type="checkbox"
                    class="form-check-input"
                    @change="toggleCheckboxes"
                />
                <router-link
                    :to="monitorURL(item.id)"
                    class="item"
                    :class="{ disabled: !item.active }"
                    :title="item.description"
                >
                    <div class="row">
                        <div
                            class="col-9 col-md-8 small-padding"
                            :class="{
                                'monitor-item':
                                    $root.userHeartbeatBar == 'bottom' ||
                                    $root.userHeartbeatBar == 'none',
                            }"
                        >
                            <div class="info">
                                {{ item.name }}
                            </div>
                            <div class="tags">
                                <Tag
                                    v-for="tag in item.tags"
                                    :key="tag"
                                    :item="tag"
                                    :size="'sm'"
                                />
                            </div>
                        </div>
                        <div
                            v-show="$root.userHeartbeatBar == 'normal'"
                            :key="$root.userHeartbeatBar"
                            class="col-3 col-md-4 status"
                        >
                            <MonitorListStatus
                                :monitor-id="item.id"
                                size="small"
                            />
                            <div class="updateNotification">
                                <svg
                                    data-v-1796dc39=""
                                    class="svg-inline--fa fa-arrow-alt-circle-up fa-w-16 update__icon"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="arrow-alt-circle-up"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        class=""
                                        fill="currentColor"
                                        d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm292 116V256h70.9c10.7 0 16.1-13 8.5-20.5L264.5 121.2c-4.7-4.7-12.2-4.7-16.9 0l-115 114.3c-7.6 7.6-2.2 20.5 8.5 20.5H212v116c0 6.6 5.4 12 12 12h64c6.6 0 12-5.4 12-12z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div v-if="$root.userHeartbeatBar == 'bottom'" class="row">
                        <div class="col-12 bottom-style">
                            <HAStatus :monitor-id="item.id" size="small" />
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import HeartbeatBar from "../components/HeartbeatBar.vue";
import HAStatus from "../components/HomateComponents/HAStatus.vue";
import MonitorListStatus from "../components/HomateComponents/MonitorListStatus.vue";
import Tag from "../components/Tag.vue";
import Uptime from "../components/Uptime.vue";
import UpdateGroup from "../components/HomateComponents/UpdateGroup.vue";
import { getMonitorRelativeURL } from "../util.ts";

export default {
    components: {
        Tag,
        HAStatus,
        UpdateGroup,
        MonitorListStatus,
    },
    props: {
        /** Should the scrollbar be shown */
        scrollbar: {
            type: Boolean,
        },
    },
    data() {
        return {
            searchText: "",
            windowTop: 0,
            isModalOpen: false,
        };
    },
    computed: {
        /**
         * Improve the sticky appearance of the list by increasing its
         * height as user scrolls down.
         * Not used on mobile.
         */
        boxStyle() {
            if (window.innerWidth > 550) {
                return {
                    height: `calc(100vh - 160px + ${this.windowTop}px)`,
                };
            } else {
                return {
                    height: "calc(100vh - 160px)",
                };
            }
        },

        sortedMonitorList() {
            let result = Object.values(this.$root.monitorList);
            console.log(result.toString());

            result.sort((m1, m2) => {
                if (m1.active !== m2.active) {
                    if (m1.active === 0) {
                        return 1;
                    }

                    if (m2.active === 0) {
                        return -1;
                    }
                }

                if (m1.weight !== m2.weight) {
                    if (m1.weight > m2.weight) {
                        return -1;
                    }

                    if (m1.weight < m2.weight) {
                        return 1;
                    }
                }

                return m1.name.localeCompare(m2.name);
            });

            // Simple filter by search text
            // finds monitor name, tag name or tag value
            if (this.searchText !== "") {
                const loweredSearchText = this.searchText.toLowerCase();
                result = result.filter((monitor) => {
                    return (
                        monitor.name
                            .toLowerCase()
                            .includes(loweredSearchText) ||
                        monitor.tags.find(
                            (tag) =>
                                tag.name
                                    .toLowerCase()
                                    .includes(loweredSearchText) ||
                                tag.value
                                    ?.toLowerCase()
                                    .includes(loweredSearchText)
                        )
                    );
                });
            }
            const reactiveResult = result.map((item) => {
                return { ...item, checked: false };
            });

            return reactiveResult;
        },

        selectAllCheckbox: {
            get() {
                return (
                    this.sortedMonitorList.length > 0 &&
                    this.sortedMonitorList.every((item) => item.checked)
                );
            },
            set(value) {
                this.sortedMonitorList.forEach((item) => {
                    item.checked = value;
                });
            },
        },
    },
    mounted() {
        window.addEventListener("scroll", this.onScroll);
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    },
    methods: {
        /** Handle user scroll */
        onScroll() {
            if (window.top.scrollY <= 133) {
                this.windowTop = window.top.scrollY;
            } else {
                this.windowTop = 133;
            }
        },
        /**
         * Get URL of monitor
         * @param {number} id ID of monitor
         * @returns {string} Relative URL of monitor
         */
        monitorURL(id) {
            return getMonitorRelativeURL(id);
        },
        /** Clear the search bar */
        clearSearchText() {
            this.searchText = "";
        },

        toggleCheckboxes() {
            const areAllChecked = this.sortedMonitorList.every(
                (item) => item.checked
            );
            this.selectAllCheckbox = areAllChecked;
        },

        toggleSelectAll() {
            const selectAllValue = !this.selectAllCheckbox; // Invert the current value
            this.sortedMonitorList.forEach((item) => {
                item.checked = selectAllValue;
            });
            this.selectAllCheckbox = selectAllValue;
        },

        openModal() {
            this.isModalOpen = true;
            document.addEventListener("mousedown", this.handleClickOutside);
        },
        cancel() {
            this.isModalOpen = false;
            console.log("cancel");
            document.removeEventListener("mousedown", this.handleClickOutside);
        },
        handleClickOutside(event) {
            if (this.$refs.modal && !this.$refs.modal.contains(event.target)) {
                this.cancel();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.shadow-box {
    height: calc(100vh - 150px);
    position: sticky;
    top: 10px;
}
.item {
    flex: 1;
}
.small-padding {
    padding-left: 5px !important;
    padding-right: 5px !important;
}

.list-header {
    border-bottom: 1px solid #dee2e6;
    border-radius: 10px 10px 0 0;
    margin: -10px;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;

    .dark & {
        background-color: $dark-header-bg;
        border-bottom: 0;
    }
}

@media (max-width: 770px) {
    .list-header {
        margin: -20px;
        margin-bottom: 10px;
        padding: 5px;
    }
}

.search-wrapper {
    display: flex;
}

.search-icon {
    padding: 10px;
    color: #c0c0c0;

    // Clear filter button (X)
    svg[data-icon="times"] {
        cursor: pointer;
        transition: all ease-in-out 0.1s;

        &:hover {
            opacity: 0.5;
        }
    }
}

.search-input {
    max-width: 15em;
}

.monitor-item {
    width: 100%;
}

.tags {
    margin-top: 4px;
    padding-left: 67px;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
}

.bottom-style {
    padding-left: 67px;
    margin-top: 5px;
}

.checkboxWrapper {
    display: flex;
    align-items: center;
}

.updateMenu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
        margin-right: 0.5rem;
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
    width: 80%;
    max-width: 400px;
    height: 50%;
    background-color: #0d1117;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    text-align: center;

    h2 {
        padding-bottom: 1rem;
    }

    svg {
        position: absolute;
        top: 10px;
        right: 30px;
        width: 30px;
        fill: #b1b8c0;
        cursor: pointer;
    }
}
.modal.show {
    display: flex;
}

.updateTitel {
    color: white;
}

.status {
    display: flex;
    .updateNotification {
        display: flex;
        justify-content: center; /* Center horizontally */
        align-items: center;

        color: white;
        background-color: #0dcaf0;
        border-radius: 3.125rem;
        width: 25px;
        height: 25px;
        margin: 0 auto;
        svg {
            margin: 5px;
        }
    }
}

.selectAll {
    display: flex;
    input {
        margin-right: 1rem;
    }
}
</style>
