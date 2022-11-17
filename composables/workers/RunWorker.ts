const customizedConsole = new Proxy(
  {},
  {
    get(_target, key) {
      // @ts-ignore
      const current = console[key];
      if (typeof current === "function") {
        return (...args: any[]) => {
          postMessage({
            type: "console",
            message: { method: key, args },
          });
          current(...args);
        };
      } else {
        return current;
      }
    },
  }
);

addEventListener("message", async (message: MessageEvent<string>) => {
  const code = message.data;
  const codeFunc = new Function("console", code);
  await codeFunc(customizedConsole);
  postMessage({ type: "finish" });
});
