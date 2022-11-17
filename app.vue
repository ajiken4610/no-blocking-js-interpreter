<template lang="pug">
.py-4.h-100
  UiGrid.h-100
    UiGridCell.position-relative(:columns="{ desktop: 6 }")
      UiTextfield.position-absolute.top-0.bottom-0(
        inputType="textarea",
        :fullwidth="true",
        v-model="code"
      )
      .position-absolute.bottom-0.end-0.m-2
        UiFab(icon="play_arrow", @click="run", :exited="running")
    UiGridCell.position-relative(:columns="{ desktop: 6 }")
      .overflow-auto.position-absolute.top-0.bottom-0.w-100(ref="scroller")
        .border-bottom(v-for="row of runResult") {{ row.args.join(" ") }}
</template>

<script setup lang="ts">
const worker = useRunWorker();
const code = useSourceCode();
const running = ref(false);
interface Message {
  args: any[];
  method: string;
}
interface PostedMessage {
  type: "console" | "finish";
  message: Message;
}

worker.addEventListener("message", (e) => {
  const message = e.data as PostedMessage;
  if (message.type === "console") {
    runResult.push(message.message);
    nextTick(() => {
      scroller.value &&
        (scroller.value.scrollTop = scroller.value.scrollHeight);
    });
  } else if (message.type === "finish") {
    running.value = false;
  }
});
const run = () => {
  running.value = true;
  runResult.length = 0;
  worker.postMessage(code.value);
};
const runResult: Message[] = reactive([]);
const scroller = ref<HTMLDivElement>();
</script>

<style lang="scss">
html,
body,
body > * {
  height: 100%;
}

.mdc-text-field__resizer {
  visibility: hidden;
}
.mdc-text-field__resizer > * {
  visibility: visible;
}

// 1. Include functions first (so you can manipulate colors, SVGs, calc, etc)
@import "bootstrap/scss/functions";
// 2. Include any default variable overrides here
// Default variable overrides

$grid-breakpoints: (
  phone: 0,
  tablet: 600px,
  desktop: 840px,
);
$container-max-widths: (
  phone: 584px,
  tablet: 808px,
  desktop: 1000px,
);

// 3. Include remainder of required Bootstrap stylesheets
@import "bootstrap/scss/variables";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/maps";
// 4. Include any optional Bootstrap components as you like
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/containers";
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/type";
@import "bootstrap/scss/helpers";
@import "bootstrap/scss/utilities/api";
</style>
