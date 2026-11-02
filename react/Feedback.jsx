import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Modal from "./send/ui/Modal.jsx";
import ActionButton from "./send/ActionButton.jsx";
import Icon from "./send/Icon.jsx";

// Send Feedback's bounded depth stack and two-phase expiry, with tone and deduplication.
function Toast({ item, depth, onRemove }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const hide = setTimeout(() => setLeaving(true), item.duration);
    const remove = setTimeout(() => onRemove(item.id), item.duration + 240);
    return () => {
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [item.id, item.duration, onRemove]);
  return (
    <div
      className={`re-toast${leaving ? " is-leaving" : ""}`}
      inert={depth > 0}
      style={{ "--toast-depth": depth, zIndex: 10 - depth }}
    >
      <div className={`re-toast-content ${item.tone}`}>
        {item.tone !== "neutral" && (
          <Icon name={item.tone === "bad" ? "warning" : "check"} />
        )}
        <span>{item.message}</span>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => setLeaving(true)}
          className="re-toast-dismiss"
        >
          <Icon name="close" />
        </button>
      </div>
      {leaving && <ExitTimer onDone={() => onRemove(item.id)} />}
    </div>
  );
}
function ExitTimer({ onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 240);
    return () => clearTimeout(id);
  }, [onDone]);
  return null;
}
const FeedbackContext = createContext({
  toast: () => {},
  confirm: () => Promise.resolve(false),
});
export function ToastProvider({ children, maxVisible = 3 }) {
  const [toasts, setToasts] = useState([]),
    [requests, setRequests] = useState([]);
  const pending = useRef(new Map());
  const serial = useRef(0);
  const titleId = useId();
  const toast = useCallback(
    (message, { tone = "neutral", duration = 5000, id: dedupeId } = {}) => {
      if (message == null || message === "") return;
      const id = ++serial.current;
      const item = {
        id,
        message,
        tone,
        duration: Math.max(0, duration),
        key:
          dedupeId ?? (typeof message === "string" ? tone + ":" + message : id),
      };
      setToasts((current) =>
        [item, ...current.filter((old) => old.key !== item.key)].slice(
          0,
          Math.max(1, Math.min(5, maxVisible)),
        ),
      );
      return id;
    },
    [maxVisible],
  );
  const remove = useCallback(
    (id) => setToasts((current) => current.filter((item) => item.id !== id)),
    [],
  );
  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        const id = ++serial.current;
        pending.current.set(id, resolve);
        setRequests((current) => [...current, { ...options, id }]);
      }),
    [],
  );
  useEffect(
    () => () => {
      pending.current.forEach((resolve) => resolve(false));
      pending.current.clear();
    },
    [],
  );
  const answer = useCallback((id, value) => {
    const resolve = pending.current.get(id);
    pending.current.delete(id);
    setRequests((current) => current.filter((item) => item.id !== id));
    resolve?.(value);
  }, []);
  const context = useMemo(() => ({ toast, confirm }), [toast, confirm]);
  const request = requests[0];
  return (
    <FeedbackContext.Provider value={context}>
      {children}
      {request && (
        <Modal
          key={request.id}
          labelledBy={titleId}
          className="confirm-dialog"
          onClose={() => answer(request.id, false)}
        >
          <div className={`confirm-symbol ${request.danger ? "danger" : ""}`}>
            <Icon name={request.danger ? "warning" : "message"} />
          </div>
          <h2 id={titleId}>{request.title}</h2>
          <p>{request.message}</p>
          <div className="dialog-actions">
            <ActionButton
              className="btn-ghost"
              autoFocus
              onClick={() => answer(request.id, false)}
            >
              {request.cancelLabel || "Cancel"}
            </ActionButton>
            <ActionButton
              className={request.danger ? "btn-danger" : "btn-primary"}
              onClick={() => answer(request.id, true)}
            >
              {request.confirmLabel || "Confirm"}
            </ActionButton>
          </div>
        </Modal>
      )}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            className="re-toast-stack"
            role="status"
            aria-live="polite"
            aria-relevant="additions"
            aria-atomic="false"
          >
            {toasts.map((item, depth) => (
              <Toast
                key={item.id}
                item={item}
                depth={depth}
                onRemove={remove}
              />
            ))}
          </div>,
          document.body,
        )}
    </FeedbackContext.Provider>
  );
}
export const FeedbackProvider = ToastProvider;
export const useToast = () => useContext(FeedbackContext).toast;
export const useConfirm = () => useContext(FeedbackContext).confirm;
export const useFeedback = () => useContext(FeedbackContext);
