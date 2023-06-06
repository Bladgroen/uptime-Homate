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
        <div class="modal__buttons">
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
            this.isModalOpen = false;
            document.removeEventListener("mousedown", this.handleClickOutside);
            try {
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
                            if (res.ok) {
                                this.processing = true;
                                this.isModalOpen = false;
                                this.updateAddonRoot(this.addonID);
                            }
                        }
                    );
                this.updateParent();
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
            const index = this.$root.addOnList.findIndex(
                (obj) => obj._id === addonID
            );
            if (index !== -1) {
                this.$root.userList[index]._updateAvailable = 0;
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
</style>
