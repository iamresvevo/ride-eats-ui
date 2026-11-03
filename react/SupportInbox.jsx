import React, { useEffect, useRef, useState } from "react";
import { Button, Badge } from "./index.jsx";
import Avatar from "./send/AccountAvatar.jsx";
import Icon from "./send/Icon.jsx";
import { Textarea } from "./forms.jsx";
import { groupMessages } from "./conversation-model.js";

export function SupportInbox({
  threads,
  value,
  onValueChange,
  onReply,
  label = "Support inbox",
  template = "bubbles",
  density = "default",
  showAvatars = true,
  groupConsecutive = true,
  groupWindow = 300000,
  showSidebar = true,
  sidebarWidth = 244,
  height = 400,
  renderThread,
  renderHeader,
  renderMessage,
  renderMessageActions,
  renderComposer,
  composerPlaceholder,
  composerHint,
  className = "",
  style,
}) {
  const selected = threads.find((thread) => thread.id === value),
    [query, setQuery] = useState(""),
    [drafts, setDrafts] = useState({}),
    [sending, setSending] = useState({}),
    [errors, setErrors] = useState({});
  const busy = useRef(new Set()),
    messages = useRef(null),
    stick = useRef(true),
    previousThread = useRef(null),
    draft = drafts[value] || "",
    pending = !!sending[value];
  const visible = threads.filter((thread) =>
    `${thread.name} ${thread.subject || ""} ${thread.group || ""}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  const messageCount = selected?.messages.length;
  useEffect(() => {
    const node = messages.current;
    if (node && (previousThread.current !== value || stick.current))
      node.scrollTop = node.scrollHeight;
    previousThread.current = value;
  }, [value, messageCount, template, density, showAvatars]);
  const setDraft = (text) => setDrafts((old) => ({ ...old, [value]: text }));
  const send = async (event) => {
    event?.preventDefault();
    const threadId = value,
      text = draft.trim();
    if (!text || busy.current.has(threadId) || !onReply) return;
    busy.current.add(threadId);
    stick.current = true;
    setSending((old) => ({ ...old, [threadId]: true }));
    setErrors((old) => ({ ...old, [threadId]: "" }));
    try {
      await onReply(threadId, text);
      setDrafts((old) => ({
        ...old,
        [threadId]: old[threadId]?.trim() === text ? "" : old[threadId],
      }));
    } catch (reason) {
      setErrors((old) => ({
        ...old,
        [threadId]: reason?.message || "Unable to send message.",
      }));
    } finally {
      busy.current.delete(threadId);
      setSending((old) => ({ ...old, [threadId]: false }));
    }
  };
  const identity = (thread) =>
    thread.kind === "channel" ? (
      <span className="re-support-channel-icon">
        <Icon name="hash" />
      </span>
    ) : thread.kind === "group" && !thread.avatar ? (
      <span className="re-support-channel-icon">
        <Icon name="users" />
      </span>
    ) : (
      <Avatar name={thread.name} src={thread.avatar} />
    );
  const rows = groupMessages(selected?.messages || [], groupWindow);
  const composerContext = {
    thread: selected,
    value: draft,
    onValueChange: setDraft,
    onSend: () => send(),
    pending,
    error: errors[value] || "",
  };
  return (
    <section
      className={`re-support ${className}`}
      data-template={template}
      data-density={density}
      data-sidebar={showSidebar || undefined}
      style={{
        "--support-sidebar": `${sidebarWidth}px`,
        "--support-height": typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      aria-label={label}
    >
      {showSidebar && (
        <aside>
          <div className="re-support-heading">
            <h2>{label}</h2>
            <Badge className="re-support-count">{threads.length}</Badge>
          </div>
          <label className="re-grid-search re-support-search">
            <Icon name="search" />
            <input
              type="search"
              aria-label={`Search ${label}`}
              placeholder="Find a conversation…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div role="list" aria-label="Conversations">
            {visible.map((thread, index) => (
              <div role="listitem" key={thread.id}>
                {thread.group && thread.group !== visible[index - 1]?.group && (
                  <h3 className="re-support-group-title">{thread.group}</h3>
                )}
                <button
                  type="button"
                  aria-current={value === thread.id ? "true" : undefined}
                  onClick={() => onValueChange(thread.id)}
                >
                  {renderThread ? (
                    renderThread(thread, { selected: value === thread.id })
                  ) : (
                    <>
                      {identity(thread)}
                      <span className="re-support-summary">
                        <span className="re-support-row-title">
                          <strong>{thread.name}</strong>
                          {thread.unread > 0 ? (
                            <Badge className="re-support-count">
                              {thread.unread}
                            </Badge>
                          ) : (
                            thread.time && <time>{thread.time}</time>
                          )}
                        </span>
                        {thread.subject && thread.subject !== thread.name && (
                          <small>{thread.subject}</small>
                        )}
                        {thread.status && (
                          <span
                            className="re-support-status"
                            data-open={thread.status === "Open" || undefined}
                          >
                            <i aria-hidden="true" />
                            {thread.status}
                            {drafts[thread.id] && <span> · Draft</span>}
                          </span>
                        )}
                        {!thread.status && drafts[thread.id] && (
                          <small>Draft</small>
                        )}
                      </span>
                    </>
                  )}
                </button>
              </div>
            ))}
            {!visible.length && (
              <p className="re-platform-empty">
                {threads.length
                  ? "No matching conversations."
                  : "No conversations yet."}
              </p>
            )}
          </div>
        </aside>
      )}
      <div className="re-support-thread">
        {selected ? (
          <>
            <header>
              {renderHeader ? (
                renderHeader(selected)
              ) : (
                <>
                  {identity(selected)}
                  <div>
                    <strong>{selected.subject || selected.name}</strong>
                    <small>
                      {selected.kind === "group" || selected.kind === "channel"
                        ? selected.description ||
                          (selected.participants?.length
                            ? `${selected.participants.length} members`
                            : selected.name)
                        : selected.name}
                    </small>
                  </div>
                  {selected.status && (
                    <Badge
                      tone={selected.status === "Open" ? "good" : "neutral"}
                    >
                      {selected.status}
                    </Badge>
                  )}
                </>
              )}
            </header>
            <ol
              key={selected.id}
              ref={messages}
              aria-label={`Messages with ${selected.name}`}
              aria-live="polite"
              aria-relevant="additions text"
              onScroll={(event) => {
                const node = event.currentTarget;
                stick.current =
                  node.scrollHeight - node.scrollTop - node.clientHeight < 48;
              }}
            >
              {rows.map(({ message, grouped: canGroup }) => {
                const grouped =
                    template === "channel" && groupConsecutive && canGroup,
                  participant = selected.participants?.find(
                    (person) =>
                      person.id === message.authorId ||
                      person.name === message.author,
                  );
                return message.type === "system" ? (
                  <li key={message.id} className="re-support-system">
                    <span>{message.text}</span>
                    <time dateTime={message.dateTime}>{message.time}</time>
                  </li>
                ) : (
                  <li
                    key={message.id}
                    data-own={message.own || undefined}
                    data-grouped={grouped || undefined}
                  >
                    {showAvatars && (
                      <span
                        className="re-support-message-avatar"
                        data-hidden={grouped || undefined}
                      >
                        <Avatar
                          name={message.author}
                          src={message.avatar || participant?.avatar}
                        />
                      </span>
                    )}
                    <div className="re-support-message-body">
                      {!grouped ? (
                        <div className="re-support-message-meta">
                          <strong>{message.author}</strong>
                          <time dateTime={message.dateTime}>
                            {message.time}
                          </time>
                        </div>
                      ) : (
                        <span className="re-sr-only">{message.author}</span>
                      )}
                      {renderMessage ? (
                        renderMessage(message, { thread: selected, grouped })
                      ) : (
                        <p>{message.text}</p>
                      )}
                      {renderMessageActions && (
                        <div className="re-support-message-actions">
                          {renderMessageActions(message, selected)}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
              {!selected.messages.length && (
                <li className="re-support-no-messages">
                  Start the conversation with a message.
                </li>
              )}
            </ol>
            {onReply &&
              (renderComposer ? (
                <div className="re-support-custom-composer">
                  {renderComposer(composerContext)}
                </div>
              ) : (
                <form onSubmit={send}>
                  <Textarea
                    label={
                      selected.kind === "channel"
                        ? `Message ${selected.name}`
                        : `Reply to ${selected.name}`
                    }
                    rows={2}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={composerPlaceholder || "Write a message…"}
                    disabled={pending}
                    error={errors[value]}
                  />
                  <div className="re-support-compose-actions">
                    <span>{composerHint}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      icon="send"
                      loading={pending}
                      loadingLabel="Sending…"
                      disabled={!draft.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </form>
              ))}
          </>
        ) : (
          <div className="re-support-empty">
            <Icon name="messages-square" size={28} />
            <strong>
              {threads.length ? "Choose a conversation" : "Your inbox is clear"}
            </strong>
            <p>
              {threads.length
                ? "Open a thread to read and reply."
                : "New conversations will appear here."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
