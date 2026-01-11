import Link from "next/link";
import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";

type EntityContinerProps = {
  children?: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
}

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContinerProps) => (
  <div className="h-full px-4 md:px-10 md:py-6">
    <div className="flex flex-col gap-y-8 w-full max-w-7xl h-full mx-auto">
      {header}
      <div className="flex flex-col gap-y-4 h-full">
        {search}
        {children}
      </div>
      {pagination}
    </div>
  </div>
);

type EntityHeaderProps = {
  title: string;
  newButtonLabel: string;
  description?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never; }
  | { newButtonHref: string; onNew?: never; }
  | { onNew?: never; newButtonHref?: never; }
);

export const EntityHeader = ({
  title,
  description,
  newButtonLabel,
  newButtonHref,
  disabled,
  isCreating,
  onNew,
}: EntityHeaderProps) => (
  <div className="flex flex-row justify-between items-center gap-x-4">
    <div className="flex flex-col">
      <h1 className="font-semibold text-lg md:text-xl">{title}</h1>
      {description && (
        <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
      )}
    </div>

    {onNew && !newButtonHref && (
      <Button
        size="sm"
        disabled={isCreating || disabled}
        onClick={onNew}
      >
        <PlusIcon size={16} />
        {newButtonLabel}
      </Button>
    )}

    {newButtonHref && !onNew && (
      <Button size="sm" asChild>
        <PlusIcon size={16} />
        {newButtonLabel}
      </Button>
    )}
  </div>
);

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  placeholder,
  onChange,
}: EntitySearchProps) => (
  <div className="relative ml-auto">
    <SearchIcon className="absolute top-1/2 left-2 -translate-y-1/2 size-4 text-muted-foreground" />
    <Input
      value={value}
      aria-label={placeholder}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="max-w-[200px] pl-8 border-border shadow-none bg-background"
    />
  </div>
);

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  disabled,
  onPageChange,
}: EntityPaginationProps) => (
  <div className="flex justify-between items-center gap-x-2 w-full">
    <div className="flex-1 text-sm text-muted-foreground">
      Page {page} of {totalPages || 1}
    </div>
    <div className="flex justify-end items-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        disabled={(page === 1) || disabled}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Prev
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={(page === totalPages) || (totalPages === 0) || disabled}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Next
      </Button>
    </div>
  </div>
);

type EntityListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export const EntityList = <T,>({
  items,
  emptyView,
  className,
  renderItem,
  getKey,
}:EntityListProps<T>) => {

  if ((items.length === 0) && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">
          {emptyView}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

type EntityItemProps = {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  isRemoving?: boolean;
  onRemove?: () => void | Promise<void>;
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  className,
  isRemoving,
  onRemove,
}: EntityItemProps) => {

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;

    if (onRemove) {
      await onRemove();
    }
  }

  return (
    <Link href={href} prefetch>
      <Card className={cn(
        "p-4 shadow-none cursor-pointer hover:shadow",
        isRemoving && "opacity-50 cursor-not-allowed",
        className
      )}>
        <CardContent className="flex flex-row justify-between items-center p-0">
          <div className="flex items-center gap-x-3">
            {image}
            <div>
              <CardTitle className="font-medium text-base">{title}</CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs">{subtitle}</CardDescription>
              )}
            </div>
          </div>

          {(actions || onRemove) && (
            <div className="flex items-center gap-x-4">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreVerticalIcon size={16} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    onClick={e => e.stopPropagation()}
                  >
                    <DropdownMenuItem disabled={isRemoving} onClick={handleRemove}>
                      <TrashIcon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}


interface StateViewProps {
  message?: string;
}

export const LoadingView = ({ message }: StateViewProps) => (
  <div className="flex-1 flex flex-col justify-center items-center gap-y-4 h-full">
    <Loader2Icon className="size-6 text-primary animate-spin" />
    {!!message && (
      <p className="text-sm text-muted-foreground">{message}</p>
    )}
  </div>
);

export const ErrorView = ({ message }: StateViewProps) => (
  <div className="flex-1 flex flex-col justify-center items-center gap-y-4 h-full">
    <AlertTriangleIcon className="size-6 text-primary" />
    {!!message && (
      <p className="text-sm text-muted-foreground">{message}</p>
    )}
  </div>
);

interface EmptyViewProps extends StateViewProps {
  disabled?: boolean;
  onNew?: () => void;
}

export const EmptyView = ({ message, disabled, onNew }: EmptyViewProps) => (
  <Empty className="border border-dashed bg-white">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <PackageOpenIcon />
      </EmptyMedia>
    </EmptyHeader>

    <EmptyTitle>No items</EmptyTitle>
    {!!message && <EmptyDescription>{message}</EmptyDescription>}

    {!!onNew && (
      <EmptyContent>
        <Button
          disabled={disabled || false}
          onClick={onNew}
        >
          Add item
        </Button>
      </EmptyContent>
    )}
  </Empty>
);