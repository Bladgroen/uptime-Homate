<template>
    <div class="user">
        <div class="userInfo">
            <p class="name">{{ name }}</p>
            <p class="role">{{ role }}</p>
        </div>

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            @click="cancel"
        >
            <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
        </svg>
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
};
</script>
<style lang="scss" scoped>
.user {
    display: flex;
    align-self: center;
    margin-bottom: 1.5rem;
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
</style>
