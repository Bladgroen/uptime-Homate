<template>
    <div class="update" @click="openModal">
        <font-awesome-icon icon="arrow-alt-circle-up" class="update__icon" />
        <p class="update__text">Nieuwe update!</p>
    </div>
    <div v-if="isModalOpen" ref="modal" class="modal">
        <h2>Wil je {{ name }} updaten?</h2>
        <div class="modal__buttons">
            <button @click="next">Doorgaan</button>
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
        async next() {
            this.isModalOpen = false;
            document.removeEventListener("mousedown", this.handleClickOutside);
            console.log("next ingedrukt");
            this.$root
                .getSocket()
                .emit(
                    "updateAddon",
                    this.addonSlug,
                    this.monitorURL,
                    this.addonID,
                    (res) => {
                        console.log(res);
                        this.$root.toastRes(res);
                    }
                );
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
    },
};
</script>

<style lang="scss" scoped>
.update {
    display: flex;
    color: white;
    align-items: center;
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
    display: flex;
    flex-direction: column;
    position: fixed;
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
}
</style>
