<template>
    <div class="addon">
        <div class="addon__name">
            <img :src="img" alt="addon logo" />

            <p>{{ name }}</p>
        </div>
        <div class="addon__status"></div>
        <div v-if="update === 1" class="addon__update">
            <AddonUpdateButton
                :id="id"
                :slug="slug"
                :name="name"
                @update-parent="updateParentState"
            ></AddonUpdateButton>
        </div>
    </div>
</template>
<script>
import AddonUpdateButton from "./AddonUpdateButton.vue";

export default {
    components: {
        AddonUpdateButton,
    },
    props: {
        img: {
            type: String,
            default: "../../../public/Homate.jpg",
        },
        name: {
            type: String,
            required: true,
        },
        updateAvailable: {
            type: Number,
            default: 0,
        },
        slug: {
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
            update: this.updateAvailable,
        };
    },
    methods: {
        updateParentState(newValue) {
            this.update = newValue;
        },
    },
};
</script>
<style lang="scss" scoped>
.addon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &__name {
        display: flex;
        flex-direction: row;

        p {
            align-self: center;
            margin: 0;
        }

        img {
            width: 4.375rem;
            height: 4.375rem;
        }
    }
}
</style>
