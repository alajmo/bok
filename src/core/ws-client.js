(function connect() {
  let ws = new WebSocket("ws://localhost:5001/websocket");
  let retryDelay = 1000;

  ws.onopen = (event) => {
    console.log("Live reload ready");
  };

  ws.onmessage = (event) => {
    let data = JSON.parse(event.data);

    switch (data.type) {
      case "build_complete":
        ws.close(1000, "[DOCS] Reloading site...");

        console.log("Reloading page after receiving build_complete");

        location.reload(true);
        break;
      default:
        console.log(`Don't know how to handle type '${data.type}'`);
    }
  };

  ws.onclose = (event) => {
    console.log(
      "Websocket connection closed or unable to connect; " +
        "starting reconnect timeout",
    );

    ws = null;

    setTimeout(connect, retryDelay);
  };

  ws.onerror = (err) => console.log("WebSocket error:", err.error);
})();
