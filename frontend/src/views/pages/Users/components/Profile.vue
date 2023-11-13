<template>
  <div
    class="card multisteps-form__panel p-3 border-radius-xl bg-white"
    data-animation="FadeIn"
  >
    <h5 class="font-weight-bolder mb-0">Profile</h5>
    <div class="multisteps-form__content mt-4">
      <div class="row">
        <div class="col-12">
          <label>Licencias</label>
          <argon-input
            class="multisteps-form__input"
            type="text"
            placeholder="Use an address you don't use frequently."
          />
        </div>
        <div class="col-12">
          <argon-textarea
            id="bio"
            class="multisteps-form__textarea mt-0"
            placeholder="Say a few words about who you are or what you're working on."
            >Bio
          </argon-textarea>
        </div>
      </div>
      <div class="button-row d-flex mt-4">
        <argon-button
          type="button"
          color="light"
          variant="gradient"
          class="js-btn-prev"
          @click="this.$parent.prevStep"
          >Prev</argon-button
        >
        <argon-button
          type="button"
          color="dark"
          variant="gradient"
          class="ms-auto"
          >Send</argon-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import ArgonInput from "@/components/ArgonInput.vue"
import ArgonButton from "@/components/ArgonButton.vue"
import ArgonTextarea from "@/components/ArgonTextarea.vue"

export default {
  name: "Profile",
  components: {
    ArgonInput,
    ArgonButton,
    ArgonTextarea,
  },
}
</script>
