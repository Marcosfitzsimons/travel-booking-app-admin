import { ChevronRight, ChevronsRight, LucideIcon } from "lucide-react";

interface BreadcrumbProps {
  children: React.ReactNode;
  page: string;
  icon: React.ReactNode;
}

const Breadcrumb = ({ children, page, icon }: BreadcrumbProps) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <p className="flex items-center gap-1">
        {page}
        <ChevronsRight className="w-4 h-4" />
        <span className="font-bold">{children}</span>
      </p>
    </div>
  );
};

export default Breadcrumb;
