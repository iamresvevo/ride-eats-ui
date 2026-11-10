import type * as React from "react";
export interface Option {
  placeholder?: boolean;
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
  count?: number;
  badge?: React.ReactNode;
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
  fade?: boolean;
  fadeSize?: number;
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
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
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
    width?: "fit" | "full";
    variant?: "pill" | "flat";
  },
): React.ReactElement;
export function Select(
  props: StylingProps &
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "value" | "onChange" | "children"
    > & {
      placeholder?: string;
      options: (Omit<Option, "label"> & { label: React.ReactNode })[];
      renderValue?: (
        option:
          (Omit<Option, "label"> & { label: React.ReactNode }) | undefined,
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
    dateOnly?: boolean;
    min?: number;
    max?: number;
    empty?: boolean;
    onClear?: () => void;
    id?: string;
    onChange: (unixSeconds: number) => void;
  },
): React.ReactElement;
export function Dialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  toolbar?: React.ReactNode;
  scroll?: "body" | "dialog";
  size?: "sm" | "md" | "lg";
  dismissible?: boolean;
  beforeClose?: () => boolean | Promise<boolean>;
  label?: string;
  labelledBy?: string;
  onAfterClose?: () => void;
  closeOnBackdrop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}): React.ReactElement | null;
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
    labelHidden?: boolean;
    /** "inline" puts the label on the left and the control on the right. */
    layout?: "stacked" | "inline";
    hint?: React.ReactNode;
    error?: React.ReactNode;
    warning?: React.ReactNode;
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
  accent?: string;
  accentForeground?: string;
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
    buttonStep?: number;
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
    variant?: "default" | "compact";
    preview?: string;
    previewAlt?: string;
    label?: React.ReactNode;
    onRemove?: () => void;
    removeLabel?: string;
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
    variant?: "timeline" | "feed";
    emptyText?: string;
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
  wrap?: boolean;
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
    variant?: "auto" | "standalone" | "inset";
    cellAlign?: "top" | "middle" | "bottom";
  },
): React.ReactElement;
export function CardHeader(
  props: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    title?: React.ReactNode;
    headingLevel?: 2 | 3 | 4;
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
export function Flex(
  props: React.HTMLAttributes<HTMLDivElement> & {
    direction?: "row" | "column";
    gap?: number;
    align?: "start" | "end" | "center" | "stretch" | "baseline";
    justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    wrap?: boolean;
  },
): React.ReactElement;
export function Masonry(
  props: React.HTMLAttributes<HTMLDivElement> & {
    min?: number;
    columns?: number;
    gap?: number;
  },
): React.ReactElement;
export function Grid(
  props: React.HTMLAttributes<HTMLDivElement> & {
    min?: number;
    preset?: "metrics";
    columns?: number;
    density?: "default" | "compact";
    layout?: "auto" | "sidebar" | "aside" | "split";
    sidebarWidth?: number;
    ratio?: [number, number];
    gap?: number;
    align?: "start" | "center" | "end" | "stretch";
  },
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
    variant?: "default" | "row";
    selected?: boolean;
    density?: "default" | "compact";
    imageSize?: number;
    imageFit?: "contain" | "cover";
    titleLines?: number;
    showFooter?: boolean;
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
  props: React.HTMLAttributes<HTMLDivElement> & {
    trailing?: React.ReactNode;
    align?: "start" | "center" | "end";
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
    width?: number | string;
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
export interface ToggleItem {
  value: string;
  label: React.ReactNode;
  icon?: string;
  disabled?: boolean;
}
export interface ToggleGroupBase extends StylingProps {
  items: ToggleItem[];
  label?: string;
  disabled?: boolean;
  variant?: "toggle" | "chips";
}
export function ToggleGroup(
  props: ToggleGroupBase & {
    multiple?: false;
    variant: "chips";
    allowEmpty?: false;
    value: string;
    onValueChange: (value: string) => void;
  },
): React.ReactElement;
export function ToggleGroup(
  props: ToggleGroupBase & {
    multiple?: false;
    allowEmpty: false;
    value: string;
    onValueChange: (value: string) => void;
  },
): React.ReactElement;
export function ToggleGroup(
  props: ToggleGroupBase & {
    multiple?: false;
    allowEmpty?: boolean;
    value: string | null;
    onValueChange: (value: string | null) => void;
  },
): React.ReactElement;
export function ToggleGroup(
  props: ToggleGroupBase & {
    multiple: true;
    allowEmpty?: boolean;
    value: string[];
    onValueChange: (value: string[]) => void;
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
export interface CommandItem {
  value: string;
  label: string;
  description?: string;
  group?: string;
  icon?: string;
  keywords?: string;
  shortcut?: string;
  disabled?: boolean;
  onSelect?: () => void | Promise<void>;
  items?: CommandItem[];
}
export function CommandMenu(
  props: StylingProps & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: CommandItem[];
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
      tone?: "neutral" | "accent" | "info" | "warning" | "danger";
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
    variant?: "surface" | "plain";
    /** Fill the viewport below the split; panes and their cards scroll inside,
     * card headers and footers stay put. Off while stacked. */
    fill?: boolean;
    /** Space kept below the split in fill mode, in px. */
    fillGap?: number;
    collapseAt?: number;
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

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
  },
): React.ReactElement;
export function Form<T extends Record<string, unknown>>(
  props: StylingProps & {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string | undefined>>;
    onSubmit: (values: T) => void | Promise<void>;
    children: (context: {
      values: T;
      errors: Partial<Record<keyof T, string | undefined>>;
      submitting: boolean;
      field: <K extends keyof T>(
        name: K,
      ) => {
        name: K;
        value: T[K];
        onChange: (
          event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >,
        ) => void;
        "aria-invalid"?: boolean;
      };
      setValue: <K extends keyof T>(name: K, value: T[K]) => void;
      reset: () => void;
    }) => React.ReactNode;
  },
): React.ReactElement;
export interface ComboboxOption {
  placeholder?: boolean;
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
export interface ComboboxProps extends StylingProps {
  labelHidden?: boolean;
  multiple?: false;
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  allowCustom?: boolean;
}
export function Combobox(props: ComboboxProps): React.ReactElement;
export function Combobox(
  props: Omit<
    ComboboxProps,
    "value" | "onValueChange" | "allowCustom" | "multiple"
  > & {
    multiple: true;
    value: string[];
    onValueChange: (value: string[]) => void;
  },
): React.ReactElement;
export interface DateRange {
  start: string;
  end: string;
}
export function DateRangePicker(
  props: StylingProps & {
    value: DateRange;
    onValueChange: (value: DateRange) => void;
    label?: string;
    locale?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
  },
): React.ReactElement;
export function TimePicker(
  props: StylingProps & {
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    min?: string;
    max?: string;
    step?: number;
    disabled?: boolean;
  },
): React.ReactElement;
export interface UploadFileState {
  id: string;
  name: string;
  status: "queued" | "uploading" | "done" | "error" | "cancelled";
  progress?: number;
  error?: string;
}
export function UploadProgress(
  props: StylingProps & {
    files: UploadFileState[];
    onCancel?: (id: string) => void;
    onRetry?: (id: string) => void;
  },
): React.ReactElement;
export interface DataGridColumn<T> {
  key: Extract<keyof T, string>;
  label?: React.ReactNode;
  width?: number;
  pinned?: boolean;
  sortable?: boolean;
  resizable?: boolean;
  align?: "left" | "right" | "center";
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  searchValue?: (row: T) => string;
  sortValue?: (row: T) => string | number;
}
export function DataGrid<T extends object>(
  props: StylingProps & {
    rows: T[];
    columns: DataGridColumn<T>[];
    getRowKey?: (row: T) => string | number;
    label?: string;
    pageSize?: number;
    virtual?: boolean;
    height?: number;
    rowHeight?: number;
    filters?: {
      key: Extract<keyof T, string>;
      label: string;
      options: { value: string; label: string }[];
    }[];
    bulkActions?: {
      value: string;
      label: string;
      onSelect: (rows: T[]) => void;
    }[];
    renderExpanded?: (row: T) => React.ReactNode;
    rowActions?: (row: T) => React.ReactNode;
    toolbarActions?: React.ReactNode;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
    emptyText?: string;
  },
): React.ReactElement;
export function WorkspaceSwitcher(
  props: StylingProps & {
    items: {
      value: string;
      label: string;
      description?: string;
      icon?: string;
      disabled?: boolean;
    }[];
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
  },
): React.ReactElement;
export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  read?: boolean;
  icon?: string;
}
export function NotificationCenter(props: {
  items: NotificationItem[];
  onRead?: (id: string) => void;
  onReadAll?: () => void;
  onSelect?: (item: NotificationItem) => void;
  label?: string;
}): React.ReactElement;
export function AppShell(
  props: StylingProps & {
    brand?: React.ReactNode;
    items: {
      value: string;
      label: string;
      icon?: string;
      count?: number;
      badge?: React.ReactNode;
      disabled?: boolean;
    }[];
    value: string;
    onValueChange: (value: string) => void;
    workspace?: React.ReactNode;
    search?: React.ReactNode;
    actions?: React.ReactNode;
    sidebarFooter?: React.ReactNode;
    children: React.ReactNode;
    collapsed?: boolean;
    onCollapsedChange?: (value: boolean) => void;
  },
): React.ReactElement;
export function BottomSheet(
  props: StylingProps & {
    open: boolean;
    onClose: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    height?: number | string;
  },
): React.ReactElement;
export interface ContextMenuItem {
  value: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
  onSelect?: () => void;
  items?: ContextMenuItem[];
}
export function ContextMenu(
  props: StylingProps & {
    items: ContextMenuItem[];
    children: React.ReactNode;
    label?: string;
  },
): React.ReactElement;
export function SettingsPanel(
  props: StylingProps & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    sections: {
      id: string;
      title: React.ReactNode;
      icon?: string;
      description?: React.ReactNode;
      children: React.ReactNode;
    }[];
    actions?: React.ReactNode;
  },
): React.ReactElement;
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}
export function TeamDirectory(
  props: StylingProps & {
    members: TeamMember[];
    onInvite?: (values: {
      name: string;
      email: string;
      role: string;
    }) => void | Promise<void>;
    onRoleChange?: (id: string, role: string) => void | Promise<void>;
    onRemove?: (id: string) => void | Promise<void>;
    roles?: string[];
  },
): React.ReactElement;
export interface ManagedFile {
  id: string;
  name: string;
  type?: "folder" | "file";
  size?: string;
  owner?: string;
  updated?: string;
}
export function FileManager(
  props: StylingProps & {
    files: ManagedFile[];
    onUpload?: (files: File[]) => void;
    onOpen?: (file: ManagedFile) => void;
    onDownload?: (files: ManagedFile[]) => void;
    onDelete?: (id: string) => void | Promise<void>;
  },
): React.ReactElement;
export interface SupportParticipant {
  id: string;
  name: string;
  avatar?: string;
}
export interface SupportMessage {
  id: string;
  author: string;
  authorId?: string;
  avatar?: string;
  text: string;
  time?: string;
  dateTime?: string;
  own?: boolean;
  type?: "message" | "system";
  groupWithPrevious?: boolean;
}
export interface SupportThread {
  id: string;
  name: string;
  subject?: string;
  description?: string;
  status?: string;
  time?: string;
  avatar?: string;
  kind?: "direct" | "group" | "channel";
  group?: string;
  unread?: number;
  participants?: SupportParticipant[];
  messages: SupportMessage[];
}
export interface SupportComposerContext {
  thread: SupportThread;
  value: string;
  onValueChange: (value: string) => void;
  onSend: () => Promise<void>;
  pending: boolean;
  error: string;
}
export function SupportInbox(
  props: StylingProps & {
    threads: SupportThread[];
    value: string;
    onValueChange: (id: string) => void;
    onReply?: (id: string, text: string) => void | Promise<void>;
    label?: string;
    template?: "bubbles" | "channel";
    density?: "default" | "compact";
    showAvatars?: boolean;
    groupConsecutive?: boolean;
    groupWindow?: number;
    showSidebar?: boolean;
    sidebarWidth?: number;
    height?: React.CSSProperties["height"];
    composerPlaceholder?: string;
    composerHint?: React.ReactNode;
    renderThread?: (
      thread: SupportThread,
      context: { selected: boolean },
    ) => React.ReactNode;
    renderHeader?: (thread: SupportThread) => React.ReactNode;
    renderMessage?: (
      message: SupportMessage,
      context: { thread: SupportThread; grouped: boolean },
    ) => React.ReactNode;
    renderMessageActions?: (
      message: SupportMessage,
      thread: SupportThread,
    ) => React.ReactNode;
    renderComposer?: (context: SupportComposerContext) => React.ReactNode;
  },
): React.ReactElement;
export function StickyBar(
  props: StylingProps & {
    children: React.ReactNode;
    offset?: number | string;
    fade?: boolean;
    /** @deprecated Ignored: the kit no longer uses blur effects. */
    blur?: boolean;
    label?: string;
  },
): React.ReactElement;

export function ScrollArea(
  props: React.HTMLAttributes<HTMLElement> & {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    label: string;
  },
): React.ReactElement;
export function Workbench(
  props: React.HTMLAttributes<HTMLDivElement> & {
    leadingWidth?: number;
    trailingWidth?: number;
    height?: string;
    gap?: number;
    dividers?: boolean;
  },
): React.ReactElement;

export function SectionNav(
  props: StylingProps & {
    items: { id: string; label: React.ReactNode; count?: number }[];
    label?: string;
    sticky?: boolean;
    offset?: number | string;
    value?: string;
    onValueChange?: (id: string) => void;
  },
): React.ReactElement;

export interface ComparisonImage {
  src: string;
  alt: string;
  label?: React.ReactNode;
}
export function ImageCompare(
  props: StylingProps & {
    before: ComparisonImage;
    after: ComparisonImage;
    value: number;
    onValueChange: (value: number) => void;
    label?: string;
    aspectRatio?: string;
    disabled?: boolean;
  },
): React.ReactElement;
export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  detail?: React.ReactNode;
  disabled?: boolean;
  children?: TreeNode[];
}
export function TreeView(
  props: StylingProps & {
    nodes: TreeNode[];
    value?: string;
    onValueChange: (id: string) => void;
    expandedKeys: string[];
    onExpandedChange: (ids: string[]) => void;
    label?: string;
  },
): React.ReactElement;
export interface SignaturePoint {
  x: number;
  y: number;
}
export type SignatureStroke = SignaturePoint[];
export function SignaturePad(
  props: StylingProps & {
    value: SignatureStroke[];
    onValueChange: (strokes: SignatureStroke[]) => void;
    label?: string;
    disabled?: boolean;
    strokeWidth?: number;
    emptyText?: string;
    footer?: React.ReactNode;
  },
): React.ReactElement;
export function ActivityHeatmap(
  props: StylingProps & {
    startDate: string;
    weeks?: number;
    values?: { date: string; value: number }[];
    value?: string;
    onValueChange?: (date: string) => void;
    label?: string;
    max?: number;
    locale?: string;
    formatValue?: (value: number) => string;
  },
): React.ReactElement;

export interface ShortcutBinding {
  keys: string[];
  label: string;
}
export function ShortcutRecorder(
  props: StylingProps & {
    value: string[];
    onValueChange: (keys: string[]) => void;
    label?: string;
    bindings?: ShortcutBinding[];
    disabled?: boolean;
    allowConflicts?: boolean;
  },
): React.ReactElement;
export function TextDiffViewer(
  props: StylingProps & {
    before: string;
    after: string;
    beforeLabel?: string;
    afterLabel?: string;
    label?: string;
    view?: "split" | "unified";
    onViewChange?: (view: "split" | "unified") => void;
    contextLines?: number;
    collapseUnchanged?: boolean;
    syncScroll?: boolean;
    maxHeight?: number | string;
  },
): React.ReactElement;

/** Native input props, including ref/id and Field associations, go to the input. */
export function InputGroup(
  props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    ref?: React.Ref<HTMLInputElement>;
  },
): React.ReactElement;
export function ButtonGroup(
  props: React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    label?: string;
    orientation?: "horizontal" | "vertical";
    attached?: boolean;
  },
): React.ReactElement;
export interface ColorPickerProps extends StylingProps {
  /** HEX, RGB or HSL input. Changes return canonical #rrggbb or #rrggbbaa. */
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  variant?: "inline" | "popover";
  alpha?: boolean;
  formats?: Array<"hex" | "rgb" | "hsl">;
  swatches?: Array<string | { value: string; label: string }>;
  eyedropper?: boolean;
  disabled?: boolean;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
}
export function ColorPicker(props: ColorPickerProps): React.ReactElement;

export interface GalleryImage {
  id: string | number;
  src?: string;
  title?: string;
  alt?: string;
  description?: string;
}
export function ImageThumbnail(props: {
  src?: string;
  load?: (options: { signal: AbortSignal }) => Promise<string>;
  alt?: string;
  label?: string;
  onClick?: () => void;
  size?: number;
}): React.ReactElement;
export function ImageGallery<T extends GalleryImage>(props: {
  items: T[];
  inline?: boolean;
  height?: React.CSSProperties["height"];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  onIndexChange?: (index: number) => void;
  loadImage?: (item: T, options: { signal: AbortSignal }) => Promise<string>;
  renderActions?: (item: T) => React.ReactNode;
  label?: string;
}): React.ReactElement;
