<template>
    <div class="AddUser">
        <button class="AddUser_Button" @click="openModal">Add User</button>
    </div>

    <div
        v-if="isModalOpen"
        ref="modal"
        :class="{ show: isModalOpen }"
        class="modal"
        @click="cancel"
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
        <h2>Add User</h2>
        <input />
        <input />
        <button @click="next">Add</button>
        <button @click="cancel">Cancel</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isModalOpen: false,
        };
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
            document.addEventListener("mousedown", this.handleClickOutside);
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

<style lang="scss">
.AddUser {
    position: relative;
    z-index: 1;
    &_Button {
        background-color: #5cdd8b;
        color: black;
        padding: 0.375rem 0.75rem;
        border: none;
        border-radius: 50px;
        line-height: 1.5;
        cursor: pointer;
    }

    &_Button:hover {
        background-color: #7ce8a4;
    }
}

.modal {
    display: none;
    flex-direction: column;
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
    height: 40%;
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
</style>
