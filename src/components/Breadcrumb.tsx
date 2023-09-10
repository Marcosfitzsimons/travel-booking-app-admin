interface BreadcrumbProps {
  children: React.ReactNode;
}

const Breadcrumb = ({ children }: BreadcrumbProps) => {
  return <div>{children}</div>;
};

export default Breadcrumb;
