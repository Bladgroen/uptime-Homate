<template>
    <div class="update" @click="openModal">
        <font-awesome-icon icon="arrow-alt-circle-up" class="update__icon" />
        <p class="update__text">New Update!</p>
    </div>
    <div
        v-if="isModalOpen"
        ref="modal"
        class="modal"
        :class="{ show: isModalOpen }"
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
        <h2>Do you want to update {{ name }}?</h2>
        <div v-if="loading" class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div v-if="!loading" class="modal__buttons">
            <button type="submit" :disabled="processing" @click="next">
                Confirm
            </button>
            <button @click="cancel">Cancel</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        slug: {
            type: String,
            required: true,
        },
        name: {
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
            isModalOpen: false,
            addonID: this.id,
            monitorURL: this.$root.monitorList[this.$route.params.id],
            addonSlug: this.slug,
            processing: false,
            loading: false,
        };
    },
    beforeUnmount() {
        document.removeEventListener("mousedown", this.handeClickOutside);
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
            document.addEventListener("mousedown", this.handleClickOutside);
        },
        updateParent() {
            this.$emit("update-parent", 0);
        },
        async next() {
            this.loading = true;
            try {
                await new Promise((resolve, reject) => {
                    this.$root
                        .getSocket()
                        .emit(
                            "updateAddon",
                            this.addonSlug,
                            this.monitorURL,
                            this.addonID,
                            (res) => {
                                this.processing = false;
                                this.$root.toastRes(res);
                                console.log(this.loading);
                                resolve();
                            }
                        );
                });
                this.processing = true;

                this.updateAddonRoot(this.addonID);
                this.updateParent();
                this.isModalOpen = false;
            } catch (error) {
                console.log(error);
            }
        },
        cancel() {
            this.isModalOpen = false;
            document.removeEventListener("mousedown", this.handleClickOutside);
        },
        handleClickOutside(event) {
            if (this.$refs.modal && !this.$refs.modal.contains(event.target)) {
                this.cancel();
            }
        },
        updateAddonRoot(addonID) {
            const targetObject = this.$root.addOnList[
                this.$route.params.id
            ].find((obj) => obj._id === addonID);
            console.log(targetObject);
            if (targetObject) {
                console.log(targetObject._updateAvailable);

                Object.defineProperty(targetObject, "_updateAvailable", {
                    value: 0,
                    writable: true,
                    configurable: true,
                    enumerable: true,
                });
                console.log(this.$root.addOnList[this.$route.params.id]);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.update {
    display: flex;
    color: white;
    align-items: center;
    justify-content: space-around;
    background-color: #0dcaf0;
    border-color: #0dcaf0;
    padding: 0.5rem;
    border-radius: 50rem;
    cursor: pointer;
    &__text {
        margin: 0;
    }
}

.update:hover {
    background-color: #0c6f83;
}

.modal {
    display: none;
    flex-direction: column;
    position: fixed;
    border: black 1px solid;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    padding: 2rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* Add other styles as needed */
    width: 80%; /* Adjust the width as desired */
    max-width: 400px; /* Set a maximum width if needed */
    height: 40%;
    background-color: #0d1117;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    text-align: center;
    h2 {
        padding-bottom: 1rem;
    }
    button {
        background-color: #5cdd8b;
        margin: 1rem;
        padding: 1rem;
        color: black;
        border: none;
        border-radius: 50px;
        width: 6.25rem;
    }
    button:hover {
        background-color: #7ce8a4;
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

.lds-roller {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}
.lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
}
.lds-roller div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #5cdd8b;
    margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
}
.lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
}
.lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
}
.lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
}
.lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
}
.lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
}
.lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
}
.lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
}
@keyframes lds-roller {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
