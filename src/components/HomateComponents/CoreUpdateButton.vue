<template>
    <div class="update" @click="openModal">
        <font-awesome-icon icon="arrow-alt-circle-up" class="update__icon" />
        <p class="update__text">Nieuwe update!</p>
    </div>
    <div v-if="isModalOpen" ref="modal" class="modal">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            @click="cancel"
        >
            <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
        </svg>
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
        url: {
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
            monitorID: this.id,
            monitorURL: this.$root.monitorList[this.$route.params.id],
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
            try {
                this.$root
                    .getSocket()
                    .emit("updateCore", this.monitorURL, this.id, (res) => {
                        console.log(res);
                        this.$root.toastRes(res);
                    });
                this.$root.monitorList[
                    this.$route.params.id
                ].update_available = false;
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
    width: 10.125rem;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
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
    button {
        background-color: #5cdd8b;
        margin: 1rem;
        padding: 1rem;
        color: white;
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
</style>
