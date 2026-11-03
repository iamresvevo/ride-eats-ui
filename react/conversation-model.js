export function groupMessages(messages, windowMs = 300000) {
  const clock = (value) => {
    const m = typeof value === "string" && value.match(/^(\d{1,2}):(\d{2})$/);
    return m && +m[1] < 24 && +m[2] < 60 ? (+m[1] * 60 + +m[2]) * 60000 : NaN;
  };
  return messages.map((message, index) => {
    const before = messages[index - 1];
    let grouped = false;
    if (
      before &&
      message.type !== "system" &&
      before.type !== "system" &&
      (message.authorId || message.author) ===
        (before.authorId || before.author) &&
      !!message.own === !!before.own &&
      message.groupWithPrevious !== false
    ) {
      const currentTime = message.dateTime
          ? Date.parse(message.dateTime)
          : clock(message.time),
        previousTime = before.dateTime
          ? Date.parse(before.dateTime)
          : clock(before.time);
      const distance = currentTime - previousTime;
      grouped =
        message.groupWithPrevious === true ||
        (Number.isFinite(distance) && distance >= 0 && distance <= windowMs);
    }
    return { message, grouped };
  });
}
