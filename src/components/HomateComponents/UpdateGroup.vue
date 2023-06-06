<template>
    <div>
        <div class="groupInfo">
            <img src="../../../public/Homate.jpg" />
            <h3>Naam</h3>
        </div>
        <div class="updateButton">
            <font-awesome-icon
                icon="arrow-alt-circle-up"
                class="update__icon"
            />Updaten
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss">
.groupInfo {
    color: white;
    img {
        width: 40px;
        height: 40px;
    }
}

.updateButton {
    color: white;
    background-color: #0dcaf0;
    padding: 0.5rem;
    border-color: #0dcaf0;
    border-radius: 50rem;
    cursor: pointer;
}

.updateButton:hover {
    background-color: #0c6f83;
}
</style>
