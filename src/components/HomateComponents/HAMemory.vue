<template>
    <div class="StatusSymbol">
        <p>{{ memoryUsage }}%</p>
    </div>
</template>

<script>
export default {
    props: {
        memoryUsage: {
            type: Number,
            default: 0
        },
    },
};
</script>

<style lang="scss">
.StatusSymbol {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
        font-size: 2rem;
    }
}
</style>
