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
export interface HeaderProps {
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
export function Dropdown(props: {
  trigger?: React.ReactNode;
  items: MenuRow[];
  align?: "start" | "end";
  label?: string;
}): React.ReactElement;
export function Menu(props: {
  trigger: (
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      ref: React.Ref<HTMLButtonElement>;
    },
  ) => React.ReactNode;
  align?: "start" | "end";
  className?: string;
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
export function Chips(props: {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
}): React.ReactElement;
export function Select(props: {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}): React.ReactElement;
export function SearchSelect(props: {
  label?: string;
  load: (query: string) => Promise<Option[]>;
  value?: Option[];
  onValueChange: (items: Option[]) => void;
  max?: number;
  placeholder?: string;
}): React.ReactElement;
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
export function DateTimePicker(props: {
  value: number;
  future?: boolean;
  onChange: (unixSeconds: number) => void;
}): React.ReactElement;
export function Dialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  dismissible?: boolean;
}): React.ReactElement | null;
export function Modal(props: {
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
export function Icon(props: { name: string }): React.ReactElement;
export function Badge(props: {
  tone?: "neutral" | "good" | "wait" | "bad";
  children?: React.ReactNode;
}): React.ReactElement;
export function Stat(props: {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "good" | "bad" | "";
}): React.ReactElement;
export function Card(
  props: React.HTMLAttributes<HTMLElement> & {
    title?: string;
    children?: React.ReactNode;
  },
): React.ReactElement;
export function Field(props: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  id?: string;
  children: React.ReactElement;
}): React.ReactElement;
export function EmptyState(props: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: string;
  action?: React.ReactNode;
}): React.ReactElement;
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
  children?: React.ReactNode;
}): React.ReactElement;
export function useToast(): (
  message: React.ReactNode,
  options?: { tone?: "neutral" | "good" | "bad"; duration?: number },
) => void;

export function UIProvider(props: {
  children?: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}): React.ReactElement;
export function Tooltips(): React.ReactElement | null;
export function PageLoading(props: { label?: string }): React.ReactElement;
