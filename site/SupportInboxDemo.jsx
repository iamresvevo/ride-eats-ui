import React, { useState } from "react";
import {
  SupportInbox,
  Segmented,
  Flex,
  Switch,
  Button,
  useToast,
} from "../react/index.jsx";
const people = [
  { id: "alex", name: "Alex Rivera" },
  { id: "sam", name: "Sam Chen" },
  { id: "jordan", name: "Jordan Lee" },
];
const initial = [
  {
    id: "room",
    kind: "channel",
    group: "Channels",
    name: "design-room",
    subject: "Jordan: I’ll check the narrow layout.",
    description: "Artwork, reviews and shared ideas",
    participants: people,
    unread: 3,
    messages: [
      {
        id: "r0",
        author: "System",
        type: "system",
        text: "Today",
        time: "10:00",
      },
      {
        id: "r1",
        author: "Alex Rivera",
        authorId: "alex",
        text: "The updated artwork is ready for a review.",
        time: "10:14",
      },
      {
        id: "r2",
        author: "Alex Rivera",
        authorId: "alex",
        text: "I adjusted the spacing around the title too.",
        time: "10:15",
      },
      {
        id: "r3",
        author: "Sam Chen",
        authorId: "sam",
        text: "The title reads much better now. Can we try the blue version?",
        time: "10:16",
      },
      {
        id: "r4",
        author: "You",
        authorId: "you",
        text: "Yes, I’ll share both variations here.",
        time: "10:17",
        own: true,
      },
      {
        id: "r5",
        author: "Jordan Lee",
        authorId: "jordan",
        text: "Thanks! I’ll check the narrow layout.",
        time: "10:18",
      },
    ],
  },
  {
    id: "crew",
    kind: "group",
    group: "Groups",
    name: "Project crew",
    subject: "Jordan: I’ve added my notes.",
    participants: people,
    messages: [
      {
        id: "c1",
        author: "Sam Chen",
        authorId: "sam",
        text: "We have everyone we need for the review.",
        time: "09:40",
      },
      {
        id: "c2",
        author: "Jordan Lee",
        authorId: "jordan",
        text: "I’ve added my notes.",
        time: "09:42",
      },
    ],
  },
  {
    id: "alex",
    kind: "direct",
    group: "Direct messages",
    name: "Alex Rivera",
    subject: "Can I update the expiry date?",
    time: "5m",
    messages: [
      {
        id: "a1",
        author: "Alex Rivera",
        text: "Can I update the expiry date after sharing?",
        time: "10:14",
      },
      {
        id: "a2",
        author: "You",
        text: "Yes. Open the transfer and choose its expiry date.",
        time: "10:16",
        own: true,
      },
    ],
  },
];
export default function SupportInboxDemo() {
  const [threads, setThreads] = useState(initial),
    [value, setValue] = useState("room"),
    [template, setTemplate] = useState("channel"),
    [compact, setCompact] = useState(true),
    [avatars, setAvatars] = useState(true),
    [reactions, setReactions] = useState({}),
    toast = useToast();
  return (
    <Flex direction="column" style={{ width: "100%" }} gap={16}>
      <Flex gap={16}>
        <Segmented
          name="Conversation template"
          options={[
            { value: "channel", label: "Channel" },
            { value: "bubbles", label: "Bubbles" },
          ]}
          value={template}
          onChange={setTemplate}
        />
        <Switch label="Compact" checked={compact} onChange={setCompact} />
        <Switch label="Avatars" checked={avatars} onChange={setAvatars} />
      </Flex>
      <SupportInbox
        label="Messages"
        threads={threads}
        value={value}
        onValueChange={setValue}
        template={template}
        density={compact ? "compact" : "default"}
        showAvatars={avatars}
        height={480}
        onReply={(id, text) =>
          setThreads((all) =>
            all.map((thread) =>
              thread.id === id
                ? {
                    ...thread,
                    messages: [
                      ...thread.messages,
                      {
                        id: crypto.randomUUID(),
                        author: "You",
                        authorId: "you",
                        own: true,
                        text,
                        time: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }),
                      },
                    ],
                  }
                : thread,
            ),
          )
        }
        renderMessageActions={(message) =>
          message.id === "r3" ? (
            <Button
              size="sm"
              variant="ghost"
              aria-label="Appreciate message"
              onClick={() => {
                setReactions((old) => ({
                  ...old,
                  [message.id]: (old[message.id] ?? 1) + 1,
                }));
                toast("Reaction updated in this demo");
              }}
            >
              Thanks {reactions[message.id] ?? 1}
            </Button>
          ) : null
        }
      />
    </Flex>
  );
}
