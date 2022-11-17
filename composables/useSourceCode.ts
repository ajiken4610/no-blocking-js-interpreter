const sourceCode = ref(
  localStorage.getItem("code") ?? 'console.log("Hello,world!!");'
);
watchEffect(() => {
  localStorage.setItem("code", sourceCode.value);
});
export default () => sourceCode;
