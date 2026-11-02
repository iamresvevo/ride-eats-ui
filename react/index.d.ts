import type * as React from "react";
export interface Option {
  value: string;
  label: string;
  detail?: string;
  disabled?: boolean;
}
export interface NavItem {
  value: string;
  label: string;
  href: string;
  icon?: string;
}
export interface Account {
  name: string;
  email?: string;
  avatar?: string;
  verified?: boolean;
}
export interface MenuRow {
  id?: string;
  type?: "separator" | "label";
  label?: React.ReactNode;
  icon?: string;
  value?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  danger?: boolean;
  closesMenu?: boolean;
  onSelect?: () => void;
  items?: MenuRow[];
}
export interface HeaderProps extends StylingProps {
  brand: { name: string; href?: string; logoLight?: string; logoDark?: string };
  items?: NavItem[];
  activeValue?: string;
  busy?: boolean;
  onNavigate?: (item: NavItem) => void;
  account?: Account | null;
  loading?: boolean;
  onSignOut?: () => void | Promise<void>;
  signingOut?: boolean;
  menuContent?: React.ReactNode;
  guestContent?: React.ReactNode;
  extras?: React.ReactNode;
}
export function Header(props: HeaderProps): React.ReactElement;
export function AccountMenu(props: {
  account?: Account | null;
  ready?: boolean;
  onSignOut?: () => void | Promise<void>;
  menuContent?: React.ReactNode;
  signingOut?: boolean;
  guestContent?: React.ReactNode;
}): React.ReactElement;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "brand" | "secondary" | "ghost" | "danger" | "surface";
  size?: "sm" | "lg";
  icon?: string;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}
export function Button(props: ButtonProps): React.ReactElement;
export function Dropdown(
  props: StylingProps & {
    trigger?: React.ReactNode;
    items: MenuRow[];
    align?: "start" | "end";
    label?: string;
  },
): React.ReactElement;
export function Menu(props: {
  trigger: (
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      ref: React.Ref<HTMLButtonElement>;
    },
  ) => React.ReactNode;
  align?: "start" | "end";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}): React.ReactElement;
export function MenuItem(props: {
  icon?: string;
  danger?: boolean;
  checked?: boolean;
  disabled?: boolean;
  closesMenu?: boolean;
  onSelect?: () => void;
  children?: React.ReactNode;
}): React.ReactElement;
export function MenuSub(props: {
  id: string;
  icon?: string;
  label: React.ReactNode;
  value?: React.ReactNode;
  children?: React.ReactNode;
}): React.ReactElement;
export function MenuLabel(props: {
  children?: React.ReactNode;
}): React.ReactElement;
export function MenuSeparator(): React.ReactElement;
export interface TabItem {
  value: string;
  label: React.ReactNode;
  count?: number;
  id?: string;
  panelId?: string;
}
export function Tabs(
  props: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
    items: TabItem[];
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
  },
): React.ReactElement;
export function Chips(
  props: StylingProps & {
    items: TabItem[];
    value: string;
    onValueChange: (value: string) => void;
  },
): React.ReactElement;
export function Select(
  props: StylingProps & {
    options: (Omit<Option, "label"> & { label: React.ReactNode })[];
    renderValue?: (
      option: (Omit<Option, "label"> & { label: React.ReactNode }) | undefined,
    ) => React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    disabled?: boolean;
  },
): React.ReactElement;
export function SearchSelect(
  props: StylingProps & {
    label?: string;
    load: (query: string) => Promise<Option[]>;
    value?: Option[];
    onValueChange: (items: Option[]) => void;
    max?: number;
    placeholder?: string;
    disabled?: boolean;
    renderOption?: (item: Option) => React.ReactNode;
    renderSelected?: (item: Option) => React.ReactNode;
  },
): React.ReactElement;
export function Switch(props: {
  icon?: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}): React.ReactElement;
export function SettingRow(props: {
  icon?: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  wide?: boolean;
  children?: React.ReactNode;
}): React.ReactElement;
export function DateTimePicker(
  props: StylingProps & {
    label?: string;
    locale?: string;
    disabled?: boolean;
    value: number;
    future?: boolean;
    onChange: (unixSeconds: number) => void;
  },
): React.ReactElement;
export function Dialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  dismissible?: boolean;
  beforeClose?: () => boolean | Promise<boolean>;
  className?: string;
  style?: React.CSSProperties;
}): React.ReactElement | null;
export function Modal(props: {
  open?: boolean;
  onAfterClose?: () => void;
  size?: "sm" | "lg";
  className?: string;
  title?: React.ReactNode;
  label?: string;
  labelledBy?: string;
  dismissable?: boolean;
  closeOnBackdrop?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}): React.ReactElement;
export function Skeleton(props: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}): React.ReactElement;
export function Bone(props: { className?: string }): React.ReactElement;
export function BoneText(props: {
  ch?: 3 | 6 | 10 | 16 | 24 | 36;
}): React.ReactElement;
export function Avatar(props: {
  name: string;
  src?: string;
  className?: string;
}): React.ReactElement;
export function VerifiedName(props: {
  name: string;
  verified?: boolean;
  className?: string;
}): React.ReactElement;
export function VerificationBadge(props: {
  verified?: boolean;
}): React.ReactElement | null;
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  name: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  title?: string;
  playing?: boolean;
  loop?: boolean;
  motion?: "auto" | "none" | "draw" | "spin" | "pulse" | "bounce" | "rotate";
  animateOn?: "hover" | "always";
}
export function Icon(props: IconProps): React.ReactElement;
export function IconProvider(props: {
  icons: Record<string, React.ReactNode>;
  children?: React.ReactNode;
}): React.ReactElement;
export const iconNames: readonly string[];
export function Badge(
  props: React.HTMLAttributes<HTMLSpanElement> & {
    tone?: "neutral" | "good" | "wait" | "bad";
    children?: React.ReactNode;
  },
): React.ReactElement;
export function Stat(
  props: React.HTMLAttributes<HTMLDivElement> & {
    label: React.ReactNode;
    value: React.ReactNode;
    hint?: React.ReactNode;
    tone?: "good" | "bad" | "";
  },
): React.ReactElement;
export function Card(
  props: Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    variant?: "default" | "soft" | "plain";
    padding?: "default" | "sm" | "none";
    children?: React.ReactNode;
  },
): React.ReactElement;
export function Field(
  props: StylingProps & {
    label: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    id?: string;
    children: React.ReactElement;
  },
): React.ReactElement;
export function EmptyState(
  props: StylingProps & {
    title: React.ReactNode;
    description?: React.ReactNode;
    icon?: string | false;
    illustration?: React.ReactNode;
    action?: React.ReactNode;
  },
): React.ReactElement;
export function Pagination(props: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}): React.ReactElement | null;
export type Theme = "system" | "light" | "dark";
export function ThemeProvider(props: {
  children?: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}): React.ReactElement;
export function useTheme(): {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};
export function ToastProvider(props: {
  maxVisible?: number;
  children?: React.ReactNode;
}): React.ReactElement;
export function useToast(): (
  message: React.ReactNode,
  options?: {
    tone?: "neutral" | "good" | "bad";
    duration?: number;
    id?: string;
  },
) => void;

export function UIProvider(props: {
  toastOptions?: { maxVisible?: number };
  icons?: Record<string, React.ReactNode>;
  children?: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}): React.ReactElement;
export function Tooltips(): React.ReactElement | null;
export function PageLoading(props: { label?: string }): React.ReactElement;

export function Segmented(props: {
  label?: string;
  icon?: string;
  name?: string;
  options: {
    value: string;
    label?: React.ReactNode;
    icon?: string;
    title?: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  fit?: boolean;
}): React.ReactElement;

export interface StylingProps {
  className?: string;
  style?: React.CSSProperties;
}
export interface ConfirmOptions {
  title: React.ReactNode;
  message?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  danger?: boolean;
}
export function useConfirm(): (options: ConfirmOptions) => Promise<boolean>;
export function useFeedback(): {
  toast: ReturnType<typeof useToast>;
  confirm: ReturnType<typeof useConfirm>;
};
export const FeedbackProvider: typeof ToastProvider;
export function Accordion(
  props: StylingProps & {
    items: {
      value: string;
      title: React.ReactNode;
      content: React.ReactNode;
      icon?: string;
    }[];
    value: string | null;
    onValueChange: (value: string | null) => void;
    label?: string;
  },
): React.ReactElement;
export function Alert(
  props: StylingProps & {
    tone?: "neutral" | "good" | "bad";
    title: React.ReactNode;
    children?: React.ReactNode;
    onDismiss?: () => void;
    action?: React.ReactNode;
  },
): React.ReactElement;
export function Checkbox(
  props: StylingProps & {
    checked: boolean;
    onCheckedChange: (value: boolean) => void;
    label: React.ReactNode;
    hint?: React.ReactNode;
    disabled?: boolean;
    indeterminate?: boolean;
    inputProps?: Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "checked" | "onChange" | "type"
    >;
  },
): React.ReactElement;
export function RadioGroup(
  props: StylingProps & {
    options: {
      value: string;
      label: React.ReactNode;
      description?: React.ReactNode;
      trailing?: React.ReactNode;
      disabled?: boolean;
    }[];
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    name?: string;
    disabled?: boolean;
  },
): React.ReactElement;
export function Slider(
  props: StylingProps & {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    formatValue?: (value: number) => string;
    disabled?: boolean;
  },
): React.ReactElement;
export function Progress(
  props: StylingProps & {
    value?: number;
    max?: number;
    label?: string;
    hint?: React.ReactNode;
    indeterminate?: boolean;
  },
): React.ReactElement;
export function PasswordInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label?: React.ReactNode;
    hint?: React.ReactNode;
  },
): React.ReactElement;
export function NumberInput(
  props: StylingProps & {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    disabled?: boolean;
  },
): React.ReactElement;
export function Breadcrumbs(
  props: StylingProps & {
    items: { label: React.ReactNode; href?: string }[];
    label?: string;
  },
): React.ReactElement;
export function AvatarGroup(
  props: StylingProps & {
    people: { id?: string | number; name: string; src?: string }[];
    max?: number;
    size?: number;
    overlap?: number;
    onMore?: () => void;
    label?: string;
  },
): React.ReactElement;
export function CopyButton(
  props: StylingProps & {
    value: string;
    label?: React.ReactNode;
    copiedLabel?: React.ReactNode;
    onCopy?: () => void;
    onError?: (error: unknown) => void;
  },
): React.ReactElement;
export function FileDropzone(
  props: StylingProps & {
    onFiles: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    maxSize?: number;
    label?: React.ReactNode;
    description?: React.ReactNode;
  },
): React.ReactElement;
export function Timeline(
  props: StylingProps & {
    items: {
      id?: string | number;
      title: React.ReactNode;
      description?: React.ReactNode;
      time?: React.ReactNode;
      dateTime?: string;
      icon?: string;
      tone?: string;
    }[];
    label?: string;
  },
): React.ReactElement;
export function Drawer(
  props: StylingProps & {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    side?: "left" | "right";
  },
): React.ReactElement | null;
export interface TableSort {
  key: string;
  direction: "asc" | "desc";
}
export interface TableColumn<T> {
  key: Extract<keyof T, string>;
  label: React.ReactNode;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: React.CSSProperties["width"];
  align?: "left" | "center" | "right";
}
export function DataTable<T extends Record<string, unknown>>(
  props: StylingProps & {
    columns: TableColumn<T>[];
    rows: T[];
    rowKey?:
      Extract<keyof T, string> | ((row: T, index: number) => string | number);
    caption?: React.ReactNode;
    emptyText?: React.ReactNode;
    emptyContent?: React.ReactNode;
    loading?: boolean;
    sort?: TableSort;
    onSortChange?: (sort: TableSort) => void;
    onRowClick?: (row: T) => void;
    selectedKeys?: (string | number)[];
    onSelectionChange?: (keys: (string | number)[]) => void;
    rowActions?: (row: T) => React.ReactNode;
    density?: "compact" | "comfortable";
  },
): React.ReactElement;
export function CardHeader(
  props: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
  },
): React.ReactElement;
export function CardBody(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement;
export function CardFooter(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement;
export function MetricGrid(
  props: React.HTMLAttributes<HTMLDivElement> & { minWidth?: number },
): React.ReactElement;
export function StatCard(
  props: React.HTMLAttributes<HTMLElement> & {
    label: React.ReactNode;
    value: React.ReactNode;
    hint?: React.ReactNode;
    icon?: string;
    tone?: "neutral" | "good" | "bad";
    trend?: React.ReactNode;
    trendLabel?: React.ReactNode;
    chart?: number[];
    progress?: number;
    variant?: "default" | "compact" | "inline" | "hero";
  },
): React.ReactElement;
export function Tile(
  props: StylingProps & {
    title: React.ReactNode;
    description?: React.ReactNode;
    icon?: string;
    image?: string;
    meta?: React.ReactNode;
    footer?: React.ReactNode;
    href?: string;
    onClick?: React.MouseEventHandler;
    disabled?: boolean;
  },
): React.ReactElement;
export function PageHeader(
  props: React.HTMLAttributes<HTMLElement> & {
    title: string;
    description?: React.ReactNode;
    eyebrow?: React.ReactNode;
    icon?: string;
    image?: string;
    actions?: React.ReactNode;
  },
): React.ReactElement;
export function Toolbar(
  props: React.HTMLAttributes<HTMLDivElement> & { trailing?: React.ReactNode },
): React.ReactElement;

export type AnimatedIconName = string;
export const animatedIconNames: AnimatedIconName[];
export function AnimatedIcon(
  props: Omit<React.SVGProps<SVGSVGElement>, "name"> & {
    name: AnimatedIconName;
    size?: number;
    strokeWidth?: number;
    playing?: boolean;
    loop?: boolean;
    label?: string;
  },
): React.ReactElement;
export function Popover(
  props: StylingProps & {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    trigger: (
      props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        ref: React.Ref<HTMLButtonElement>;
      },
    ) => React.ReactNode;
    children?: React.ReactNode;
    label?: string;
    align?: "start" | "end";
    width?: number;
  },
): React.ReactElement;
export function Collapsible(
  props: StylingProps & {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    title: React.ReactNode;
    children?: React.ReactNode;
  },
): React.ReactElement;
export function Steps(
  props: StylingProps & {
    items: {
      value: string;
      label: React.ReactNode;
      description?: React.ReactNode;
    }[];
    value: string;
    onValueChange?: (value: string) => void;
    label?: string;
    orientation?: "horizontal" | "vertical";
  },
): React.ReactElement;
export function PinInput(
  props: StylingProps & {
    value: string;
    onValueChange: (value: string) => void;
    length?: number;
    label?: string;
    disabled?: boolean;
    onComplete?: (value: string) => void;
  },
): React.ReactElement;
export function ToggleGroup(
  props: StylingProps & {
    items: {
      value: string;
      label: string;
      icon?: string;
      disabled?: boolean;
    }[];
    value: string | null;
    onValueChange: (value: string | null) => void;
    multiple?: false;
    disabled?: boolean;
    label?: string;
  },
): React.ReactElement;
export function ToggleGroup(
  props: StylingProps & {
    items: {
      value: string;
      label: string;
      icon?: string;
      disabled?: boolean;
    }[];
    value: string[];
    onValueChange: (value: string[]) => void;
    multiple: true;
    disabled?: boolean;
    label?: string;
  },
): React.ReactElement;
export function Rating(
  props: StylingProps & {
    value: number;
    onValueChange: (value: number) => void;
    max?: number;
    label?: string;
    readOnly?: boolean;
  },
): React.ReactElement;
export function ScrollArea(
  props: StylingProps & {
    children?: React.ReactNode;
    header?: React.ReactNode;
    height?: React.CSSProperties["maxHeight"];
    label?: string;
  },
): React.ReactElement;
export function Separator(
  props: StylingProps & {
    label?: React.ReactNode;
    orientation?: "horizontal" | "vertical";
  },
): React.ReactElement;
export function CommandMenu(
  props: StylingProps & {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    items: {
      value: string;
      label: string;
      icon?: string;
      keywords?: string;
      shortcut?: string;
      disabled?: boolean;
      onSelect?: () => void;
    }[];
    label?: string;
    placeholder?: string;
    shortcut?: boolean;
  },
): React.ReactElement;

export function ReorderList<T>(
  props: StylingProps & {
    items: T[];
    onReorder: (items: T[]) => void;
    getItemKey?: (item: T) => string | number;
    renderItem?: (item: T, index: number) => React.ReactNode;
    label?: string;
    disabled?: boolean;
  },
): React.ReactElement;
export function SwipeActions(
  props: StylingProps & {
    children: React.ReactNode;
    actions: {
      value: string;
      label: string;
      icon?: string;
      destructive?: boolean;
      onSelect?: () => void;
    }[];
    label?: string;
  },
): React.ReactElement;
export function Carousel<T>(
  props: StylingProps & {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    label?: string;
  },
): React.ReactElement;
export function SplitPane(
  props: StylingProps & {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    first: React.ReactNode;
    second: React.ReactNode;
    label?: string;
  },
): React.ReactElement;
export function RangeSlider(
  props: StylingProps & {
    value: [number, number];
    onValueChange: (value: [number, number]) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    formatValue?: (value: number) => string;
    disabled?: boolean;
  },
): React.ReactElement;
