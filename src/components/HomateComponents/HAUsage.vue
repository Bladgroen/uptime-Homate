<template>
    <div class="StatusSymbol">
        <p>{{ propdata.usage }}%</p>
    </div>
</template>

<script setup>
import { defineProps, computed, watch, ref } from "@vue/runtime-core";

const propdata = defineProps({
    usage: {
        type: Number,
        default: 0,
    },
});
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
