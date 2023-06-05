<template>
    <div class="user">
        <div class="userInfo">
            <p class="name">{{ name }}</p>
            <p class="role">{{ role }}</p>
        </div>

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            @click="openModal"
        >
            <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
        </svg>

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
            <h2>
                Do you want to delete user
                <span class="username">{{ name }}</span
                >?
            </h2>

            <div>
                <button
                    class="addUserButton delete"
                    type="submit"
                    :disabled="processing"
                    data-cy="submit-setup-form"
                    @click="submit(userId)"
                >
                    Delete
                </button>
                <button class="addUserButton" @click="cancel">Cancel</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        userId: {
            type: Number,
            required: true,
        },
    },

    data() {
        return {
            isModalOpen: false,
            processing: false,
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
        submit(userID) {
            this.processing = true;

            this.$root.getSocket().emit("deleteUser", userID, (res) => {
                this.$root.toastRes(res);
                if (res.ok) {
                    this.isModalOpen = false;
                    this.deleteUserInRoot(userID);
                }
            });
        },
        deleteUserInRoot(userID) {
            const index = this.$root.userList.findIndex(
                (obj) => obj.id === userID
            );
            if (index !== -1) {
                this.$root.userList.splice(index, 1);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.user {
    display: flex;
    align-self: center;
    margin-bottom: 1.5rem;
}
.username {
    color: #5cdd8b;
}
.userInfo {
    display: flex;
    justify-content: center;
}

.name {
    font-size: 1.5rem;
    padding-right: 5rem;
    margin: 0;
    min-width: 10rem;
    max-width: 10rem;
}

.role {
    font-size: 1.5rem;
    padding-right: 1rem;
    margin: 0;
    min-width: 8rem;
    max-width: 8rem;
}

svg {
    width: 30px;
    fill: red;
    cursor: pointer;
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
    height: 80%;
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

.addUserButton {
    background-color: #5cdd8b;
    margin: 1rem;
    padding: 1rem;
    color: black;
    border: none;
    border-radius: 50px;
    width: 6.25rem;
}

.addUserButton:hover {
    background-color: #7ce8a4;
}

.delete {
    background-color: red !important;
    color: white;
}
.delete:hover {
    background-color: rgb(158, 5, 5) !important;
}
</style>
